
var highlighter = require('node-syntaxhighlighter');



module.exports = function(app) {
  highlight.cache = {};

  function highlight(code, lang) {
    var cached = highlight.cache[lang + ':' + code];
    if (cached)
      return cached;

    cached = highlight.cache[lang + ':' + code] =
             highlighter.highlight(code, highlighter.getLanguage(lang || 'js')).
                         replace(/id="highlighter_\d+"/, '');

    return cached;
  };

  app.locals.highlight = highlight;
};
