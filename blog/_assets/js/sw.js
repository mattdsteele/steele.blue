importScripts('js/sw-toolbox.js');

toolbox.router.get(/(.*)\/?/, toolbox.cacheFirst, {});
toolbox.router.get(/.*\.(gif|png|jpg|svg)$/, toolbox.cacheFirst, {});

toolbox.router.get(/^https:\/\/fonts.googleapis.com/, toolbox.cacheFirst, {});
toolbox.router.get(/^https:\/\/fonts.gstatic.com/, toolbox.cacheFirst, {});
