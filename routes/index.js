
var render = function(template) {
  return function(req, res) {
    res.render(template);
  }
};



module.exports = function(app) {

  // helpers
  require('./helpers')(app);

  app.locals.title = 'ŠkolaJs.cz';
  // jade pretty output
  //app.locals.pretty = true;

  app.get('/', render('index'));

  require('./login')(app);
  require('./registrace')(app);
  require('./kontakt')(app);
  require('./action')(app);
  require('./private-stats')(app);

  app.get('/sluzby', render('sluzby/index'));
  app.get('/sluzby/javascript', render('sluzby/javascript'));
  app.get('/sluzby/nodejs', render('sluzby/nodejs'));

  app.get('/ref/this', render('ref/this'));

  app.get('/o-nas', render('o-nas'));

  app.get('/slides/1', render('slides'));
};
