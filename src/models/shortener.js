const mongoose = require('mongoose');

// const { Schema } = mongoose.Schema;

const shortenerSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  randomCharacters: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Shortener = mongoose.model('Shortener', shortenerSchema);

module.exports = Shortener;
