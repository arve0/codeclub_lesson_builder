var Metalsmith  = require('metalsmith'),
    templates   = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    setMetadata = require('metalsmith-filemetadata'),
    filepath    = require('metalsmith-filepath'),
    pandoc      = require('metalsmith-pandoc'),
    ignore      = require('metalsmith-ignore'),
    relative    = require('metalsmith-relative');


module.exports = function build(callback){
  Metalsmith(__dirname)
  // set template for exercises
  .use(setMetadata([
    { pattern: 'oppgaver/python/**/*.md',  metadata: { template: 'lesson.jade' }},
    { pattern: 'oppgaver/scratch/**/*.md', metadata: { template: 'scratch.jade' }},
    { pattern: 'oppgaver/htmlcss/**/*.md', metadata: { template: 'lesson.jade' }}
  ]))
  .use(ignore([
      'oppgaver/**/README.md',
      'oppgaver/{.git,.git/**}',
      'oppgaver/.gitignore',
  ]))
  // add file.link metadata (for sorting)
  // TODO: better way to sort files?
  .use(filepath())
  // add relative(path) for use in templates
  .use(relative())
  // create collections for index scaffolding
  .use(collections({
    python: {
      pattern: 'oppgaver/python/**/*.md',
      sortBy: 'link'
    },
    scratch: {
      pattern: 'oppgaver/scratch/**/*.md',
      sortBy: 'link'
    },
    web: {
      pattern: 'oppgaver/htmlcss/**/*.md',
      sortBy: 'link'
    }
  }))
  // convert to html
  .use(pandoc({
    to: 'html5',
    args: ['--section-divs', '--smart']
  }))
  // add file.link metadata (now files are .html)
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
