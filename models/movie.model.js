const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: String,
  director: String,
  release: Number,
  cast: [{
    name: String,
    role: String
  }]
});

module.exports = mongoose.model('movie', MovieSchema);
