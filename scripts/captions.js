// When changing locale (i.e. language), all tags that have the attribute "data-i18n" will be affected. F.ex.:
//   data-i18n="html=key" will set this tag's innerHTML to the caption given by "key".
//   data-i18n="placeholder=key" will set the attribute "placeholder" to the caption give by "key".
//   data-i18n="html=key1;placeholder=key2" will set both innerHTML and the attribute placeholder to
//                                          the captions for "key1" and "key2" respectively.


var origTitle = false;

export default function setHtmlCaptions(i18n_t) {
    //console.log('setCaptions()');
    if (origTitle === false) { origTitle = document.title; } // Read original title only first time
    document.title = origTitle || i18n_t('layout.codeClubName');
    $('[data-i18n]').each(function () {
        var captions = $(this).attr('data-i18n').split(';');
        for (var i=0; i<captions.length; ++i) {
            var capSplit = captions[i].split('=');
            var key = capSplit[0];
            var caption = i18n_t('layout.' + capSplit[1]);
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



