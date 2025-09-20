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
    
    // Direct Gmail SMTP using EmailJS (free service that supports Gmail)
    if (env.GMAIL_USER && env.GMAIL_PASS) {
      try {
        // Method 1: EmailJS with Gmail SMTP (free and supports Gmail)
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'gmail',
            template_id: 'template_contact',
            user_id: 'public_key_placeholder',
            template_params: {
              to_email: 'contact@ivorytusk.co.in',
              from_name: formData.name,
              from_email: formData.email,
              subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
              message: `
                Name: ${formData.name}
                Email: ${formData.email}
                Phone: ${formData.phone || 'Not provided'}
                Company: ${formData.company || 'Not provided'}
                Use Case: ${formData.usecase || formData['use-case'] || 'Not provided'}
                Form Type: ${formData.formType || 'Contact Form'}
                
                Message:
                ${formData.message || 'No additional message'}
                
                ---
                Submitted at: ${new Date().toISOString()}
                IP Address: ${clientIP}
              `
            },
            smtp: {
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              auth: {
                user: env.GMAIL_USER,
                pass: env.GMAIL_PASS
              }
            }
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully via EmailJS with Gmail SMTP');
          debugInfo.push('✅ EmailJS Gmail SMTP: SUCCESS');
          emailSent = true;
        } else {
          const errorText = await emailResponse.text();
          debugInfo.push(`❌ EmailJS: Failed with status ${emailResponse.status} - ${errorText.substring(0, 100)}`);
        }
      } catch (error) {
        console.error('EmailJS failed:', error);
        debugInfo.push(`❌ EmailJS: Error - ${error.message}`);
      }

      // Method 2: FormSubmit.co with custom sender (free, no signup needed)
      if (!emailSent) {
        try {
          const formData_encoded = new URLSearchParams({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || 'Not provided',
            company: formData.company || 'Not provided',
            usecase: formData.usecase || formData['use-case'] || 'Not provided',
            message: formData.message || 'No additional message',
            _subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            _next: 'https://ivorytusk.co.in/thank-you',
            _captcha: 'false',
            _template: 'table'
          });

          const emailResponse = await fetch('https://formsubmit.co/contact@ivorytusk.co.in', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData_encoded,
          });

          if (emailResponse.ok) {
            console.log('Email sent successfully via FormSubmit');
            debugInfo.push('✅ FormSubmit: SUCCESS');
            emailSent = true;
          } else {
            debugInfo.push(`❌ FormSubmit: Failed with status ${emailResponse.status}`);
          }
        } catch (error) {
          console.error('FormSubmit failed:', error);
          debugInfo.push(`❌ FormSubmit: Error - ${error.message}`);
        }
      }

      // Method 3: Netlify Forms compatible endpoint (works with static hosting)
      if (!emailSent) {
        try {
          const netlifyResponse = await fetch('https://submit-form.com/your-form-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone || 'Not provided',
              company: formData.company || 'Not provided',
              usecase: formData.usecase || formData['use-case'] || 'Not provided',
              message: formData.message || 'No additional message',
              _subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
              _to: 'contact@ivorytusk.co.in',
              _from: env.GMAIL_USER,
              _replyto: formData.email
            }),
          });

          if (netlifyResponse.ok) {
            console.log('Email sent successfully via Submit-Form');
            debugInfo.push('✅ Submit-Form: SUCCESS');
            emailSent = true;
          } else {
            debugInfo.push(`❌ Submit-Form: Failed with status ${netlifyResponse.status}`);
          }
        } catch (error) {
          console.error('Submit-Form failed:', error);
          debugInfo.push(`❌ Submit-Form: Error - ${error.message}`);
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
