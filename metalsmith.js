var Metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  minimatch = require('minimatch'),
  setMeta = require('metalsmith-glob-meta');


module.exports = function build(){
  Metalsmith(__dirname)
  // set template for python exercises
  .use(setMeta({
    glob: 'python/**/*.md',
    meta: { template: 'python.jade' }
  }))
  // set tempalte for scratch exercises
  .use(setMeta({
    glob: 'scratch/**/*.md',
    meta: { template: 'scratch.jade' }
  }))
  // create collections for index scaffolding
  .use(collections({
    python: {
      pattern: 'python/**/*.md'
    },
    scratch: {
      pattern: 'scratch/**/*.md'
    }
  }))
  // convert to html
  .use(markdown())
  .use(setUrl)
  // apply templates
  .use(templates('jade'))
  //build
  .destination('./build')
  .build(function(err){
    if (err) console.log(err);
  });
}


// functions/plugins
function setUrl(files, _, done){
  for (var file in files){
    var _f = files[file];
    _f.url = file;
  }
  done();
}
