/*
 * # DEPENDENCIES #
 */
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload; // reload shorthand
var path        = require('path');
var addsrc      = require('gulp-add-src');
var del         = require('del');
var run         = require('run-sequence');
var merge       = require('merge-stream');
var _           = require('lodash');
// html building
var build       = require('./build.js');
// styles and scripts
var less        = require('gulp-less');
var concat      = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minify      = require('gulp-minify-css');
var uglify      = require('gulp-uglify');
var browserify = require('gulp-browserify');
// archive
var zip         = require('gulp-zip');
var fs          = require('fs');
// pdf generation
var pdf         = require('./pdf.js');
// link-checking
var checkLinks = require('./check-links');
// get configuration variables
var config      = require('./config.js');

// github hooks
var exec = require('child_process').exec;
var githubhook = require('githubhook');


/*
 * # VARIABLES #
 */
var assetRoot = config.assetRoot;
var buildRoot = config.buildRoot;
var lessonRoot = config.lessonRoot;
var sourceFolder = config.sourceFolder;

/*
 * # TASKS #
 */

/*
 * Create archive files for each subdir of buildRoot
 * Each archive includes all assets.
 */
gulp.task('archive', function() {
  var src_dirs = fs.readdirSync(buildRoot).filter(function(file) {
    return fs.statSync(path.join(buildRoot, file)).isDirectory();
  });
  var streams = _.map(src_dirs, function (dirname){
    if (dirname == 'assets') {
      return;
    }
    return gulp.src([
          buildRoot + '/index.html',
          buildRoot + '/{assets,assets/**}',
          buildRoot + '/{'+dirname+','+dirname+'/**}',
          ])
      .pipe(zip(dirname + '.zip'))
      .pipe(gulp.dest(buildRoot));
  });
  streams = _.compact(streams);
  return merge(streams);
});

/*
 * serve build directory
 */
gulp.task('server', ['force-build', 'css', 'js', 'assets'], function () {
  browserSync.init({
    server: { baseDir: buildRoot }
  });
});

/*
 * build less files to css, prefix and minify
 */
gulp.task('css', function(cb) {
  return gulp.src('styles/main.less')
    .pipe(less())
    .on('error', cb)
    .pipe(addsrc([
      'node_modules/scratchblocks2/build/scratchblocks2.css',
      'node_modules/metalsmith-code-highlight/node_modules/highlight.js/styles/idea.css'
    ]))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(assetRoot));
});

/*
 * copy all assets to build directory
 */
gulp.task('assets', function(){
  return gulp.src([
      'assets/**/*',
      'node_modules/scratchblocks2/build/*/*.png',
      'node_modules/bootstrap/dist/*/glyphicons-halflings-regular.*',
    ])
    .pipe(gulp.dest(assetRoot));
});


/*
 * browserify, concat and uglify scripts
 */
gulp.task('browserify', function() {
  return gulp.src('scripts/index.js')
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(uglify())
  .pipe(concat('script.min.js'))
  .pipe(gulp.dest(assetRoot));
});


/*
 * concat and uglify vendor scripts
 */
gulp.task('js', ['browserify'], function(){
  return gulp.src([
    'node_modules/scratchblocks2/build/scratchblocks2.js',
    'node_modules/scratchblocks2/src/translations.js',
    'node_modules/bootstrap/js/tooltip.js'
  ])
  .pipe(uglify())
  .pipe(addsrc.prepend([
    'node_modules/jquery/dist/jquery.min.js'
  ]))
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest(assetRoot));
});

/*
 * metalsmith building
 */
gulp.task('build', build);
gulp.task('force-build', function(done){
  build(function(err){
    done(err);
  }, { // build options
    force: true
  });
});

/*
 * dist - build all without serving
 */
gulp.task('dist', function(cb){
  // preferred way to this will change in gulp 4
  // see https://github.com/gulpjs/gulp/issues/96
  run('clean',
      ['assets', 'build', 'css', 'js'],
      'archive',
      'pdf', // do not include pdf in zip files
      cb);
});

/*
 * clean - remove files in build directory
 */
gulp.task('clean', function(cb){
  del([path.join(lessonRoot, 'build')], {force: true}, cb);
});

/*
 * pdf - generate pdfs of all htmls
 */
gulp.task('pdf', pdf);

/*
 * links - check for broken links
 */
gulp.task('links', checkLinks('http://localhost:3000/'));
gulp.task('prodlinks', checkLinks(config.productionCrawlStart));

/*
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
  github.on('pull_request', function(repo, ref, data) {
    if (data.pull_request.merged) {
      console.log('Merged PR, building...');
      deployProc = exec(config.ghMergeCommand, function(err, stdout, stderr) {
        if(err!==null) {
          console.log(stderr);
        } else {
          console.log('Build successfull.');
        }
      });
    } else {
      console.log('Webhook event "pull_request", not merged. Nothing to do.');
    }
  });
  github.listen();
});


/*
 * # DEFAULT TASK #
 * do metalsmith build
 * build, concat and minify styles
 * concat and uglify scripts
 * copy assets
 * serve build directory with livereload
 * watch files -> build and reload upon changes
 */
gulp.task('default', ['server'], function(){
  /*
   * ## WATCHES ##
   */
  // files which are built with metalsmith
  gulp.watch([config.sourceRoot + '/**', '!' + config.sourceRoot + '/**/index.md'], ['build', reload]);
  gulp.watch([__dirname + '/templates/**', config.sourceRoot + '/**/index.md'], ['force-build', reload]);

  // styles
  gulp.watch(path.join(__dirname, 'styles', '**', '*'), ['css', reload]);

  // scripts
  gulp.watch(path.join(__dirname, 'scripts', '**'), ['js', reload]);

  // assets
  gulp.watch(path.join(__dirname, 'assets', '**'), ['assets', reload]);
});
