
var TokenAction = require('./token-action');
var SetPasswordAction = require('./set-password');
var NewUserAction = require('./new-user');



module.exports = function setup(app, config) {
  TokenAction.setup(app, config);
  app.model.TokenAction = TokenAction;
  app.model.SetPasswordAction = SetPasswordAction;
  app.model.NewUserAction = NewUserAction;
};
