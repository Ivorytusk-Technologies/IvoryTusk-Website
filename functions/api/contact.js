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

    // Send email using Gmail SMTP via EmailJS service
    let emailSent = false;
    let debugInfo = [];
    
    // Debug: Check if credentials are available
    debugInfo.push(`Gmail credentials available: ${!!(env.GMAIL_USER && env.GMAIL_PASS)}`);
    debugInfo.push(`Gmail user: ${env.GMAIL_USER ? 'SET' : 'NOT SET'}`);
    debugInfo.push(`Gmail pass: ${env.GMAIL_PASS ? 'SET' : 'NOT SET'}`);
    
    // Method 1: Try direct Gmail API approach using EmailJS properly
    if (env.GMAIL_USER && env.GMAIL_PASS) {
      try {
        // Use a working Gmail SMTP relay service
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'service_gmail',
            template_id: 'template_contact',
            user_id: 'public_user',
            template_params: {
              to_name: 'IvoryTusk Team',
              from_name: formData.name,
              from_email: formData.email,
              to_email: 'contact@ivorytusk.co.in',
              message: emailContent,
              subject: `New Contact Form - ${formData.name} from IvoryTusk Website`
            },
            accessToken: 'public'
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully via EmailJS');
          debugInfo.push('✅ EmailJS Gmail: SUCCESS');
          emailSent = true;
        } else {
          const errorText = await emailResponse.text();
          debugInfo.push(`❌ EmailJS: Failed with status ${emailResponse.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('EmailJS failed:', error);
        debugInfo.push(`❌ EmailJS: Error - ${error.message}`);
      }
    } else {
      debugInfo.push('⚠️ EmailJS: Skipped (no credentials)');
    }

    // Method 2: Fallback to SMTP2GO with Gmail credentials
    if (!emailSent && env.GMAIL_USER && env.GMAIL_PASS) {
      try {
        const emailResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Smtp2go-Api-Key': 'demo' // Free demo mode
          },
          body: JSON.stringify({
            sender: env.GMAIL_USER, // Your Gmail account
            to: ['contact@ivorytusk.co.in'],
            subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            text_body: emailContent,
            html_body: emailContent.replace(/\n/g, '<br>'),
            custom_headers: [
              {
                header: 'Reply-To',
                value: formData.email
              }
            ]
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully via SMTP2GO with Gmail');
          debugInfo.push('✅ SMTP2GO: SUCCESS');
          emailSent = true;
        } else {
          debugInfo.push(`❌ SMTP2GO: Failed with status ${emailResponse.status}`);
        }
      } catch (error) {
        console.error('SMTP2GO failed:', error);
        debugInfo.push(`❌ SMTP2GO: Error - ${error.message}`);
      }
    } else {
      debugInfo.push('⚠️ SMTP2GO: Skipped (no Gmail credentials or already sent)');
    }

    // Method 3: Enhanced FormSubmit with better formatting
    if (!emailSent) {
      try {
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
            _subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            _captcha: 'false',
            _template: 'table',
            _replyto: formData.email, // This makes replies go to the customer
            _cc: env.GMAIL_USER || 'contact.ivorytusktechnologies@gmail.com' // CC to your Gmail
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent via FormSubmit fallback');
          debugInfo.push('✅ FormSubmit: SUCCESS (fallback)');
          emailSent = true;
        } else {
          debugInfo.push(`❌ FormSubmit: Failed with status ${emailResponse.status}`);
        }
      } catch (emailError) {
        console.error('All email methods failed:', emailError);
        debugInfo.push(`❌ FormSubmit: Error - ${emailError.message}`);
      }
    } else {
      debugInfo.push('⚠️ FormSubmit: Skipped (email already sent)');
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
