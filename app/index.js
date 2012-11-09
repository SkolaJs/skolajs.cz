
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');

var config = require('./config');
var pkgname = require('../package').name;
var debug = require('debug')(pkgname + ':app');

var app = module.exports = express();


for (var name in config.express) {
  app.set(name, config.express[name]);
}


require('./mongoose')(app, config);
require('./redis')(app, config);
require('./mailer')(app, config);


function load_middleware(name, factory) {
  var conf = config.middleware[name];
  if (conf) {
    if (!factory)
      factory = express[name];

    var route = conf['@'] || '/';

    debug('middlaware ' + name + '@' + route + ': loading', conf);
    app.use(route, factory(conf));

    return true;
  } else {
    debug('middlaware ' + name + ': DISABLED');
  }
}

app.use(require('../middleware/precise-response-time')(app));

load_middleware('favicon');
load_middleware('logger');

load_middleware('stylus', require('stylus').middleware);
load_middleware('static', function(options) {
  return express.static(options.root, options);
});

load_middleware('bodyParser');
load_middleware('methodOverride');

if (load_middleware('cookieParser')) {
  // sessions
  app.RedisSessionStore = require('connect-redis')(express);
  config.redisSessionStore.client = app.redisCreateClient();
  app.sessionStore = new app.RedisSessionStore(config.redisSessionStore);

  config.middleware.session.store = app.sessionStore;
  if (load_middleware('session')) {
    load_middleware('csrf');
  }
}

app.use(require('../middleware/user')(app));
app.use(require('../middleware/locals')(app));
app.use(require('../middleware/flash')(app));


debug('enqueuing express router');
app.use(app.router);

// hack for IE
express.mime.types.woff = 'application/octet-stream';
express.mime.types.ttf = 'application/octet-stream';

load_middleware('errorHandler');

debug('app boot done, now loading routes...');
require('../routes')(app);
