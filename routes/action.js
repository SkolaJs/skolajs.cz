
var debug = require('debug')('app:routes:action');



module.exports = function(app) {

  var render = function(template) {
    return function(req, res) {
      res.render(template);
    }
  };

  var action = function(method, req, res, next) {
    app.model.TokenAction.load(req.params.actionId, function(err, action) {
      if (err) return next(err);
      if (!action) {
        res.statusCode = 404;
        return res.render('actions/not-found');
      }
      action[method](req, res, next);
    });
  };

  app.get('/action/:actionId', action.bind(null, 'get'));
  app.post('/action/:actionId', action.bind(null, 'post'));

};
