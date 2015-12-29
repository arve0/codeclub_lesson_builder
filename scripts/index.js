/*
 * Entry point for scripts.
 */

import initSearch from './search.js';
import initIntro from './intro.js';
import initPlaylist from './playlist';
import setLanguage from './i18n';
import setHtmlCaptions from './captions.js';
var Cookies = require('js-cookie');

function initHtml(i18n_t) {

//console.log('Running setup in index.js');

/*
 * show/hide course info
 */
$('h1.info').click(function(){
  $('.content').slideToggle();
  $('.infoicon').toggleClass('glyphicon-minus-sign').toggleClass('glyphicon-plus-sign');
  $('.clickformore').addClass('hide');
});

/*
 * tooltips
 */
$('[title]').tooltip();


/**
 * toggle hints
 */
$('toggle').click(function(){
  $('hide', this).slideToggle();
});

/**
 * show sections when correct answer is given
 */
$('input[for^="test-"]').keyup(function(event){
 var answer = this.attributes.answer.value.toLowerCase();
 var value = this.value.toLowerCase();
 if (answer == value) {
   var section = this.attributes.for.value;
   $("section."+ section).slideDown();
 }
})


/*
 * external resources
 */
$('.courses > a[href^="http"]')
  .each(externalResourcePopover('course'));
$('.playlists > a[href^="http"], .level > a[href^="http"]')
  .each(externalResourcePopover('lesson'));

var openExternalPopover;  // global state
function externalResourcePopover(type) {
  return function(){
    var content = '<p>This is an external '+ type +'.<br><br>'
    content += '<a href="'+ this.href +'">Continue to '+ type +'.</a></p>';
    $(this).popover({
      animate: true,
      placement: 'top',
      trigger: 'manual',
      html: 'true',
      title: 'External resource',
      content: content
    });
    $(this).click(function(event){
      event.preventDefault();
      // if other popover is open, hide it
      if (openExternalPopover && openExternalPopover !== this) {
        $(openExternalPopover).popover('hide');
      }
      // if already open, set openExternalPopover to false
      // else, keep track of open popover
      openExternalPopover = (openExternalPopover === this) ? false : this;
      $(this).popover('toggle');
    });
  }
}
}


// Copied from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function getLocale() {
  var locales = ['en-US', 'nb-NO'];
  var cookieLngKey = 'i18n-lng';
  var getParamLngKey = 'lng';

  var locale = getParameterByName(getParamLngKey);
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


function initMain(i18n_t){
  //console.log('initMain');
  setHtmlCaptions(i18n_t);
  initSearch();
  initIntro(i18n_t);
  initPlaylist();
  initHtml(i18n_t);
}


$(function() {
  // page has loaded
  var lng = getLocale();
  setLanguage(lng, function(err, i18n_t) {
    if (!err) {
      initMain(i18n_t);
    } else {
      console.error(err);
    }
  });
});
