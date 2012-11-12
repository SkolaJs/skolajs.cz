console.log('Google analytics will be loaded ' +
            'if you uncomment it in statics/ga.js. ' +
            'Do not forget to se correct UAID below');
/*
(function(window, undefined) {

  // set your UA
  var UAID = 'UA-XXXXXXXX-X';

  if (!window._gaq) window._gaq = [];

  var visibilityStateProp = 'visibilityState';
  var visibilityEvent = 'visibilitychange';
  var hiddenPropertyName = (function() {
    // if 'hidden' is natively supported just return it
    if ('hidden' in window.document) return 'hidden';

    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0, l = prefixes.length; i < l; i++) {
      var prefix = prefixes[i];
      if ((prefix + 'Hidden') in window.document) {
        visibilityEvent = prefix + 'visibilitychange';
        visibilityStateProp = prefix + 'VisibilityState';
        return prefix + 'Hidden';
      }
    }
    // otherwise it's not supported, undefined
  })();

  window._gaq.push(['_setAccount', UAID]);

  if (hiddenPropertyName) {
    var bInitialShow = false;
    if (!window.document[hiddenPropertyName]) {
      bInitialShow = true;
      window._gaq.push(['_trackPageview']);
    }
    var handleVisEvt = function() {
      window._gaq.push([
        '_trackEvent',
        'visibilityState', // category
        undefined, // action
        window.document[visibilityStateProp], // opt_label
        undefined, // opt_value
        true // opt_noninteraction
      ]);
      if (!bInitialShow && window.document[visibilityStateProp] === 'visible') {
        // don't trigger this code again
        bInitialShow = true;
        window._gaq.push(['_trackPageview']);
      }
    }
    window.document.addEventListener(visibilityEvent, handleVisEvt);
  } else {
    // track page view normally when PageVisibility is not present
    window._gaq.push(['_trackPageview']);
  }

  var ga = window.document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == window.document.location.protocol ?
                'https://ssl' : 'http://www') +
      '.google-analytics.com/ga.js';
  var s = window.document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);

})(window);
*/
