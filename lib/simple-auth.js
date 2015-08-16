var restify = require('restify'),
    userId = process.env.ID,
    pwd = process.env.PWD,
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(users) {
    passport.use(new BasicStrategy(
        function(username, password, done) {
            return users.get({
                username: username
            }).then(function(user) {
                if (!user) {
                    done(null, false, {
                        message: 'Incorrect username.'
                    });
                } else if (user.password !== password) {
                    done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                done(null, user);
            }).catch(function(e) {
                return done(e);

            });
        }
    ));
    this.authenticate = function(req, res, next, callback) {
        passport.authenticate('basic', function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                var error = new restify.InvalidCredentialsError('Failed to authenticate.');
                res.header('Location', '/#/home');
                res.send(error);
                // req.session.user = req.user._id;
                // res.send(302);
                return next();
            }

            callback(req, res, next);
        })(req, res, next);
    };
};
