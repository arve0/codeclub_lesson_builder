var Metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  setMetadata = require('metalsmith-filemetadata'),
  filepath = require('metalsmith-filepath'),
  assets = require('metalsmith-assets'),
  pandoc = require('metalsmith-pandoc');


module.exports = function build(){
  Metalsmith(__dirname)
  .use(assets({
      source:'./assets',
      destination:'./assets'
  }))
  // set template for exercises
  .use(setMetadata([
    { pattern: 'python/**/*.md',  metadata: { template: 'python.jade' }},
    { pattern: 'scratch/**/*.md', metadata: { template: 'scratch.jade' }}
  ]))
  // create collections for index scaffolding
  .use(collections({
    python: 'python/**/*.md',
    scratch: 'scratch/**/*.md'
  }))
  // convert to html
  //.use(markdown())
  .use(function(files, ms, done){
    console.log('------------------ PANDOC ----------------');
    done();
  })
  .use(pandoc({
    to: 'html5',
    args: ['--section-divs', '--smart']
  }))
  .use(function(files, ms, done){
    console.log('------------------ PANDOC DONE! ----------------');
    done();
  })
  // add file.link metadata
  .use(filepath())
  // apply templates
  .use(templates('jade'))
  //build
  .destination('./build')
  .build(function(err){
    if (err) console.log(err);
  });
}
