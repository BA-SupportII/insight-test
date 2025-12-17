export default {
  async fetch(request) {
    // Proxy to local server or return placeholder
    const url = new URL(request.url);
    
    // For now, serve a simple response
    return new Response('InsightTrack is running on Cloudflare Workers', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
