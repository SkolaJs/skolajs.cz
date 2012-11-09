'use strict';

(function(window) {
  'use strict';

  var JsReference = window.JsReference;

  var ulFuncs = document.getElementById('functions');

  var createFunctionView = function(jsref) {
    var li = document.createElement('li');
    var html = [];

    html.push('<tt>', jsref.identifiers[0], '</tt>');

    /*
    if (jsref.identifiers.length > 1)
      html.push(' (', jsref.identifiers.slice(1), ')');
    */

    //html.push(JSON.stringify(jsref.members));

    li.innerHTML = html.join('');
    ulFuncs.appendChild(li);
  }

  var jsrefSorter = function(a, b) {
    return a.identifiers[0] < b.identifiers[0] ? -1 : 1;
  };

  var filter = function(item) {
    return item.identifiers.sort()[0].indexOf('.') === -1;
  };

  JsReference.descByType['function']
    .filter(filter)
    .sort(jsrefSorter)
    .forEach(createFunctionView);


})(window);
