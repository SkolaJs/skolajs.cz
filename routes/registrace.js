
var debug = require('debug')('app:routes:register');



var register_post = function(req, res, next) {
  var email = req.body.regEmail;

  if (!/^[a-zA-Z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
    res.locals.registerError = 'Neplatný email';
    //debug('Invalid password', err);
    return res.render('registrace');
  }

  req.app.model.User.findOneByEmail(email, function(err, user) {
    var action, message;
    if (user) {
      // update password
      action = req.app.model.SetPasswordAction.create({
        email: email,
        ip: req.ip
      });
      message = 'Instrukce pro obnovení hesla byly zaslány na email ' + email;
    } else {
      action = req.app.model.NewUserAction.create({
        email: email,
        ip: req.ip
      });
      message = 'Registrační email byl odeslán na adresu ' + email;
    }

    action.save(function(err) {
      if (err) return next(err);

      action.sendMail(function(err) {
        if (err) return next(err);
        req.flash('success', message);
        res.redirect(303, '/');
      });
    });
  });
};



module.exports = function(app) {

  app.get('/registrace', register_post);
  app.post('/registrace', register_post);

};
