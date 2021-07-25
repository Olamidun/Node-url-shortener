const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shortenerSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    randomCharacters:{
        type: String
    }
})

const Shortener = mongoose.model('Shortener', shortenerSchema)

module.exports = Shortener