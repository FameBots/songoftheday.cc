const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  songUri: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  songTitle: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  songAuthor: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  date: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
});

module.exports = mongoose.model(`SongOfTheDayDatabase`, Schema);