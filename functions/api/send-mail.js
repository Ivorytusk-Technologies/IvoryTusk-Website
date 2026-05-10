/**
 * Cloudflare Pages Function — generic SMTP mailer for site forms.
 *
 * POST /api/send-mail
 *   { "formType": "demo-request" | "contact" | string,
 *     "data":     { ...arbitrary fields... } }
 *
 * Sends a branded HTML email over an authenticated SMTP/465 connection
 * via `cloudflare:sockets`. SMTP runs in `ctx.waitUntil` so the browser
 * gets a sub-second response. Ported from liveloop-landing-page/worker.ts.
 *
 * Required Wrangler vars:    SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_FROM, NOTIFY_EMAILS
 * Required Wrangler secret:  SMTP_PASSWORD  (`wrangler secret put SMTP_PASSWORD`)
 */

import { connect } from 'cloudflare:sockets';

const ALLOWED_ORIGINS = [
  'https://ivorytusk.co.in',
  'https://www.ivorytusk.co.in',
  'https://ivorytusk-website.pages.dev',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8788',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8788',
];

const MAX_BODY_BYTES = 32 * 1024;
const MAX_FIELD_LEN = 5000;

export async function onRequestPost(context) {
  return handleSendMail(context);
}

export async function onRequestOptions(context) {
  const cors = corsHeadersFor(context.request.headers.get('Origin'));
  return new Response(null, { status: 204, headers: cors });
}

async function handleSendMail({ request, env, waitUntil }) {
  const origin = request.headers.get('Origin');
  const cors = corsHeadersFor(origin);

  if (!isAllowedRequest(request)) {
    return jsonResponse({ ok: false, error: 'Forbidden' }, 403, cors);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Content-Type must be application/json' }, 415, cors);
  }

  const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: 'Payload too large' }, 413, cors);
  }
  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: 'Payload too large' }, 413, cors);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400, cors);
  }

  const formType = (body && typeof body.formType === 'string') ? body.formType : 'generic';
  const data = (body && body.data && typeof body.data === 'object')
    ? body.data
    : Object.fromEntries(Object.entries(body || {}).filter(([k]) => k !== 'formType'));

  // Honeypot — silent success if a bot fills the trap field.
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return jsonResponse({ ok: true }, 200, cors);
  }
  if (typeof data._hp === 'string' && data._hp.trim() !== '') {
    return jsonResponse({ ok: true }, 200, cors);
  }

  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string' && v.length > MAX_FIELD_LEN) {
      return jsonResponse({ ok: false, error: `Field "${k}" is too long` }, 400, cors);
    }
  }

  if (!data.submittedAt) data.submittedAt = new Date().toISOString();
  if (!data.source) data.source = 'ivorytusk-website';

  let rendered;
  let replyTo;
  try {
    rendered = renderForType(formType, data);
    replyTo = typeof data.email === 'string' ? data.email : undefined;
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 400, cors);
  }

  const recipients = (env.NOTIFY_EMAILS || 'contact@ivorytusk.co.in')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const sendPromise = sendMail(env, {
    from: env.SMTP_FROM || 'IvoryTusk AI Solutions <support@ivorytusk.co.in>',
    to: recipients,
    replyTo,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  }).catch(err => {
    console.error('SMTP send failed:', err);
  });

  if (typeof waitUntil === 'function') {
    waitUntil(sendPromise);
  } else {
    await sendPromise;
  }

  return jsonResponse({ ok: true }, 200, cors);
}

function corsHeadersFor(origin) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function isAllowedRequest(request) {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  if (origin && ALLOWED_ORIGINS.includes(origin)) return true;
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (ALLOWED_ORIGINS.includes(refOrigin)) return true;
    } catch { /* invalid referer */ }
  }
  return false;
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function renderForType(formType, data) {
  switch (formType) {
    case 'demo-request':
    case 'demo-form':
    case 'contact':
    case 'contact-form':
    default:
      return renderGenericForm(formType, data);
  }
}

// =========================================================================
// SMTP client (implicit TLS, port 465)
// =========================================================================

