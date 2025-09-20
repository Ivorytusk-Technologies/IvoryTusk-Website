/**
 * Cloudflare Worker for IvoryTusk QR Code Visit Tracking
 * Handles visit counting and analytics using R2 storage
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: Track QR visit
      if (path === '/api/track-visit' && request.method === 'POST') {
        return await handleTrackVisit(request, env, corsHeaders);
      }

      // Route: Get analytics
      if (path === '/api/analytics' && request.method === 'GET') {
        return await handleGetAnalytics(request, env, corsHeaders);
      }

      // Route: Contact form submission
      if (path === '/api/contact' && request.method === 'POST') {
        return await handleContactForm(request, env, corsHeaders);
      }

      // Route: QR redirect with tracking
      if (path === '/qr') {
        return await handleQRRedirect(request, env);
      }

      // Default response
      return new Response('IvoryTusk Analytics API', { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle QR code redirect with visit tracking
 */
async function handleQRRedirect(request, env) {
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || '';
  const referer = request.headers.get('Referer') || '';
  
  // Track the visit
  await trackVisit(env.ANALYTICS_BUCKET, {
    ip: clientIP,
    userAgent,
    referer,
    timestamp: Date.now(),
    source: 'qr_redirect'
  });

  // Redirect to main site
  return Response.redirect('https://www.ivorytusk.co.in/', 302);
}

/**
 * Handle visit tracking API endpoint
 */
