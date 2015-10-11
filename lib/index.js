var restify = require('restify'),
	fs = require('fs'),
    endpointServer = require('./endpoint'),
    usersC = require('./users'),
    authC = require('./simple-auth');

var users = new usersC('db/user.db');
var auth = new authC(users);

var key = fs.readFileSync('certs/server.key', 'ascii');
var certificate = fs.readFileSync('certs/server.crt', 'ascii');

var server = restify.createServer({
    key: key,
    certificate: certificate
});
delete key;
delete certificate;
// var server = restify.createServer();
var endpoint = new endpointServer(server, auth.authenticate);
server
    .use(restify.authorizationParser())
    .use(restify.CORS())
    .use(restify.fullResponse())
    .use(restify.bodyParser({
        mapParams: true
    }));
server.pre(restify.pre.userAgentConnection());
endpoint.addEndpoint("api/item", "id", "./db/dispensa.json");

server.get(/^((?!api).)*/, function(req, res, next) {
    restify.serveStatic({
        directory: './src/',
        default: 'index.html'
    })(req, res, next);
});

server.listen(8080, function() {
// server.listen(8442, function() {
    console.log('listening: %s', server.url);
});

