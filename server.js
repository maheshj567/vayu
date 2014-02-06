/**
 * Module dependencies.
 */

var express = require('express'),
    path = require('path');

var app = module.exports = express();

app.configure(function () {
    app.set('port', process.env.port || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get("/hi", function(req, res){
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port'));