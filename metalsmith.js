var Metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  minimatch = require('minimatch'),
  cheerio   = require('cheerio'),
  extname   = require('path').extname;


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
        var mdExtension= RegExp('{\..*}');
        var matches = [];
        for (var file in files) {
            if ('.html' != extname(file)) continue;
            $ = cheerio.load(files[file].contents.toString());
            $("*").filter(function(){
                return mdExtension.test($(this).text());
            }).each(function() {
                var classname = mdExtension.exec($(this).text())[0].replace(/{|}|\./g,'');
                $(this).addClass(classname);
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






