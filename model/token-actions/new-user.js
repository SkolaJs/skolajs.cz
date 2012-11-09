
var TokenAction = require('./token-action');



exports = module.exports = NewUserAction;



function NewUserAction(data) {
  TokenAction.call(this, 'pwd', data);
}
TokenAction.register('pwd', NewUserAction);



NewUserAction.prototype.templateName = 'new-user/www';



NewUserAction.prototype.getEmailOptions = function() {
  return {
    to: this.data.email,
    subject: 'ŠkolaJs: Potvrzení registrace',
    htmlTemplate: 'new-user/email-html'
  };
};



NewUserAction.prototype.post = function(req, res, next) {
  var self = this;
  var pwd = req.body.pass;
  var nickname = req.body.nickname;

  if (pwd.length < 6) {
    res.locals.error = 'Heslo musí být dlouhé alespoň 6 znaků';
    return this.render(req, res);
  }

  if (pwd !== req.body.pass2) {
    res.locals.error = 'Hesla se neshodují';
    return this.render(req, res);
  }

  user = new req.app.model.User;
  user.nickname = nickname;
  user.emails.push({
    email: self.data.email,
    verified: 'email'
  });
  user.setPassword(pwd, function(err) {
    if (err) return next(err);
    user.save(function(err) {
      // duplicate entry
      if (err && (err.code === 11000)) {
        if (/nickname.+dup key/.test(err.err)) {
          res.locals.error = 'Uživatelské jméno „' + nickname +
                             '“ již používá někdo jiný';
          return self.render(req, res);
        }
      }

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

};
