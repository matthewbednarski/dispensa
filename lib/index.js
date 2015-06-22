var endpoint = require('./endpoint');
var serveStatic = require('serve-static');
var everyauth = require('everyauth');
var connect = require('connect');
var logger = require('morgan');
var bodyParser = require('body-parser');


endpoint.addEndpoint( "item", "id", "./db/dispensa.json");

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
	.use(everyauth.middleware(app));
    // .use(connect.query())
    // .use(connect.cookieParser())
    // And this is where the magic happens

app.listen(8004);
