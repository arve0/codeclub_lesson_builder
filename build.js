var Metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  setMetadata = require('metalsmith-filemetadata'),
  filepath = require('metalsmith-filepath'),
  assets = require('metalsmith-assets'),
  pandoc = require('metalsmith-pandoc'),
  ignore = require('metalsmith-ignore');


module.exports = function build(){
  Metalsmith(__dirname)
  .use(assets({
      source:'./assets',
      destination:'./assets'
  }))
  // set template for exercises
  .use(setMetadata([
    { pattern: 'oppgaver/python/**/*.md',  metadata: { template: 'python.jade' }},
    { pattern: 'oppgaver/scratch/**/*.md', metadata: { template: 'scratch.jade' }}
  ]))
  .use(ignore([
      'oppgaver/**/README.md'
  ]))
  // create collections for index scaffolding
  .use(collections({
    python: 'oppgaver/python/**/*.md',
    scratch: 'oppgaver/scratch/**/*.md'
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
  .destination('./build')
  .build(function(err){
    if (err) console.log(err);
  });
}
