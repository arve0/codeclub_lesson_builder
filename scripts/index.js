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
  console.log('clicked me')
  $('.info-' + this.id).slideToggle();
})

/*
 * tooltips
 */
$('[title]').tooltip();

});
