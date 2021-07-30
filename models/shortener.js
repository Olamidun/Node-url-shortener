const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shortenerSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    randomCharacters:{
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    }
})

const Shortener = mongoose.model('Shortener', shortenerSchema)

module.exports = Shortener