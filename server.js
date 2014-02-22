/**
 * Module dependencies.
 */

var express = require('express'),
    hbs = require('hbs'),
    redisStore = require('connect-redis')(express),
    redis = require('redis').createClient(),
    path = require('path'),
    passport = require('passport'),
    nconf = require('nconf'),
    vayu = require('vayu');

var app = module.exports = express();

app.configure(function () {
    //configuration
    nconf.argv().env();

    app.set('conf', nconf);

    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.engine('html', require('hbs').__express);
    
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use( express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: nconf.get('VAYU_APP_SESS_SECRET')/*,
        store: new redisStore({
            host: (nconf.get('OPENSHIFT_REDIS_HOST') || nconf.get('VAYU_REDIS_HOST')),
            port: (nconf.get('OPENSHIFT_REDIS_PORT') || nconf.get('VAYU_REDIS_PORT')),
            pass: (nconf.get('REDIS_PASSWORD') || nconf.get('VAYU_REDIS_PASSWORD')),
            client: redis
        })*/
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    
    //handlebars extensions
    var blocks = {};
    hbs.registerHelper('extend', function (name, context) {
        var block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }

        block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
    });

    hbs.registerHelper('block', function (name) {
        var val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
    });
    
    hbs.registerPartials(__dirname + '/views/partials');
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

vayu.init(app);

app.listen((nconf.get('OPENSHIFT_NODEJS_PORT') || nconf.get('VAYU_APP_PORT')), (nconf.get('OPENSHIFT_NODEJS_IP') || nconf.get('VAYU_APP_IP')));
console.log('Listening on port ' + (nconf.get('OPENSHIFT_NODEJS_PORT') || nconf.get('VAYU_APP_PORT')));