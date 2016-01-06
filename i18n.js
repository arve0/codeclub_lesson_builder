var i18n = require('i18next');
var backend = require('i18next-sync-fs-backend');
var config = require('./config.js');
var join = require('path').join;


i18n
  .use(backend)
  .init({
    debug: false,
    lng: config.locales[0],
    whitelist: config.locales,
    fallbackLng: [],
    load: 'currentOnly',
    backend: {
      loadPath: join(config.i18nRoot, '{{lng}}/{{ns}}.json5')
    }
  }, function(err) {
    if (err) {
      console.log(err);
      throw new Error('i18next failed to initialize')
    }
  });

/**
 * Export the translate function.
 *
 * Usage:
 *    var translate = require('./i18n.js');
 *    translate('key');
 */
module.exports = i18n.getFixedT(config.locales[0]);
