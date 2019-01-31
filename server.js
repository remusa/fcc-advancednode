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

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

app.use(passport.initialize())

app.route('/').get((req, res) => {
    res.render(process.cwd() + '/views/pug/index', {
        title: 'Hello',
        message: 'Please login',
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + process.env.PORT)
})
