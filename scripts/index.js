/*
 * Entry point for scripts.
 */

require('./search.js');


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

});
