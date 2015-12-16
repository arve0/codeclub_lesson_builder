/*
 * Entry point for scripts.
 */

require('./search.js');
require('./intro.js');
require('./playlist.js');

$(function(){
// page loaded

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
  .each(externalResourcePopover('Dette er et eksternt kurs.', 'kurset'));
$('.playlists > a[href^="http"], .level > a[href^="http"]')
  .each(externalResourcePopover('Dette er en ekstern oppgave.', 'oppgaven'));

var openExternalPopover;  // global state
function externalResourcePopover(thisIs, continueTo) {
  return function(){
    var content = '<p>'+ thisIs +'<br><br>'
    content += '<a href="'+ this.href +'">Fortsett til '+ continueTo +'.</a></p>';
    $(this).popover({
      animate: true,
      placement: 'top',
      trigger: 'manual',
      html: 'true',
      title: 'Ekstern ressurs',
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

});
