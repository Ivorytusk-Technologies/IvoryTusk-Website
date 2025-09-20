/**
 * Simple test function to verify Pages Functions are working
 */

export async function onRequestGet() {
  return new Response(JSON.stringify({
    success: true,
    message: 'Cloudflare Pages Function is working!',
    timestamp: new Date().toISOString(),
    environment: 'Pages Function'
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
