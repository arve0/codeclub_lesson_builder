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
var selectorExternalResources = [
 '.courses > a[href^="http"]',
 '.playlists > a[href^="http"]',
 '.level > a[href^="http"]'
].join(', ');
var openExternalPopover;
$(selectorExternalResources).each(function(){
  var content = '<p>This is an external resource outside our control. Content might therefore be of variable quality.<br><br><a href="'+ this.href +'">Continue to resource.</a></p>';
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
});

});
