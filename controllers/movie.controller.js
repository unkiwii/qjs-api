const Promise = require('promise');

module.exports = (model) => {
  return Object.create({
    all() {
      return new Promise((resolve, reject) => {
        model.find()
          .catch(msg => reject(msg))
          .then((response) => resolve(response));
      });
    },

    get(id) {
      return new Promise((resolve, reject) => {
        model.find({'id': id})
          .catch(msg => reject(msg))
          .then((response) => resolve(response));
      });
    },

    add(props) {
      return new Promise((resolve, reject) => {
        resolve('TODO');
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
