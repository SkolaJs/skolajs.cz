
var mongoose = require('mongoose');



module.exports = function(app, config) {

  var connection = mongoose.createConnection(config.mongo.connectionString);
  app.mongoose = connection;

  app.model = require('../model/mongoose').setup(connection);

};
