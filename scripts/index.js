var lunr = require('lunr')
require('lunr-no/lunr.stemmer.support.js')(lunr);
require('lunr-no')(lunr);


$.ajax('/searchIndex.json')
  .done(function(data){
    global.index = lunr.Index.load(data);
    console.log(global.index.search('python'));
  });


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
