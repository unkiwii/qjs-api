const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {type: String, required: true},
  director: {type: String, required: true},
  release: {type: Number, required: true},
  cast: [{
    name: String,
    role: String
  }]
});

module.exports = mongoose.model('movie', MovieSchema);
