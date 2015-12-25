import i18n from 'i18next';
import i18nBackend from 'i18next-node-fs-backend';
var config = require('./config.js');

// callback = function(i18n_t)
export default function(callback) {
    i18n.use(i18nBackend).init({
        debug: false,
        lng: 'en-US', // 'nb-NO'
        fallbackLng: 'en-US',
        load: 'currentOnly',
        backend: {
            loadPath: config.i18nRoot + '/{{lng}}/{{ns}}.json'
        }
    }, (err, t) => {
        if (!err) {
            // initialized and ready to go!
            //console.log('i18next INITIALIZED! key=test.hellowWorld => ' + t('test.helloWorld'));
            callback(t);
        } else {
            console.error(err);
        }
    });
}
