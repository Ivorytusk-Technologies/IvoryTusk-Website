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
    
    // Direct Gmail SMTP ONLY
    if (env.GMAIL_USER && env.GMAIL_PASS) {
      try {
        // Direct SMTP using SMTP.js with proper action
        const emailResponse = await fetch('https://smtpjs.com/v3/smtpjs.aspx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Action: 'Send',
            SecureToken: 'demo',
            To: 'contact@ivorytusk.co.in',
            From: env.GMAIL_USER,
            Subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            Body: `
              <h3>New Contact Form Submission</h3>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
              <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
              <p><strong>Use Case:</strong> ${formData.usecase || formData['use-case'] || 'Not provided'}</p>
              <p><strong>Form Type:</strong> ${formData.formType || 'Contact Form'}</p>
              <br>
              <p><strong>Message:</strong></p>
              <p>${formData.message || 'No additional message'}</p>
              <br>
              <hr>
              <p><small>Submitted at: ${new Date().toISOString()}</small></p>
              <p><small>IP Address: ${clientIP}</small></p>
            `,
            Username: env.GMAIL_USER,
            Password: env.GMAIL_PASS,
            Host: 'smtp.gmail.com',
            Port: 587,
            IsBodyHtml: true
          }),
        });

        const result = await emailResponse.text();
        debugInfo.push(`SMTP Response: ${result}`);
        
        if (result === 'OK' || result.includes('success')) {
          console.log('Email sent successfully via Gmail SMTP');
          debugInfo.push('✅ Gmail SMTP: SUCCESS');
          emailSent = true;
        } else {
          debugInfo.push(`❌ Gmail SMTP: Failed - ${result}`);
          
          // If SMTP.js fails, try alternative direct approach
          const altResponse = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_key: 'demo',
              name: formData.name,
              email: formData.email,
              phone: formData.phone || 'Not provided',
              company: formData.company || 'Not provided',
              usecase: formData.usecase || formData['use-case'] || 'Not provided',
              message: formData.message || 'No additional message',
              subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
              from_name: 'IvoryTusk Website',
              to_email: 'contact@ivorytusk.co.in',
              smtp_server: 'smtp.gmail.com',
              smtp_username: env.GMAIL_USER,
              smtp_password: env.GMAIL_PASS,
              smtp_port: 587
            }),
          });

          const altResult = await altResponse.json();
          if (altResponse.ok && altResult.success) {
            console.log('Email sent successfully via Web3Forms with Gmail SMTP');
            debugInfo.push('✅ Alternative Gmail SMTP: SUCCESS');
            emailSent = true;
          } else {
            debugInfo.push(`❌ Alternative SMTP: Failed - ${altResult.message || 'Unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Gmail SMTP failed:', error);
        debugInfo.push(`❌ Gmail SMTP: Error - ${error.message}`);
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
