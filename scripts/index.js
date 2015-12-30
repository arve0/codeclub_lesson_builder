/*
 * Entry point for scripts.
 */

import initSearch from './search.js';
import initIntro from './intro.js';
import initPlaylist from './playlist';
import {setLocale, setHtmlCaptions, getLocale} from './i18n';

function initHtml() {
//console.log('initHtml()');

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
});


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


/** Called from html */
window.setLanguage = function(locale) {
  setLocale(locale, function(err, i18n_t) {
    if (!err) {
      setHtmlCaptions(i18n_t);
      $('[title]').tooltip('destroy').tooltip();
    } else {
      console.error(err);
    }
  });
};


$(function() {
  // Run this when page has loaded:
  var lng = getLocale();
  setLocale(lng, function(err, i18n_t) {
    if (!err) {
      setHtmlCaptions(i18n_t);
      initSearch();
      initIntro(i18n_t);
      initPlaylist();
      initHtml();
    } else {
      console.error(err);
    }
  });
});
