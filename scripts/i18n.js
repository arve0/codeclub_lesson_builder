import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import {getParameterByName} from './utils.js';
var Cookies = require('js-cookie');

var initialized = false;
var locales = ['en-US', 'nb-NO'];
var cookieLngKey = 'i18n-lng';


/**
 * Setup the internationalisation (i18n), i.e. captions in different languages.
 *
 * Example of use:
 *      import setLocale from './i18n';
 *      setLocale('nb-NO', function(err, i18n_t) {
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
export function setLocale(locale, callback) {
    var cb = function(err, i18n_t) {
        Cookies.set(cookieLngKey, locale);
        callback(err, i18n_t);
    };
    if (!initialized) {
        initialized = true;
        i18n.use(XHR).init({
            debug: false,
            lng: locale,
            fallbackLng: locales[0],
            load: 'currentOnly'
        }, cb);
    } else {
        i18n.changeLanguage(locale, cb);
    }
}


/**
 * Calling setHtmlCaptions() (f.ex. after changing locale/language) will affect all tags that have
 * the attribute "data-i18n". E.g. a tag with:
 *   data-i18n="html=key" will set this tag's innerHTML to the caption given by "key".
 *   data-i18n="placeholder=key" will set the attribute "placeholder" to the caption given by "key".
 *   data-i18n="html=key1;placeholder=key2" will set both innerHTML and the attribute "placeholder" to
 *                                          the captions for "key1" and "key2", respectively.
 */
var origTitle = false; // A place to store the original document.title
export function setHtmlCaptions(i18n_t) {
    //console.log('setCaptions()');
    if (origTitle === false) { origTitle = document.title; } // Read original title only first time
    document.title = origTitle || i18n_t('layout.codeClubName');
    $('[data-i18n]').each(function () {
        var captions = $(this).attr('data-i18n').split(';');
        for (var i=0; i<captions.length; ++i) {
            var capSplit = captions[i].split('=');
            var key = capSplit[0];
            var caption = i18n_t(capSplit[1]);
            if (key=='html') {
                //console.log("Setting innerHTML=" + caption);
                $(this).html(caption);
            }
            else {
                //console.log("Setting attribute " + key + ": " + caption);
                $(this).attr(key, caption);
            }
        }
    });
}

/**
 * Returns the locale given in the url,
 * or (if not defined in url) the locale set earlier and saved in a cookie,
 * or (if not saved earlier in cookie) the first locale defined in the variable "locales".
 */
export function getLocale() {
    var locale = getParameterByName('lng');
    if (locales.indexOf(locale) >= 0) {
        Cookies.set(cookieLngKey, locale);
        //console.log('Got valid locale from url, setting locale cookie: "' + locale + '"');
    } else {
        locale = "";
    }
    if (!locale) {
        locale = Cookies.get(cookieLngKey);
        //console.log('Got locale from cookie: "' + locale + '"');
    }
    if (!locale) {
        locale = locales[0];
        //console.log('Using first locale from config: "' + locale + '"');
    }
    return locale;
}
