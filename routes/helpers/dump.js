
var util = require('util');



module.exports = function(app) {
  app.locals.dump = util.inspect;
};
