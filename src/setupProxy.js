const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://localhost:8085',
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1': '/api/v1',
      },
    })
  );
};
