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

