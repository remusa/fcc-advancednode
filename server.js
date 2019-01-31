'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const auth = require('./Auth.js')
const routes = require('./Routes.js')

const fccTesting = require('./freeCodeCamp/fcctesting.js')

const { MongoClient } = require('mongodb')

const app = express()

app.set('view engine', 'pug')

fccTesting(app) //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(
    process.env.DATABASE ||
        'mongodb://fcc-advancednode:fcc-advancednode7@ds117545.mlab.com:17545/fcc-advancednode',
    (err, db) => {
        if (err) {
            console.log('Database error: ' + err)
        } else {
            console.log('Successful database connection')

            auth(app, db)
            routes(app, db)
        }
    }
)
