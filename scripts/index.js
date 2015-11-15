/*
 * Entry point for scripts.
 */

require('./search.js');
require('./intro.js');


$(function(){
// page loaded

/*
 * show/hide playlist
 */
$('li.playlist').click(function(){
  $('.' + this.id).slideToggle();
});


/*
 * show/hide course info
 */
$('h1.info').click(function(){
  $('.content').slideToggle();
});

/*
 * tooltips
 */
$('[title]').tooltip();


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

});
