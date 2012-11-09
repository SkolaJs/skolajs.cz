
process.title = 'skolajs';

/**
 * Http server.
 */

var http = require('http');
var pkgname = require('./package').name;
var debug = require('debug')(pkgname + ':server');
var app = require('./app/index');



http.createServer(app).listen(app.get('port'), function() {
  debug('Listening on port ' + app.get('port'));

  if (process.env.NODE_REPL === 'yes') {
    var repl = require('repl').start(pkgname + ':' + app.get('port') + '> ');
    repl.context.app = app;
  }
});
