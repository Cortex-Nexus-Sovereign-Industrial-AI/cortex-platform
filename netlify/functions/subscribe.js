const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { email, firstName, company } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Valid email required' })
      };
    }

    // Get Brevo API key from environment
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not set');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Service configuration error' })
      };
    }

    // Add contact to Brevo
    const brevoPayload = {
      email: email,
      firstName: firstName || 'Subscriber',
      company: company || undefined,
      listIds: [2], // CINIS Intelligence Network list
      updateEnabled: true,
      attributes: {
        SIGNUP_SOURCE: 'cortex-platforms-offers',
        SIGNUP_DATE: new Date().toISOString()
      }
    };

    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(brevoPayload)
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error('Brevo API error:', brevoResponse.status, errorText);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to subscribe. Please try again.' })
      };
    }

    // Send welcome email (optional — template must be set in Brevo)
    try {
      const emailPayload = {
        to: [{ email: email, name: firstName || 'Subscriber' }],
        templateId: 1, // Update with your Brevo email template ID
        params: {
          name: firstName || 'Subscriber',
          framework_link: 'https://cortex-platforms.netlify.app/assets/AI-Architecture-Framework.pdf'
        }
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(emailPayload)
      });
    } catch (emailErr) {
      // Log but don't fail the subscription if welcome email fails
      console.error('Welcome email send error:', emailErr);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed. Check your email for the framework PDF.'
      })
    };

  } catch (error) {
    console.error('Subscription handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
