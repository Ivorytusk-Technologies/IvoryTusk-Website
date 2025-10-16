/**
 * Chatwoot HMAC Generation API
 * Generates HMAC hash for identity validation
 *
 * Environment Variable Required:
 * CHATWOOT_IDENTITY_TOKEN=F91s2b7fq8qGtGhoAA4VKQzw
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Parse request body
    const { identifier } = await request.json();

    if (!identifier) {
      return new Response(JSON.stringify({ error: 'Identifier is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get the identity token from environment variables
    // For Cloudflare Pages, set this in your dashboard under Settings > Environment variables
    const identityToken = env.CHAT_WIDGET_USER_VALIDATION_KEY;

    if (!identityToken) {
      return new Response(JSON.stringify({
        error: 'Server configuration error',
        message: 'CHAT_WIDGET_USER_VALIDATION_KEY not configured'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Generate HMAC SHA256 hash
    const encoder = new TextEncoder();
    const keyData = encoder.encode(identityToken);
    const messageData = encoder.encode(identifier);

    // Import the key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Generate the signature
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return new Response(JSON.stringify({
      identifier,
      identifierHash: hashHex
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('HMAC generation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate HMAC',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
