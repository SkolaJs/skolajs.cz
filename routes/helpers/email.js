
module.exports = function(app) {

  function email(email) {
    return 'mailto:' + encodeURIComponent(email);
  };

  app.locals.email = email;
};
