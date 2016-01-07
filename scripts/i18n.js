import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import lngDetector from 'i18next-browser-languagedetector';
import JSON5 from 'json5';


/**
 * Export the instance of i18n.
 *
 * Usage:
 *    import i18n from './i18n.js'
 *    i18n.on('initialized languageChanged', () => {
        // called upon initialization and changeLanguage
 *      i18n.t('key');  // returns the translation
 *    })
 */
export default i18n

$(() => {
  // page loaded
  // FIXME: nb-NO default language?
  const locales = ['nb-NO', 'en-US'];  // first is default language
  i18n.use(XHR)
  .use(lngDetector)
  .init({
    debug: false,
    whitelist: locales,
    lng: locales[0],
    fallbackLng: [],
    load: 'currentOnly',
    backend: {
      loadPath: 'assets/locales/{{lng}}/{{ns}}.json5',
      parse: JSON5.parse
    }
  }, () => {
    i18n.on('languageChanged', onLanguageChanged);
  });


  /**
  * When i18n is initialized, or if the language is changed, translate all tags
  * with the attribute "data-i18n".
  * E.g. a tag with:
  *   data-i18n="html=key" will set this tag's innerHTML to the caption given by "key".
  *   data-i18n="placeholder=key" will set the attribute "placeholder" to the caption given by "key".
  *   data-i18n="html=key1;placeholder=key2" will set both innerHTML and the attribute "placeholder" to
  *                                          the captions for "key1" and "key2", respectively.
  */

  function onLanguageChanged() {
    $('[data-i18n]').each((_, item) => {
      const captions = $(item).attr('data-i18n').split(';');
      for (let i=0; i<captions.length; ++i) {
        const capSplit = captions[i].split('=');
        const key = capSplit[0];
        const caption = i18n.t(capSplit[1]);
        if (key=='html') {
          //console.log("Setting innerHTML=" + caption);
          $(item).html(caption);
        }
        else {
          //console.log("Setting attribute " + key + ": " + caption);
          $(item).attr(key, caption);
        }
      }
    });
    $('[title]').tooltip('destroy').tooltip();  // reset tooltips
  }
});


/**
 * Called from html, e.g. clicking on flag
 * Example: onclick="setLanguage('nb-NO')"
 */
window.setLanguage = (locale) => {
  i18n.changeLanguage(locale, (err) => {
    if (err) { console.log(err); }
  });
};
