'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fccTesting = require('./freeCodeCamp/fcctesting.js')

const session = require('express-session')
const passport = require('passport')

const app = express()

app.set('view engine', 'pug')

fccTesting(app) //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((user, done) => {
    db.collection('users').findOne({
        _id: new ObjectID(id),
        (err, doc) => {
            // done(null, doc)
            done(null, null)
        }
    })
})

app.route('/').get((req, res) => {
    res.render(process.cwd() + '/views/pug/index', {
        title: 'Hello',
        message: 'Please login',
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + process.env.PORT)
})
