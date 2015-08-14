
var restify = require('restify');
// var server = restify.createServer();
var endpoint = require('./endpoint');
var server = endpoint.server;
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
    // console.log(req);
    // console.log(res);
    // console.log(next);
    restify.serveStatic({
        directory: './src/',
        default: 'index.html'
    })(req, res, next);
});

server.listen(8080, function() {
    console.log('listening: %s', server.url);
});
