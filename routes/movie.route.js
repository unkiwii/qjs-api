const restify = require('restify');

module.exports = (server, controller) => {
  function invalid(res, next, msg) {
    console.log(`  400 BadRequest: ${msg}`);
    res.send(400, msg);
    next();
  }

  function good(res, next, data) {
    console.log(`  200 OK: ${data}`);
    res.send(200, data);
    next();
  }

  server.get('/movie/all', (req, res, next) => {
    console.log('GET /movie/all');
    controller.all()
      .then(good.bind(this, res, next))
      .catch(invalid.bind(this, res, next));
  });

  server.get('/movie/:id', (req, res, next) => {
    console.log(`GET /movie/${req.params.id}`);
    controller.get(req.params.id)
      .then(good.bind(this, res, next))
      .catch(invalid.bind(this, res, next));
  });

  server.post('/movie', (req, res, next) => {
    console.log('POST /movie');
    controller.add(JSON.parse(req.body))
      .then(good.bind(this, res, next))
      .catch(invalid.bind(this, res, next));
  });

  server.put('/movie/:id', (req, res, next) => {
    console.log('PUT /movie/:id');
    controller.update(req.params.id, req.body)
      .then(good.bind(this, res, next))
      .catch(invalid.bind(this, res, next));
  });

  server.del('/movie/:id', (req, res, next) => {
    console.log('DEL /movie/:id');
    controller.remove(req.params.id)
      .then(good.bind(this, res, next))
      .catch(invalid.bind(this, res, next));
  });
};
