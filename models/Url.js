var mongoose = require('mongoose')

var urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortenedUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Url', urlSchema)
