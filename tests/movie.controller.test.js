const test = require('blue-tape');
const Promise = require('promise');

module.exports = (appdir) => {
  const path = `${appdir}/controllers/movie.controller.js`;
  const MovieModel = require(`${appdir}/models/movie.model.js`);

  function getMovieProps(movie) {
    if (MovieModel.isPrototypeOf(movie)) {
      return movie.toJSON();
    }
    return movie;
  }

  function sameArray(a, b) {
    return !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
  }

  function sameMovieProps(aMovieList, otherMovieList) {
    const aMovieProps = values(aMovieList.map(getMovieProps)).sort();
    const otherMovieProps = values(otherMovieList.map(getMovieProps)).sort();
    return sameArray(aMovieProps, otherMovieProps);
  }

  function sameWithoutID(aList, otherList) {
    const diff = Object.keys(aList).filter(key => {
      return key !== '_id' && aList[key] === otherList[key];
    });
    return diff.length === 0;
  }

  function values(obj) {
    return Object.keys(obj).map(key => obj[key]);
  }

  const movies = [
    new MovieModel({
      id: 1,
      title: 'Terminator 2: Judgment Day',
      director: 'James Cameron',
      release: 1991,
      cast: [
        { name: 'Arnold Schwarzenegger', role: 'The Terminator' },
        { name: 'Edward Furlong', role: 'John Connor' }
      ]
    }),

    new MovieModel({
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
    }),

    new MovieModel({
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
    })
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

  const MovieModelMock = (movies, modelConstructor) => {
    const collection = [].concat(movies);
    const constructor = modelConstructor;

    function Mock(props) {
      this.model = new constructor(props);
    }

    Mock.find = () => {
      return new Promise((resolve, reject) => {
        resolve(collection);
      });
    };

    Mock.findById = (id) => {
      return new Promise((resolve, reject) => {
        resolve(collection[id - 1] || null);
      });
    };

    Mock.prototype.save = function() {
      return new Promise((resolve, reject) => {
        this.model.validate(err => {
          if (err) {
            reject(err);
          } else {
            collection.push(this.model);
            this.model.id = collection.length;
            resolve(this.model);
          }
        });
      });
    };

    Mock.update = () => {
    };

    Mock.remove = () => {
    };

    return Mock;
  };

  test('movie.controller.all()', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    return controller.all()
      .then((response) => {
        t.ok(sameMovieProps(response, movies), 'all() should return all movies');
      })
      .catch((msg) => t.fail(msg));
  });

  test('movie.controller.all() (empty)', t =>  {
    const controller = require(path)(MovieModelMock([], MovieModel));
    return controller.all()
      .then((response) => {
        t.looseEqual(response, [], `all() should return [] before any add() and returned ${response}`);
      })
      .catch((msg) => t.fail(msg));
  });

  test('movie.controller.get(id)', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    movies.forEach((movie, index) => {
      index = index + 1; // movies ids start at 1
      controller.get(index)
        .then((response) => {
          t.equal(response, movie, `get(${index}) should return the '${movie.title}' and returned '${response.title}'`);
        })
        .catch((msg) => t.fail(msg));
    });

    return controller.get(-1337)
      .then((response) => {
        t.notOk(response, `get([invalid id]) should return null and returned ${response}`);
      })
      .catch((msg) => t.fail(msg));
  });

  test('movie.controller.add(movie)', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    return controller.add(movie_new)
      .then((response) => {
        const expected = new MovieModel(movie_new);
        expected.id = movies.length + 1;

        let foundId = false;
        const props = response.toJSON();
        for (let key in props) {
          if (key === '_id' && props[key]) {
            foundId = true;
          } else {
            const got = props[key];
            const expected = movie_new[key];
            const message = `${key} must be present before and after adding the movie`;
            if (got instanceof Array && expected instanceof Array) {
              t.ok(sameWithoutID(got, expected), message);
            } else {
              t.equal(got, expected, message);
            }
          }
        }
        t.ok(foundId, `an added movie must have an '_id' key`);
      })
      .catch((msg) => t.fail(msg));
  });

  test('movie.controller.add()', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    return controller.add()
      .then((response) => { t.fail(`add() should return an error but returned: ${JSON.stringify(response)}`); })
      .catch((msg) => t.pass(`add() should return an error and returned: ${msg}`));
  });

  test('movie.controller.add([invalid movie])', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    return controller.add()
      .then((response) => { t.fail(`add([invalid movie]) should return an error but returned: ${JSON.stringify(response)}`); })
      .catch((msg) => t.pass(`add([invalid movie]) should return an error and returned: ${msg}`));
  });

  test('movie.controller.update(id, props)', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    t.pass('update');
    t.end();
  });

  test('movie.controller.remove(id)', t =>  {
    const controller = require(path)(MovieModelMock(movies, MovieModel));
    t.pass('remove');
    t.end();
  });
}
