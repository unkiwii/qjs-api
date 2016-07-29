const test = require('blue-tape');
const Promise = require('promise');

const movies = [
  {
    id: 1,
    title: 'Terminator 2: Judgment Day',
    director: 'James Cameron',
    release: 1991,
    cast: [
      { name: 'Arnold Schwarzenegger', role: 'The Terminator' },
      { name: 'Edward Furlong', role: 'John Connor' }
    ]
  },

  {
    id: 2,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    release: 1994,
    cast: [
      { name: 'John Travolta', role: 'Vincent Vega' },
      { name: 'Samuel L. Jackson', role: 'Jules Winnfeld' },
      { name: 'Bruce Willis', role: 'Butch Coolidge' },
      { name: 'Ving Rhames', role: 'Marsellus Wallace' },
      { name: 'Uma Thurman', role: 'Mia Wallace' }
    ]
  },

  {
    id: 3,
    title: 'Warcraft',
    director: 'Duncan Jones',
    release: 2016,
    cast: [
      { name: 'Travis Fimmel', role: 'Anduin Lothar' },
      { name: 'Paula Patton', role: 'Garona' },
      { name: 'Ben Foster', role: 'Medivh' },
      { name: 'Toby Kebbell', role: 'Durotan' }
    ]
  }
];

const movie_new = {
  title: 'Star Wars',
  director: 'George Lucas',
  release: 1977,
  cast: [
    { name: 'Mark Hamill', role: 'Luke Skywalker' },
    { name: 'Harrison Ford', role: 'Han Solo' },
    { name: 'Carrie Fisher', role: 'Princes Leia Organa' }
  ]
};

const MovieModelMock = (movies) => {
  const m = movies;

  function Mock(props) {
    this.props = props;
  }

  Mock.find = () => {
    return new Promise((resolve, reject) => {
      resolve(m);
    });
  };

  Mock.findById = (id) => {
    return new Promise((resolve, reject) => {
      resolve(m[id - 1] || null);
    });
  };

  Mock.prototype.save = function() {
    return new Promise((resolve, reject) => {
      const movie = Object.assign({id: m.length + 1}, this.props);
      m.push(movie);
      resolve(movie);
    });
  };

  Mock.update = () => {
  };

  Mock.remove = () => {
  };

  return Mock;
};

module.exports = (appdir) => {
  const path = `${appdir}/controllers/movie.controller.js`;

  test('movie.controller.all()', t =>  {
    const controller = require(path)(MovieModelMock(movies));
    return controller.all()
      .catch((msg) => t.fail(msg))
      .then((response) => {
        t.equal(response, movies, 'all() should return all movies');
      });
  });

  test('movie.controller.all() (empty)', t =>  {
    const controller = require(path)(MovieModelMock([]));
    return controller.all()
      .catch((msg) => t.fail(msg))
      .then((response) => {
        t.looseEqual(response, [], `all() should return [] before any add() and returned ${response}`);
      });
  });

  test('movie.controller.get(id)', t =>  {
    const controller = require(path)(MovieModelMock(movies));
    movies.forEach((movie, index) => {
      index = index + 1; // movies ids start at 1
      controller.get(index)
        .catch((msg) => t.fail(msg))
        .then((response) => {
          t.equal(response, movie, `get(${index}) should return the '${movie.title}' and returned '${response.title}'`);
        });
    });

    return controller.get(-1337)
      .catch((msg) => t.fail(msg))
      .then((response) => {
        t.notOk(response, `get([invalid id]) should return null and returned ${response}`);
      });
  });

  test('movie.controller.add(movie)', t =>  {
    const controller = require(path)(MovieModelMock(movies));
    return controller.add(movie_new)
      .catch((msg) => t.fail(msg))
      .then((response) => {
        t.looseEqual(response, Object.assign({id: 4}, movie_new), `add(movie) should return the id of the new movie and returned ${response.id}`);
      });
  });

  test('movie.controller.update(id, props)', t =>  {
    const controller = require(path)(MovieModelMock(movies));
    t.pass('update');
    t.end();
  });

  test('movie.controller.remove(id)', t =>  {
    const controller = require(path)(MovieModelMock(movies));
    t.pass('remove');
    t.end();
  });
}
