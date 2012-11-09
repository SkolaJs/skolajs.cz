
var fs = require('fs');
var debug = require('debug')('app:helpers');



module.exports = function(app) {
  fs.readdirSync(__dirname).forEach(function(name) {
    if (name !== 'index.js' && name.match(/\.js$/)) {
      debug('loading helper ' + name);
      require('./' + name)(app);
    }
  });
};
