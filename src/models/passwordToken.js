const mongoose = require('mongoose');

// const { Schema } = mongoose.Schema;

// Token schema for password reset
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,

    // expiry time for the token, once 3600 seconds elapses, the token gets deleted from the db
    expires: 3600,
  },
});

const passwordToken = mongoose.model('Token', tokenSchema);

module.exports = passwordToken;
