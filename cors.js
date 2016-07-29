module.exports = {
  setup: (restify, server) => {

    restify.CORS.ALLOW_HEADERS.push('accept');
    restify.CORS.ALLOW_HEADERS.push('authorization');
    restify.CORS.ALLOW_HEADERS.push('cache-control');
    restify.CORS.ALLOW_HEADERS.push('connection');
    restify.CORS.ALLOW_HEADERS.push('content-type');
    restify.CORS.ALLOW_HEADERS.push('host');
    restify.CORS.ALLOW_HEADERS.push('keep-alive');
    restify.CORS.ALLOW_HEADERS.push('upgrade');
    restify.CORS.ALLOW_HEADERS.push('user-aget');
    restify.CORS.ALLOW_HEADERS.push('withcredentials');

    server.use(restify.CORS());

    server.on('MethodNotAllowed', (req, res) => {
      if (req.method.toUpperCase() === 'OPTIONS') {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', restify.CORS.ALLOW_HEADERS.join(', '));
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Max-Age', 0);
        res.header('Content-Type', 'text/plain charset=UTF-8');
        res.header('Content-Length', 0);
        res.send(204);
      } else {
        res.send(new restify.MethodNotAllowedError());
      }
    });
  }
};
