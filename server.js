'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fccTesting = require('./freeCodeCamp/fcctesting.js')

const mongo = require('mongodb').MongoClient

const session = require('express-session')
const passport = require('passport')

const LocalStrategy = require('passport-local')

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
app.use(passport.session())

mongo.connect(
    process.env.DATABASE ||
        'mongodb://fcc-advancednode:fcc-advancednode7@ds117545.mlab.com:17545/fcc-advancednode',
    (err, db) => {
        if (err) {
            console.log('Database error :' + err)
        } else {
            console.log('Successful database connection')
            //console.log(db);
            passport.serializeUser((user, done) => {
                done(null, user._id)
            })

            passport.deserializeUser((id, done) => {
                db.collection('users').findOne(
                    { _id: new ObjectID(id) },
                    (err, doc) => {
                        done(null, doc)
                    }
                )
            })
            passport.use(
                new LocalStrategy(function(username, password, done) {
                    //  const db = db.db('fcc-passport')
                    //var db = client.db('fcc-passport');
                    db.collection('users').findOne(
                        { username: username },
                        function(err, user) {
                            console.log(
                                'User ' + username + ' attempted to log in.'
                            )
                            if (err) {
                                return done(err)
                            }
                            if (!user) {
                                return done(err)
                            }
                            if (password !== password) {
                                return done(null, false)
                            }
                            return done(null, user)
                        }
                    ) //function(err
                })
            )

            //app.post("/login", passport.authenticate('local', {failureRedirect:'/'}), function(req,res){

            //})//app.get

            app.route('/').get((req, res) => {
                //console.log(process.cwd())
                // res.render(process.cwd() + 'views/pug/index.pug')
                res.render(process.cwd() + '/views/pug/index.pug', {
                    title: 'Hello',
                    message: 'Please login',
                    showLogin: true,
                })

                //  res.sendFile(process.cwd() + '/views/index.html');
            })
            app.route('/login').post(
                passport.authenticate('local', { failureRedirect: '/' }),
                (req, res) => {
                    res.redirect('/profile')
                }
            )

            function ensureAuthenticated(req, res, next) {
                if (req.isAuthenticated()) {
                    return next()
                }
                res.redirect('/')
            }

            app.route('/profile').get(ensureAuthenticated, (req, res) => {
                res.render(process.cwd() + '/views/pug/profile')
            })

            app.listen(process.env.PORT || 3000, () => {
                console.log('Listening on port ' + process.env.PORT)
            })
        }
    }
) //mongo.connect
