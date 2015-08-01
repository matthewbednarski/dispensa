var endpoint = require('./endpoint');
var serveStatic = require('serve-static');
var connect = require('connect');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));

endpoint.addEndpoint("item", "id", "./db/dispensa.json");

var server = endpoint.server;

var app = connect()
    .use(serveStatic('./src/'))
    .use("/api", function(req, res) {
        server.server.emit('request', req, res);
    })
    .use(logger())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
    .use(function(req, res) {
        res.end(JSON.stringify(req.body));
    })
    .use(connect.cookieParser())
    .use(passport.initialize());

// .use(connect.query())
// .use(connect.cookieParser())
// And this is where the magic happens

app.listen(8004);
