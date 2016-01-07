/**
 * # DEPENDENCIES #
 */
var gulp = require('gulp');
try {
  var browserSync = require('browser-sync');
  var reload = browserSync.reload; // reload shorthand
} catch(e) { }
var path = require('path');
var addsrc = require('gulp-add-src');
var del = require('del');
var run = require('run-sequence');
var merge = require('merge-stream');
var _ = require('lodash');
// metalsmith building
var build = require('./build.js');
var buildIndexes = require('./build-indexes.js');
var buildSearchIndex = require('./build-search-index.js');
// styles and scripts
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
// pdf generation
var pdf = require('./pdf.js');
// link-checking
var checkLinks = require('./check-links');
// get configuration variables
var config = require('./config.js');

// github hooks
var exec = require('child_process').exec;
var githubhook = require('githubhook');


/**
 * # TASKS #
 */

/**
 * serve build directory
 */
gulp.task('server', ['build', 'build-indexes', 'css', 'js', 'assets'], function () {
  browserSync.init({
    server: { baseDir: config.buildRoot }
  });
});

/**
 * build less files to css, prefix and minify
 */
gulp.task('css', function(cb) {
  return gulp.src('styles/main.less')
    .pipe(less())
    .on('error', cb)
    .pipe(addsrc([
      'node_modules/scratchblocks2/build/scratchblocks2.css',
      'node_modules/highlight.js/styles/idea.css',
      'node_modules/intro.js/introjs.css'
    ]))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(config.assetRoot));
});

/**
 * copy all assets to build directory
 */
gulp.task('assets', function(){
  return gulp.src([
      'assets/**/*',
      'node_modules/scratchblocks2/build/*/*.png',
      'node_modules/bootstrap/dist/*/glyphicons-halflings-regular.*'
    ])
    .pipe(gulp.dest(config.assetRoot));
});

/**
 * browserify and uglify client-side scripts
 */
gulp.task('browserify', function() {
  var b = browserify({
    entries: './scripts/index.js',
    debug: true
  });

  return b
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(source('script.min.js'))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest(config.assetRoot));
});


/**
 * concat and uglify vendor scripts
 */
gulp.task('js', ['browserify'], function(){
  return gulp.src([
    'node_modules/scratchblocks2/build/scratchblocks2.js',
    'node_modules/scratchblocks2/src/translations.js',
    'node_modules/bootstrap/js/modal.js',
    'node_modules/bootstrap/js/tooltip.js',
    'node_modules/bootstrap/js/popover.js'
  ])
  .pipe(uglify())
  .pipe(addsrc.prepend([
    'node_modules/jquery/dist/jquery.min.js'
  ]))
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest(config.assetRoot));
});

/**
 * metalsmith building
 */
gulp.task('build', build);
gulp.task('build-indexes', buildIndexes);
gulp.task('build-search-index', buildSearchIndex);

/**
 * dist - build all without serving
 */
gulp.task('dist', function(cb){
  // preferred way to this will change in gulp 4
  // see https://github.com/gulpjs/gulp/issues/96
  run('clean',
      ['assets', 'build', 'build-indexes', 'build-search-index', 'css', 'js'],
      'pdf',
      cb);
});

/**
 * clean - remove files in build directory
 */
gulp.task('clean', function(cb){
  del([path.join(config.lessonRoot, 'build')], {force: true}, cb);
});

/**
 * pdf - generate pdfs of all htmls
 */
gulp.task('pdf', pdf);

/**
 * links - check for broken links
 */
gulp.task('links', checkLinks('http://localhost:3000/'));
gulp.task('prodlinks', checkLinks(config.productionCrawlStart));

/**
 * github webhook for automatic building
 */
gulp.task('github', function(cb){
  var github = githubhook({
    host: config.ghHost,
    port: config.ghPort,
    path: config.ghPath,
    secret: config.ghSecret
  });
  github.on('*', function(event){
    if (event !== 'pull_request') {
      console.log('Webhook event "' + event + '". Nothing to do.');
    }
  });
  github.on('pull_request', build);
  github.listen();
  var currentlyBuilding = false;
  function build(repo, ref, data) {
    if (currentlyBuilding) {
      console.log('Already building. Waiting 4 minutes...');
      _.delay(build, 4*60*1000, repo, ref, data);
    }
    else if (data.pull_request.merged) {
      currentlyBuilding = true;
      console.log('Merged PR, building...');
      deployProc = exec(config.ghMergeCommand, function(err, stdout, stderr) {
        if(err!==null) {
          console.log(stderr);
        } else {
          console.log('Build successfull.');
        }
        currentlyBuilding = false;
      });
    } else {
      console.log('Webhook event "pull_request", not merged. Nothing to do.');
    }
  }
});


/**
 * # DEFAULT TASK #
 * do metalsmith build
 * build, concat and minify styles
 * concat and uglify scripts
 * copy assets
 * serve build directory with livereload
 * watch files -> build and reload upon changes
 */
gulp.task('default', ['server'], function(){
  /**
   * ## WATCHES ##
   */
  // files which are built with metalsmith
  gulp.watch([config.sourceRoot + '/**', '!' + config.sourceRoot + '/**/index.md'], ['build', reload]);
  gulp.watch([__dirname + '/layouts/**', config.sourceRoot + '/**/index.md'], ['build-indexes', reload]);

  // styles
  gulp.watch(path.join(__dirname, 'styles', '**', '*'), ['css', reload]);

  // scripts
  gulp.watch(path.join(__dirname, 'scripts', '**'), ['js', reload]);

  // assets
  gulp.watch(path.join(__dirname, 'assets', '**'), ['assets', reload]);
});
