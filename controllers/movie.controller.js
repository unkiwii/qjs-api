const Promise = require('promise');

module.exports = (MovieModel) => {
  return Object.create({
    all() {
      return new Promise((resolve, reject) => {
        MovieModel.find()
          .then(response => resolve(response || []))
          .catch(msg => reject(msg));
      });
    },

    get(id) {
      return new Promise((resolve, reject) => {
        MovieModel.findById(id)
          .then(response => resolve(response))
          .catch(msg => reject(msg));
      });
    },

    add(props) {
      return new Promise((resolve, reject) => {
        new MovieModel(props).save()
          .then(response => resolve(response))
          .catch(msg => reject(msg));
      });
    },

    update(id, props) {
      return new Promise((resolve, reject) => {
        MovieModel.findByIdAndUpdate(id, props, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      });
    },

    remove(id) {
      return new Promise((resolve, reject) => {
        MovieModel.findByIdAndRemove(id, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        })
      });
    }

  });
};
