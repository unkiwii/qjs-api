const restify = require('restify');

module.exports = (server, controller) => {
  function invalid(res, next, msg) {
    res.send(400, msg);
    next();
  }

  function good(res, next, data) {
    res.send(200, data);
    next();
  }

  server.get('/movie', (req, res, next) => {
    controller.all()
      .catch(invalid.bind(res, next))
      .then(good.bind(res, next));
  });

  server.get('/movie/:id', (req, res, next) => {
    controller.get(req.params.id)
      .catch(invalid.bind(res, next))
      .then(good.bind(res, next));
  });

  server.post('/movie', (req, res, next) => {
    controller.add(req.body)
      .catch(invalid.bind(res, next))
      .then(good.bind(res, next));
  });

  server.put('/movie/:id', (req, res, next) => {
    controller.update(req.params.id, req.body)
      .catch(invalid.bind(res, next))
      .then(good.bind(res, next));
  });

  server.del('/movie/:id', (req, res, next) => {
    controller.remove(req.params.id)
      .catch(invalid.bind(res, next))
      .then(good.bind(res, next));
  });
};
