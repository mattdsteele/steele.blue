console.log('Registered sw');
importScripts('js/sw-toolbox.js');

toolbox.router.get('(.*)', toolbox.cacheFirst);

toolbox.router.get(/^https:\/\/fonts.googleapis.com/, toolbox.cacheFirst, {});
toolbox.router.get(/^https:\/\/fonts.gstatic.com/, toolbox.fastest, {});
