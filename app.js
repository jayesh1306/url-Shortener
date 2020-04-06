var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var mongoose = require('mongoose')
var path = require('path')
const session = require('express-session')
var flash = require('connect-flash')
var Url = require('./models/Url')
var crypto = require('./helpers/crypto')

var bodyParser = require('body-parser')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// Connect flash
app.use(flash())

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

mongoose
  .connect('mongodb://localhost:27017/url', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log('Database Connected Successfully')
  })
  .catch(err => {
    process.exit()
    res.json(err)
  })

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.get('/', (req, res, next) => {
  res.render('index')
})

app.post('/getUrl', (req, res, next) => {
  Url.findOne({ originalUrl: req.body.url })
    .then(url => {
      if (url) {
        req.flash(
          'error_msg',
          `Url Already Exist and shortened link is <a href='http://localhost:3000/${url.shortenedUrl}'>http://localhost:3000/${url.shortenedUrl}</a>`
        )
        res.redirect('/')
      } else {
        var enc = crypto.encrypt('jayesh')
        var url = new Url({
          originalUrl: req.body.url,
          shortenedUrl: enc
        })
        url
          .save()
          .then(result => {
            req.flash(
              'success_msg',
              `Successfully Created URL <a href='http://localhost:3000/${result.shortenedUrl}'>http://localhost:3000/${result.shortenedUrl}</a>`
            )
            res.redirect('/')
          })
          .catch(err => {
            console.log(err)
            req.flash('error_msg', err.message)
            res.redirect('/')
          })
      }
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/')
    })
})

app.get('/:url', (req, res, next) => {
  var url = req.params.url
  Url.findOne({ shortenedUrl: url })
    .then(result => {
      res.redirect(result.originalUrl)
    })
    .catch(err => {
      console.log(err)
      req.flash('error_msg', err.message)
      res.redirect('/')
    })
})

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`)
})
