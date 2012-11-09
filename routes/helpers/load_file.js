
var fs = require('fs');



module.exports = function(app) {
  loadFile.cache = {};

  function loadFile(name) {
    if (loadFile.cache[name])
      return loadFile.cache[name];

    var realname = fs.realpathSync(name);

    return loadFile.cache[name] =
           loadFile.cache[realname] =
           fs.readFileSync(realname, 'utf-8');
  };

  app.locals.loadFile = loadFile;
};
