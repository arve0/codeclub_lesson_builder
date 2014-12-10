var Metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  setMetadata = require('metalsmith-filemetadata'),
  filepath = require('metalsmith-filepath'),
  pandoc = require('metalsmith-pandoc');


module.exports = function build(){
  Metalsmith(__dirname)
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
  .use(pandoc({
    to: 'html5',
    args: ['--section-divs', '--smart']
  }))
  // add file.link metadata
  .use(filepath())
  // apply templates
  .use(templates('jade'))
  //build
  .clean(false) // do not delete files - allows for separate tasks in gulp
  .destination('./build')
  .build(function(err){
    if (err) console.log(err);
  });
}
