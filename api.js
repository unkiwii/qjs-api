const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const Promise = require('promise');

console.log(`connecting to ${config.db}`);
mongoose.connect(config.db);
mongoose.Promise = Promise;

const server = restify.createServer({
  name: 'qjs-api',
  version:'0.0.1'
});

server.use(restify.bodyParser());

// movies
const MovieModel = require('./models/movie.model.js');
const MovieController = require('./controllers/movie.controller.js')(MovieModel);
const MovieRoute = require('./routes/movie.route.js')(server, MovieController);

server.listen(config.port, () => {
  console.log(`${server.name} listening in ${server.url}`);
});
