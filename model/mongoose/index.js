
exports.setup = function(connection) {
  for (var name in exports.schema) {
    exports[name] = connection.model(name, exports.schema[name]);
  }

  return exports;
};



exports.schema = {
  User: require('./user')//,
  //JsReference: require('./jsreference')
};
