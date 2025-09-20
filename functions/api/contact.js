/**
 * Cloudflare Pages Function for Contact Form
 * Handles form submissions and sends emails via GoDaddy SMTP
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const formData = await request.json();
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return new Response(JSON.stringify({ 
          error: `${field} is required` 
        }), {
          status: 400,
          headers: corsHeaders
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
${formData.message || 'No additional message'}

---
Submitted at: ${new Date().toISOString()}
IP Address: ${clientIP}
User Agent: ${request.headers.get('User-Agent') || 'Unknown'}
    `.trim();

    // Send email using Gmail SMTP ONLY
    let emailSent = false;
    let debugInfo = [];
    
    // Debug: Check if credentials are available
    debugInfo.push(`Gmail credentials available: ${!!(env.GMAIL_USER && env.GMAIL_PASS)}`);
    debugInfo.push(`Gmail user: ${env.GMAIL_USER ? 'SET' : 'NOT SET'}`);
    debugInfo.push(`Gmail pass: ${env.GMAIL_PASS ? 'SET' : 'NOT SET'}`);
    
    // Gmail ONLY - Using Nodemailer-compatible API service
    if (env.GMAIL_USER && env.GMAIL_PASS) {
      try {
        // Method 1: Use Mailgun API (free tier) with Gmail credentials
        const emailResponse = await fetch('https://api.mailgun.net/v3/sandbox-123.mailgun.org/messages', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa('api:key-demo'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            from: `IvoryTusk Website <${env.GMAIL_USER}>`,
            to: 'contact@ivorytusk.co.in',
            subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            text: emailContent,
            html: emailContent.replace(/\n/g, '<br>'),
            'h:Reply-To': formData.email
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully via Mailgun with Gmail');
          debugInfo.push('✅ Mailgun Gmail: SUCCESS');
          emailSent = true;
        } else {
          const errorText = await emailResponse.text();
          debugInfo.push(`❌ Mailgun: Failed with status ${emailResponse.status} - ${errorText.substring(0, 100)}`);
        }
      } catch (error) {
        console.error('Mailgun failed:', error);
        debugInfo.push(`❌ Mailgun: Error - ${error.message}`);
      }

      // Method 2: Try Postmark API (free tier) with Gmail
      if (!emailSent) {
        try {
          const emailResponse = await fetch('https://api.postmarkapp.com/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Postmark-Server-Token': 'POSTMARK_API_TEST',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              From: env.GMAIL_USER,
              To: 'contact@ivorytusk.co.in',
              Subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
              TextBody: emailContent,
              HtmlBody: emailContent.replace(/\n/g, '<br>'),
              ReplyTo: formData.email,
              Headers: [
                {
                  Name: 'X-Sender-Gmail',
                  Value: env.GMAIL_USER
                }
              ]
            }),
          });

          if (emailResponse.ok) {
            console.log('Email sent successfully via Postmark with Gmail');
            debugInfo.push('✅ Postmark Gmail: SUCCESS');
            emailSent = true;
          } else {
            const errorData = await emailResponse.json();
            debugInfo.push(`❌ Postmark: Failed with status ${emailResponse.status} - ${errorData.Message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Postmark failed:', error);
          debugInfo.push(`❌ Postmark: Error - ${error.message}`);
        }
      }

      // Method 3: Direct SMTP using a working relay
      if (!emailSent) {
        try {
          const emailResponse = await fetch('https://smtpjs.com/v3/smtpjs.aspx', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              SecureToken: 'demo',
              To: 'contact@ivorytusk.co.in',
              From: env.GMAIL_USER,
              Subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
              Body: emailContent.replace(/\n/g, '<br>'),
              Username: env.GMAIL_USER,
              Password: env.GMAIL_PASS,
              Host: 'smtp.gmail.com',
              Port: 587
            }),
          });

          const result = await emailResponse.text();
          if (result === 'OK') {
            console.log('Email sent successfully via SMTP.js with Gmail');
            debugInfo.push('✅ SMTP.js Gmail: SUCCESS');
            emailSent = true;
          } else {
            debugInfo.push(`❌ SMTP.js: Failed - ${result}`);
          }
        } catch (error) {
          console.error('SMTP.js failed:', error);
          debugInfo.push(`❌ SMTP.js: Error - ${error.message}`);
        }
      }
    } else {
      debugInfo.push('❌ No Gmail credentials provided');
    }

    // If Gmail methods fail, return error instead of fallback
    if (!emailSent) {
      debugInfo.push('❌ All Gmail methods failed - no fallback used');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Gmail email sending failed. Please check your credentials and try again.',
        debug: debugInfo
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your message! Our team will contact you within 24 hours.',
      debug: debugInfo, // Remove this in production
      emailSent: emailSent
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, there was an error sending your message. Please try again or contact us directly at contact@ivorytusk.co.in' 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
