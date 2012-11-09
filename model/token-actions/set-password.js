
var TokenAction = require('./token-action');



exports = module.exports = SetPasswordAction;



function SetPasswordAction(data) {
  TokenAction.call(this, 'pwd', data);
}
TokenAction.register('pwd', SetPasswordAction);



SetPasswordAction.prototype.templateName = 'set-password/www';



SetPasswordAction.prototype.getEmailOptions = function() {
  return {
    to: this.data.email,
    subject: 'ŠkolaJs: Obnovení hesla',
    htmlTemplate: 'set-password/email-html'
  };
};



SetPasswordAction.prototype.post = function(req, res, next) {
  var self = this;
  var pwd = req.body.pass;
  if (pwd.length < 6) {
    res.locals.error = 'Heslo musí být dlouhé alespoň 6 znaků';
    return this.render(req, res);
  }

  if (pwd !== req.body.pass2) {
    res.locals.error = 'Hesla se neshodují';
    return this.render(req, res);
  }

  req.app.model.User.findOneByEmail(this.data.email, function(err, user) {
    if (err) return next(err);
    if (!user) {
      user = new req.app.model.User;
      user.nickname = self.data.email;
      user.emails.push({
        email: self.data.email,
        verified: 'email'
      });
    } else {
      // TODO: find email and set 'verified' flag if not set
    }
    user.setPassword(pwd, function(err) {
      if (err) return next(err);
      user.save(function(err) {
        if (err) return next(err);
        req.session.regenerate(function(err) {
          if (err) return next(err);
          self.delete(function(err) {
            req.session.user = user;
            res.redirect(303, '/');
          });
        });
      });
    });
  });

};
