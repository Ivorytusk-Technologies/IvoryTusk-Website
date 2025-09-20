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
    console.log('Contact form request received');
    const formData = await request.json();
    console.log('Form data parsed:', JSON.stringify(formData, null, 2));
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
    
    // n8n Webhook Solution - Clean and Reliable
    if (env.CONTACT_FORM_WEBHOOK) {
      try {
        // Prepare comprehensive form data for n8n
        const webhookPayload = {
          // Contact Information
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          usecase: formData.usecase || formData['use-case'] || null,
          message: formData.message || null,
          formType: formData.formType || 'Contact Form',
          
          // Metadata
          timestamp: new Date().toISOString(),
          clientIP: clientIP,
          userAgent: request.headers.get('User-Agent') || 'Unknown',
          referer: request.headers.get('Referer') || 'Direct',
          
          // Email Configuration (for n8n to use)
          emailConfig: {
            to: 'contact@ivorytusk.co.in',
            subject: `New Contact Form - ${formData.name} from IvoryTusk Website`,
            replyTo: formData.email
          }
        };

        debugInfo.push(`Webhook URL configured: ${env.CONTACT_FORM_WEBHOOK ? 'YES' : 'NO'}`);
        console.log('Sending to webhook:', env.CONTACT_FORM_WEBHOOK);
        console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));
        
        // Send to n8n webhook
        const webhookResponse = await fetch(env.CONTACT_FORM_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'IvoryTusk-Website-Contact-Form/1.0'
          },
          body: JSON.stringify(webhookPayload)
        });

        if (webhookResponse.ok) {
          const responseData = await webhookResponse.text();
          console.log('Form submitted successfully to n8n webhook');
          debugInfo.push('✅ n8n Webhook: SUCCESS');
          debugInfo.push(`Webhook Response: ${responseData.substring(0, 100)}`);
          emailSent = true;
        } else {
          const errorText = await webhookResponse.text();
          debugInfo.push(`❌ n8n Webhook: Failed with status ${webhookResponse.status}`);
          debugInfo.push(`Webhook Error: ${errorText.substring(0, 200)}`);
        }

      } catch (error) {
        console.error('n8n webhook failed:', error);
        debugInfo.push(`❌ n8n Webhook: Error - ${error.message}`);
      }
    } else {
      debugInfo.push('❌ No webhook URL configured (CONTACT_FORM_WEBHOOK missing)');
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
      error: 'Sorry, there was an error sending your message. Please try again or contact us directly at contact@ivorytusk.co.in',
      debug: [`General Error: ${error.message}`, `Stack: ${error.stack?.substring(0, 200) || 'No stack trace'}`]
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
