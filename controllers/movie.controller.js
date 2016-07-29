const Promise = require('promise');

module.exports = (MovieModel) => {
  return Object.create({
    all() {
      return new Promise((resolve, reject) => {
        MovieModel.find()
          .catch(msg => reject(msg))
          .then(response => resolve(response));
      });
    },

    get(id) {
      return new Promise((resolve, reject) => {
        MovieModel.findById(id)
          .catch(msg => reject(msg))
          .then(response => resolve(response));
      });
    },

    add(props) {
      return new Promise((resolve, reject) => {
        new MovieModel(props).save()
          .catch(msg => reject(msg))
          .then(response => resolve(response));
      });
    },

    update(id, props) {
      return new Promise((resolve, reject) => {
        resolve('TODO');
      });
    },

    remove(id) {
      return new Promise((resolve, reject) => {
        resolve('TODO');
      });
    }

  });
};
