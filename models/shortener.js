const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shortenerSchema = new Schema({
    url: {
        type: String,
        required: true
    }
    // randomCharacters:{
    //     type: String
    // }
})


shortenerSchema.path('url').validate((val) =>{
    urlRegex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
    return urlRegex.test(val);
}, 'Invalid URL')

const Shortener = mongoose.model('Shortener', shortenerSchema)

module.exports = Order