var Metalsmith  = require('metalsmith'),
    templates   = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    setMetadata = require('metalsmith-filemetadata'),
    filepath    = require('metalsmith-filepath'),
    pandoc      = require('metalsmith-pandoc'),
    ignore      = require('metalsmith-ignore');


module.exports = function build(callback){
  Metalsmith(__dirname)
  // set template for exercises
  .use(setMetadata([
    { pattern: 'oppgaver/python/**/*.md',  metadata: { template: 'python.jade' }},
    { pattern: 'oppgaver/scratch/**/*.md', metadata: { template: 'scratch.jade' }},
    { pattern: 'oppgaver/htmlcss/**/*.md', metadata: { template: 'python.jade' }}
  ]))
  .use(ignore([
      'oppgaver/**/README.md',
      'oppgaver/{.git,.git/**}',
      'oppgaver/.gitignore',
  ]))
  // create collections for index scaffolding
  .use(collections({
    python: 'oppgaver/python/**/*.md',
    scratch: 'oppgaver/scratch/**/*.md',
    web: 'oppgaver/htmlcss/**/*.md'
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
  .destination('build')
  .build(function(err){
    if (err) console.log(err);
    // callback when build is done
    callback(err);
  });
};
