const test = require('tape');
const Promise = require('promise');

const movies = [
  {
    id: 1,
    title: 'Terminator 2: Judgment Day',
    director: 'James Cameron',
    release: 1991,
    cast: [{
      name: 'Arnold Schwarzenegger',
      role: 'The Terminator',
    }, {
      name: 'Edward Furlong',
      role: 'John Connor',
    }]
  },

  {
    id: 2,
    title: 'Star Wars',
    director: 'George Lucas',
    release: 1977,
    cast: [{
      name: 'Mark Hamill',
      role: 'Luke Skywalker',
    }, {
      name: 'Harrison Ford',
      role: 'Han Solo',
    }, {
      name: 'Carrie Fisher',
      role: 'Princes Leia Organa',
    }]
  },

  {
    id: 3,
    title: 'Warcraft',
    director: 'Duncan Jones',
    release: 2016,
    cast: [{
      name: 'Travis Fimmel',
      role: 'Anduin Lothar',
    }, {
      name: 'Paula Patton',
      role: 'Garona',
    }, {
      name: 'Ben Foster',
      role: 'Medivh',
    }, {
      name: 'Toby Kebbell',
      role: 'Durotan',
    }]
  }
];

const movies_stub = {
  find(filter) {
    return new Promise((resolve, reject) => {
      if (!filter) {
        resolve(movies);
      } else {
        //TODO: make 'advance' filters
      }
    });
  }
};

module.exports = (appdir) => {
  const path = `${appdir}/controllers/movie.controller.js`;

  test('movie.controller.all()', t =>  {
    const controller = require(path)(movies_stub);
    t.plan(1);
    controller.all()
      .catch((msg) => t.fail(msg))
      .then((response) => {
        t.equal(response, movies, 'movie.controller.all() should return all movies');
      });
  });

  test('movie.controller.get(id)', t =>  {
    const controller = require(path)(movies_stub);
    t.plan(movies.length + 1);
    movies.forEach((movie, index) => {
      index = index + 1; // movies ids start at 1
      controller.get(index)
        .catch((msg) => t.fail(msg))
        .then((response) => {
          t.equal(response, movie, `movie.controller.get(${index}) should return the movie ${movie.id} and returned ${response}`);
        });
    });

    controller.get(-1337)
      .catch((msg) => t.fail(msg))
      .then((response) => {
        t.equal(response, movie, `movie.controller.get(${index}) should return the movie ${movie.id} and returned ${response}`);
      });
    t.end();
  });

  test('movie.controller.add(movie)', t =>  {
    const controller = require(path)(movies_stub);
    t.pass('add');
    t.end();
  });

  test('movie.controller.update(id, props)', t =>  {
    const controller = require(path)(movies_stub);
    t.pass('update');
    t.end();
  });

  test('movie.controller.remove(id)', t =>  {
    const controller = require(path)(movies_stub);
    t.pass('remove');
    t.end();
  });
}
