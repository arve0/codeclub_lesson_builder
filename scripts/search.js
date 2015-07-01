var lunr = require('lunr')
require('lunr-no/lunr.stemmer.support.js')(lunr);
require('lunr-no')(lunr);


// download index if not already downloaded
function downloadIndex(){
  if (global.index === undefined) {
    $.ajax('/searchIndex.json')
      .done(function(data){
        global.index = lunr.Index.load(data);
    });
  }
}


// download search index when focusing search input
var searchInput = $('.search input');
searchInput.on('focus', downloadIndex);


// search when typing
searchInput.on('input', function(event){
  var value = $(this).val();
  if (global.index !== undefined && value.length > 2){
    // debounce
    setTimeout(function(){
      if (value == searchInput.val()){
        global.res = global.index.search(value);
      }
    }, 200);
  }
})
