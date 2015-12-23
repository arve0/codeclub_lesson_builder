/**
 * Setup the internationalisation (i18n), i.e. captions in different languages
 *
 * Example of use:
 *      import i18n from './i18n';
 *      i18n.then(function(translator) {
 *          // runs if i18n initialized successfully
 *          console.log(translator('key'));
 *      }, function(error) {
 *          // runs if i18n fails to initialize
 *          console.error(error);
 *      });
 *
 * The resource files are (by default) in locales/<language>/translation.json.
 *
 * See http://i18next.com/ for more info.
 */

import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

var i18nPromise = new Promise(
    function(resolve, reject) {
        i18n.use(XHR).init({
            debug: false,
            lng: 'en-US',
            fallbackLng: 'en-US',
            load: 'currentOnly'
        }, (err, t) => {
            if (!err) {
                // initialized and ready to go!
                //console.log(t('test.helloWorld'));
                resolve(t);
            } else {
                reject('Failed to initialize i18next.(' + err + ')');
            }

        });
    }
);

export default i18nPromise;