async function sendMail(env, msg) {
  const host = env.SMTP_HOST || 'smtpout.secureserver.net';
  const port = parseInt(env.SMTP_PORT || '465', 10);
  const username = env.SMTP_USERNAME;
  const password = env.SMTP_PASSWORD;

  if (!username || !password) {
    throw new Error('SMTP credentials are not configured');
  }

  const socket = connect(
    { hostname: host, port },
    { secureTransport: 'on', allowHalfOpen: false }
  );

  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let buffer = '';

  const readLine = async () => {
    while (true) {
      const idx = buffer.indexOf('\r\n');
      if (idx >= 0) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        return line;
      }
      const { value, done } = await reader.read();
      if (done) {
        if (buffer.length > 0) {
          const line = buffer;
          buffer = '';
          return line;
        }
        throw new Error('SMTP connection closed unexpectedly');
      }
      buffer += decoder.decode(value, { stream: true });
    }
  };

  const readReply = async (expected) => {
    const lines = [];
    while (true) {
      const line = await readLine();
      lines.push(line);
      if (line.length < 4) throw new Error(`Bad SMTP line: ${line}`);
      const code = parseInt(line.slice(0, 3), 10);
      const sep = line[3];
      if (sep === ' ') {
        if (code !== expected) {
          throw new Error(`SMTP error: expected ${expected}, got ${lines.join(' | ')}`);
        }
        return lines.join('\n');
      }
    }
  };

  const send = async (line) => {
    await writer.write(encoder.encode(line + '\r\n'));
  };

  try {
    await readReply(220);
    await send('EHLO ivorytusk.co.in');
    await readReply(250);

    await send('AUTH LOGIN');
    await readReply(334);
    await send(btoa(username));
    await readReply(334);
    await send(btoa(password));
    await readReply(235);

    const fromAddr = extractEmail(msg.from);
    await send(`MAIL FROM:<${fromAddr}>`);
    await readReply(250);

    for (const recipient of msg.to) {
      await send(`RCPT TO:<${extractEmail(recipient)}>`);
      await readReply(250);
    }

    await send('DATA');
    await readReply(354);

    const mime = buildMimeMessage(msg);
    await writer.write(encoder.encode(mime));
    await send('.');
    await readReply(250);

    await send('QUIT');
    try { await readReply(221); } catch { /* ignore */ }
  } finally {
    try { writer.releaseLock(); } catch { /* ignore */ }
    try { reader.releaseLock(); } catch { /* ignore */ }
    try { await socket.close(); } catch { /* ignore */ }
  }
}

function extractEmail(addr) {
  const m = addr.match(/<([^>]+)>/);
  return m ? m[1] : addr.trim();
}

function buildMimeMessage(msg) {
  const boundary = `----=_IvoryTusk_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const date = new Date().toUTCString();
  const headers = [
    `From: ${msg.from}`,
    `To: ${msg.to.join(', ')}`,
    msg.replyTo ? `Reply-To: ${msg.replyTo}` : '',
    `Subject: ${encodeMimeHeader(msg.subject)}`,
    `Date: ${date}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean).join('\r\n');

  const textPart =
    `--${boundary}\r\n` +
    'Content-Type: text/plain; charset=UTF-8\r\n' +
    'Content-Transfer-Encoding: 8bit\r\n\r\n' +
    dotStuff(msg.text) + '\r\n';

  const htmlPart =
    `--${boundary}\r\n` +
    'Content-Type: text/html; charset=UTF-8\r\n' +
    'Content-Transfer-Encoding: 8bit\r\n\r\n' +
    dotStuff(msg.html) + '\r\n';

  const closing = `--${boundary}--\r\n`;

  return headers + '\r\n\r\n' + textPart + htmlPart + closing;
}

// RFC 5321: lines beginning with '.' must be doubled inside DATA.
function dotStuff(body) {
  return body.replace(/\r?\n/g, '\r\n').replace(/\r\n\./g, '\r\n..');
}

function encodeMimeHeader(value) {
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(value)))}?=`;
}

// =========================================================================
// Email templates
// =========================================================================

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function humanize(key) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatValue(v) {
  if (v === null || v === undefined || v === '') return 'Not provided';
  if (Array.isArray(v)) return v.length ? v.map(x => String(x)).join(', ') : 'Not provided';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function renderGenericForm(formType, data) {
  const title = humanize(formType === 'generic' ? 'New Form Submission' : formType);
  const entries = Object.entries(data);

  const rows = entries.map(([k, v]) => {
    const label = escapeHtml(humanize(k));
    const value = escapeHtml(formatValue(v));
    return `<div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${value}</span></div>`;
  }).join('');

  const submitterName = typeof data.name === 'string' ? data.name
    : (typeof data.fullName === 'string' ? data.fullName : '');
  const subjectLead = submitterName ? ` — ${submitterName}` : '';
  const subject = `📨 New ${title}${subjectLead} — IvoryTusk Website`;

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${escapeHtml(subject)}</title>
<style>
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
.header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 700; }
.header p { margin: 0; opacity: 0.85; font-size: 13px; }
.badge { display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.content { padding: 32px; color: #374151; line-height: 1.6; }
.detail-card { border-radius: 10px; padding: 20px; background-color: #fff7ed; }
.detail-row { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid #fed7aa; font-size: 14px; }
.detail-row:last-child { border-bottom: none; }
.detail-label { font-weight: 600; color: #1f2937; flex-shrink: 0; }
.detail-value { text-align: right; color: #4b5563; word-break: break-word; }
.footer { background-color: #f9fafb; color: #6b7280; padding: 20px; text-align: center; font-size: 12px; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="badge">📨 New Submission</div>
    <h1>${escapeHtml(title)}</h1>
    <p>A new submission was received from the IvoryTusk website</p>
  </div>
  <div class="content">
    <div class="detail-card">
      ${rows || '<p style="margin:0;color:#6b7280;">No data submitted.</p>'}
    </div>
  </div>
  <div class="footer">
    <p>&copy; 2026 IvoryTusk AI Solutions. All rights reserved.</p>
    <p style="margin-top: 4px;">ivorytusk.co.in</p>
  </div>
</div>
</body></html>`;

  const text = [
    title,
    '',
    ...entries.map(([k, v]) => `${humanize(k)}: ${formatValue(v)}`),
  ].join('\n');

  return { subject, html, text };
}
