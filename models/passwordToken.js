const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Token schema for password reset
const tokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // expiry time for the token, once 3600 elapses, the token gets deleted from the db
    }
})

const passwordToken = mongoose.model('Token', tokenSchema)

module.exports = passwordToken