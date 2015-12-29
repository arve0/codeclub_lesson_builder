/**
 * Setup the internationalisation (i18n), i.e. captions in different languages
 *
 * Example of use:
 *      import setLanguage from './i18n';
 *      setLanguage('nb-NO', function(err, i18n_t) {
 *          if (!err) {
 *              console.log(i18n_t('key'));
 *          } else {
 *              console.error(err);
 *          }
 *      });
 *
 * The resource files are (by default) in locales/<language>/translation.json.
 *
 * See http://i18next.com/ for more info.
 */

import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

var initialized = false;

// callback(err, i18n_t)
export default function setLanguage(lng, callback) {
    if (!initialized) {
        initialized = true;
        i18n.use(XHR).init({
            debug: false,
            lng: lng,
            fallbackLng: 'en-US',
            load: 'currentOnly'
        }, callback);
    } else {
        i18n.changeLanguage(lng, callback);
    }

}
