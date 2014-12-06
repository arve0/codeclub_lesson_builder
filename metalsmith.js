var Metalsmith  = require('metalsmith'),
  markdown      = require('metalsmith-markdown'),
  templates     = require('metalsmith-templates'),
  collections   = require('metalsmith-collections'),
  dom           = require('metalsmith-dom'),
  minimatch     = require('minimatch');


module.exports = function build(){
  Metalsmith(__dirname)
  .use(setTemplate({
    pattern: 'python/**/*.md',
    template: 'python.jade'
  }))
  .use(setTemplate({
    pattern: 'scratch/**/*.md',
    template: 'scratch.jade'
  }))
  .use(collections({
    python: {
      pattern: 'python/**/*.md'
    },
    scratch: {
      pattern: 'scratch/**/*.md'
    }
  }))
  .use(markdown())
  .use(dom())
  .use(extendMarkdown())
  .use(setUrl)
  .use(templates('jade'))
  .destination('./build')
  .build(function(err){
    if (err) console.log(err);
  });
}


// functions/plugins
function setTemplate(config){
  return function(files, metalsmith, done){
    // debug, put files in metadata, so that we can send it to browser
    //var metadata = metalsmith.metadata();
    //metadata.files = files;
    for (var file in files){
      if (minimatch(file, config.pattern, config)){
        //console.log('match:' + file);
        var _f = files[file];
        _f.template = config.template;
      }
    }
    done();
  }
}


function extendMarkdown(config) {
    return function(files, metalsmith, done){
        var extRegex    = RegExp('{.*}'),
            classRegex  = RegExp('{\..*}'),
            idRegex     = RegExp('{#.*}'),
            stripRegex  = /{|}|\./g;

        for (var file in files) {
            if (files[file].DOM==null) continue;
            $ = files[file].DOM; 
            $("*").filter(function(){
                return extRegex.test($(this).text());
            }).each(function() {
                if(classRegex.test($(this).text())){
                    var classname = classRegex.exec($(this).text())[0].replace(stripRegex,'');
                    $(this).addClass(classname);
                }
                if(idRegex.test($(this).text())){
                    var idname = idRegex.exec($(this).text())[0].replace(stripRegex,'');
                    $(this).attr("id", idname);
                }
            }).each(function(){
                $(this).text($(this).text().replace(extRegex,'')); 
            });

            files[file].contents = new Buffer($.html());
        }
        done();
    }
}




function setUrl(files, _, done){
  for (var file in files){
    var _f = files[file];
    _f.url = file;
  }
  done();
}