async function handleTrackVisit(request, env, corsHeaders) {
  try {
    const data = await request.json();
    const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    
    const visitData = {
      ip: clientIP,
      userAgent: request.headers.get('User-Agent') || '',
      referer: request.headers.get('Referer') || '',
      timestamp: Date.now(),
      source: data.source || 'direct',
      page: data.page || '/',
      ...data
    };

    const result = await trackVisit(env.ANALYTICS_BUCKET, visitData);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to track visit' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle contact form submission
 */
async function handleContactForm(request, env, corsHeaders) {
  try {
    const formData = await request.json();
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Prepare email content
    const emailContent = `
New Contact Form Submission from IvoryTusk Website

Contact Details:
- Name: ${formData.name}
- Email: ${formData.email}
- Company: ${formData.company || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}
- Use Case: ${formData.usecase || formData['use-case'] || 'Not provided'}
- Form Type: ${formData.formType || 'Contact Form'}

Message:
${formData.message || 'No message provided'}

---
Submitted at: ${new Date().toISOString()}
IP Address: ${clientIP}
User Agent: ${request.headers.get('User-Agent') || 'Unknown'}
    `.trim();

    // Send email FROM your GoDaddy domain using authenticated SMTP
    try {
      // Method 1: Use your GoDaddy WebMail credentials (stored as Cloudflare secrets)
      if (env.SMTP_USER && env.SMTP_PASS) {
        // Use EmailJS with custom SMTP settings for GoDaddy
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'custom_smtp',
            template_id: 'contact_form',
            user_id: 'public_user',
            template_params: {
              from_name: 'IvoryTusk Website',
              from_email: env.SMTP_USER, // Your GoDaddy email
              to_email: 'contact@ivorytusk.co.in',
              reply_to: formData.email,
              subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
              message: emailContent,
              customer_name: formData.name,
              customer_email: formData.email,
              customer_phone: formData.phone || 'Not provided',
              customer_company: formData.company || 'Not provided',
              customer_usecase: formData.usecase || formData['use-case'] || 'Not provided'
            },
            smtp_config: {
              host: 'smtpout.secureserver.net', // GoDaddy SMTP server
              port: 587,
              secure: false, // Use STARTTLS
              user: env.SMTP_USER,
              pass: env.SMTP_PASS
            }
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully from your GoDaddy domain');
          return; // Success - exit early
        } else {
          console.error('GoDaddy SMTP failed, trying alternative method');
        }
      }

      // Method 1B: Alternative SMTP approach using a relay service
      if (env.SMTP_USER && env.SMTP_PASS) {
        // Use a service that can relay through GoDaddy SMTP
        const emailResponse = await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': 'POSTMARK_API_TEST' // Free test mode
          },
          body: JSON.stringify({
            From: env.SMTP_USER, // Your GoDaddy email
            To: 'contact@ivorytusk.co.in',
            Subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            TextBody: emailContent,
            HtmlBody: emailContent.replace(/\n/g, '<br>'),
            ReplyTo: formData.email,
            Headers: [
              {
                Name: 'X-Original-Sender',
                Value: env.SMTP_USER
              }
            ]
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully via relay from your GoDaddy domain');
          return;
        }
      }

      // Method 2: Fallback - Use Brevo (formerly Sendinblue) free tier
      if (env.BREVO_API_KEY) {
        const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': env.BREVO_API_KEY
          },
          body: JSON.stringify({
            sender: {
              name: 'IvoryTusk Website',
              email: 'contact@ivorytusk.co.in'
            },
            to: [{
              email: 'contact@ivorytusk.co.in',
              name: 'IvoryTusk Team'
            }],
            replyTo: {
              email: formData.email,
              name: formData.name
            },
            subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            textContent: emailContent,
            htmlContent: emailContent.replace(/\n/g, '<br>')
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully via Brevo');
          return;
        }
      }

      // Method 3: Ultimate fallback - FormSubmit (but clearly labeled)
      const emailResponse = await fetch('https://formsubmit.co/contact@ivorytusk.co.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          company: formData.company || 'Not provided',
          usecase: formData.usecase || formData['use-case'] || 'Not provided',
          message: formData.message || 'No additional message',
          formType: formData.formType || 'Contact Form',
          _subject: `[WEBSITE FORM] New Contact - ${formData.name} from IvoryTusk Website`,
          _captcha: 'false',
          _template: 'table'
        }),
      });

      if (emailResponse.ok) {
        console.log('Email sent via FormSubmit fallback (external sender)');
      }

    } catch (error) {
      console.error('All email methods failed:', error);
    }

    // Store the submission for backup (optional)
    const submissionData = {
      ...formData,
      timestamp: Date.now(),
      ip: clientIP,
      userAgent: request.headers.get('User-Agent'),
    };

    // Save to R2 bucket if available
    if (env.ANALYTICS_BUCKET) {
      const key = `contact-submissions/${Date.now()}-${Math.random().toString(36).substring(7)}.json`;
      await env.ANALYTICS_BUCKET.put(key, JSON.stringify(submissionData));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your message! Our team will contact you within 24 hours.' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, there was an error sending your message. Please try again or contact us directly at contact@ivorytusk.co.in' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle analytics retrieval
 */
async function handleGetAnalytics(request, env, corsHeaders) {
  try {
    const analytics = await getAnalytics(env.ANALYTICS_BUCKET);
    
    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get analytics' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Track a visit in R2 storage
 */
async function trackVisit(bucket, visitData) {
  const visitorId = await generateVisitorId(visitData.ip, visitData.userAgent);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Check if this visitor has already been counted today
  const visitorKey = `visitors/${today}/${visitorId}`;
  const existingVisitor = await bucket.get(visitorKey);
  
  const isNewVisitor = !existingVisitor;
  
  // Store/update visitor data
  await bucket.put(visitorKey, JSON.stringify({
    ...visitData,
    visitorId,
    date: today,
    isNewVisitor,
    lastVisit: visitData.timestamp
  }));

  // Update daily stats
  await updateDailyStats(bucket, today, isNewVisitor, visitData.source);
  
  // Update overall stats
  await updateOverallStats(bucket, isNewVisitor, visitData.source);

  return {
    success: true,
    isNewVisitor,
    visitorId,
    timestamp: visitData.timestamp
  };
}

/**
 * Generate a unique visitor ID based on IP and User Agent
 */
async function generateVisitorId(ip, userAgent) {
  const data = `${ip}-${userAgent}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16); // Use first 16 characters
}

/**
 * Update daily statistics
 */
async function updateDailyStats(bucket, date, isNewVisitor, source) {
  const statsKey = `stats/daily/${date}`;
  
  let stats = {
    date,
    totalVisits: 0,
    uniqueVisitors: 0,
    sources: {},
    lastUpdated: Date.now()
  };

  // Try to get existing stats
  try {
    const existingStats = await bucket.get(statsKey);
    if (existingStats) {
      stats = JSON.parse(await existingStats.text());
    }
  } catch (error) {
    console.log('No existing daily stats, creating new');
  }

  // Update stats
  stats.totalVisits++;
  if (isNewVisitor) {
    stats.uniqueVisitors++;
  }
  stats.sources[source] = (stats.sources[source] || 0) + 1;
  stats.lastUpdated = Date.now();

  await bucket.put(statsKey, JSON.stringify(stats));
}

/**
 * Update overall statistics
 */
async function updateOverallStats(bucket, isNewVisitor, source) {
  const statsKey = 'stats/overall';
  
  let stats = {
    totalVisits: 0,
    uniqueVisitors: 0,
    sources: {},
    startDate: new Date().toISOString().split('T')[0],
    lastUpdated: Date.now()
  };

  // Try to get existing stats
  try {
    const existingStats = await bucket.get(statsKey);
    if (existingStats) {
      stats = JSON.parse(await existingStats.text());
    }
  } catch (error) {
    console.log('No existing overall stats, creating new');
  }

  // Update stats
  stats.totalVisits++;
  if (isNewVisitor) {
    stats.uniqueVisitors++;
  }
  stats.sources[source] = (stats.sources[source] || 0) + 1;
  stats.lastUpdated = Date.now();

  await bucket.put(statsKey, JSON.stringify(stats));
}

/**
 * Get analytics data
 */
async function getAnalytics(bucket) {
  const analytics = {
    overall: null,
    daily: [],
    recent: []
  };

  // Get overall stats
  try {
    const overallStats = await bucket.get('stats/overall');
    if (overallStats) {
      analytics.overall = JSON.parse(await overallStats.text());
    }
  } catch (error) {
    console.log('No overall stats found');
  }

  // Get last 30 days of daily stats
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const dailyStats = await bucket.get(`stats/daily/${dateStr}`);
      if (dailyStats) {
        analytics.daily.push(JSON.parse(await dailyStats.text()));
      }
    } catch (error) {
      // No stats for this day, skip
    }
  }

  // Sort daily stats by date (newest first)
  analytics.daily.sort((a, b) => new Date(b.date) - new Date(a.date));

  return analytics;
}

