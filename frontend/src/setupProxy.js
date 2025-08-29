const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'silent', // Suppress proxy logs
      onError: (err, req, res) => {
        // Handle proxy errors gracefully
        console.log('Backend not available - running in frontend-only mode');
        res.status(503).json({ 
          error: 'Backend service unavailable',
          message: 'Running in frontend-only mode'
        });
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add headers for proxy requests
        proxyReq.setHeader('X-Proxy-By', 'SpeechCoach-Frontend');
      }
    })
  );

  // Proxy other requests (favicon, etc.) to prevent errors
  app.use(
    ['/favicon.ico', '/default-avatar.png', '*.hot-update.json'],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'silent',
      onError: (err, req, res) => {
        // Return empty responses for static assets to prevent errors
        if (req.url.includes('favicon.ico')) {
          res.status(204).end();
        } else if (req.url.includes('hot-update.json')) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      }
    })
  );
};
