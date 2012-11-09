
var debug = require('debug')('app:routes:kontakt');



module.exports = function(app) {

  var render = function(template) {
    return function(req, res) {
      res.render(template);
    }
  };

  var kontakt_post = function(req, res, next) {
    var error = function(err) {
      res.locals.error = err;
      return res.render('kontakt');
    }

    if (!(req.body.email || req.body.tel))
      return error('Je nutné vyplnit email nebo telefon');

    if (req.body.tel && !(/^[0-9\+\-\s]{9,}$/.test(req.body.tel)))
      return error('Vyplnili jste telefon, ale vypadá to, ' +
          'že nemá platný formát. Telefon není povinný');

    if (!req.body.text || !req.body.text.trim())
      return error('Zadejte prosím text dotazu');

    var text = ['Toto je kopie Vašeho dotazu z webového formuláře ' +
          'na stránkách http://skolajs.cz.'];

    if (req.body.tel)
      text.push('Váš telefonní kontakt: ' + req.body.tel);

    text.push('--------------------------------');
    text.push(req.body.text);

    var mailOpts = {
      to: req.body.email,
      // TODO: move hard coded email to configuration
      cc: 'sluzby@skolajs.cz',
      subject: 'ŠkolaJs — ' + req.body.subject,
      text: text.join('\n')
    };

    if (!mailOpts.to) {
      mailOpts.to = mailOpts.bcc;
      delete mailOpts.bcc;
    }

    req.app.sendMail(mailOpts, function(err) {
      if (err) return error('Nepodařilo se odeslat email');

      req.flash('success', 'Váš dotaz byl úspěšně odeslán');
      res.redirect(303, '/');
    });

  };

  app.get('/kontakt', render('kontakt'));
  app.post('/kontakt', kontakt_post);

};
