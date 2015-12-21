/*
 * Entry point for scripts.
 */

require('./search.js');
require('./intro.js');
require('./playlist.js');
import i18n from './i18n';

i18n.then(function(i18n_t) {

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

},
function(err) {
  console.error(err);
});
