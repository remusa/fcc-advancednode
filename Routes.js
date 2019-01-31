const passport = require('passport')
const bcrypt = require('bcrypt')

module.exports = function(app, db) {
    // routes
    app.get('/', (req, res) => {
        res.render(process.cwd() + '/views/pug/index', {
            title: 'Hello',
            message: 'Please login',
            showLogin: true,
            showRegistration: true,
        })
    })

    //login
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/profile')
        }
    )

    //profile
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    }

    app.get('/profile', ensureAuthenticated, (req, res) => {
        res.render(process.cwd() + '/views/pug/profile', {
            username: req.user.username,
        })
    })

    //logout
    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    //register
    app.post(
        '/register',
        (req, res, next) => {
            console.log('/register')

            db.collection('users').findOne(
                { username: req.body.username },
                function(err, user) {
                    if (err) {
                        next(err)
                    } else if (user) {
                        res.redirect('/')
                    } else {
                        const hash = bcrypt.hashSync(req.body.password, 12)

                        db.collection('users').insertOne(
                            {
                                username: req.body.username,
                                password: hash,
                            },
                            (err, doc) => {
                                if (err) {
                                    res.redirect('/')
                                } else {
                                    next(null, user)
                                }
                            }
                        )
                    }
                }
            )
            // db
        },
        passport.authenticate('local', { failureRedirect: '/' }),
        (req, res, next) => {
            res.redirect('/profile')
        }
    )

    //404 middleware
    app.use((req, res, next) => {
        res.status(404)
            .type('text')
            .send('Not Found')
    })

    //listen
    app.listen(process.env.PORT || 3000, () => {
        console.log('Listening on port ' + process.env.PORT)
    })
}
