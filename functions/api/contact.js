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
    
    // Method 1: Try EmailJS with Gmail SMTP (if credentials are available)
    if (env.GMAIL_USER && env.GMAIL_PASS) {
      try {
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'gmail',
            template_id: 'contact_form',
            user_id: 'public',
            template_params: {
              from_name: 'IvoryTusk Website',
              from_email: env.GMAIL_USER, // contact.ivorytusktechnologies@gmail.com
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
              host: 'smtp.gmail.com',
              port: 587,
              secure: false, // Use STARTTLS
              user: env.GMAIL_USER,
              pass: env.GMAIL_PASS
            }
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent successfully from Gmail account');
          emailSent = true;
        }
      } catch (error) {
        console.error('Gmail SMTP failed:', error);
      }
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
          emailSent = true;
        }
      } catch (error) {
        console.error('SMTP2GO failed:', error);
      }
    }

    // Method 3: Ultimate fallback - FormSubmit (but clearly labeled)
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
            _subject: `[WEBSITE FALLBACK] New Contact - ${formData.name} from IvoryTusk Website`,
            _captcha: 'false',
            _template: 'table'
          }),
        });

        if (emailResponse.ok) {
          console.log('Email sent via FormSubmit fallback');
        }
      } catch (emailError) {
        console.error('All email methods failed:', emailError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your message! Our team will contact you within 24 hours.' 
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
