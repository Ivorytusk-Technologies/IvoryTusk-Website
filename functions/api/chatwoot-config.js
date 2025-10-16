/**
 * Chatwoot Configuration API
 * Returns Chatwoot widget configuration from environment variables
 *
 * Environment Variables Required:
 * - CHAT_WIDGET_TOKEN: Your Chatwoot website token
 * - CHAT_WIDGET_BASE_URL: Your Chatwoot instance URL
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Get configuration from environment variables
    const websiteToken = env.CHAT_WIDGET_TOKEN;
    const baseUrl = env.CHAT_WIDGET_BASE_URL;

    // Validate required environment variables
    if (!websiteToken || !baseUrl) {
      return new Response(JSON.stringify({
        error: 'Server configuration error',
        message: 'Required environment variables not configured',
        missing: {
          token: !websiteToken,
          baseUrl: !baseUrl
        }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Return configuration
    return new Response(JSON.stringify({
      websiteToken,
      baseUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Config fetch error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch configuration',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
