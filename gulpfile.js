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
// archive
var zip         = require('gulp-zip');
var fs          = require("fs");
// link-checking
var checkLinks = require('./check-links');
// get configuration variables
var config      = require('./config.js');

// github hooks
var githubhook = require('githubhook');


/*
 * # VARIABLES #
 */
var assetRoot = config.assetRoot;
var buildRoot = config.buildRoot;
var lessonRoot = config.lessonRoot;
var sourceFolder = config.sourceFolder;
var gitHookRepo = config.gitHookRepo;

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
gulp.task('server', ['build', 'css', 'js', 'assets'], function () {
  browserSync.init({
    server: { baseDir: buildRoot }
  });
});

/*
 * build less files to css, prefix and minify
 */
gulp.task('css', function(cb) {
  return gulp.src('styles/*.less')
    .pipe(less())
    .on('error', cb)
    .pipe(addsrc([
      'node_modules/scratchblocks2/build/scratchblocks2.css'
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
      'node_modules/jquery/dist/jquery.min.map'
    ])
    .pipe(gulp.dest(assetRoot));
});

/*
 * concat and uglify scripts
 */
gulp.task('js', function(){
  return gulp.src([
    'scripts/**/*.js',
    'node_modules/scratchblocks2/build/scratchblocks2.js',
    'node_modules/scratchblocks2/src/translations.js'
  ])
  .pipe(uglify())
  .pipe(addsrc.prepend([
    'node_modules/jquery/dist/jquery.min.js'
  ]))
  .pipe(concat('script.min.js'))
  .pipe(gulp.dest(assetRoot));
});

/*
 * metalsmith building
 */
gulp.task('build', build);

/*
 * dist - build all without serving
 */
gulp.task('dist', function(cb){
  // preferred way to this will change in gulp 4
  // see https://github.com/gulpjs/gulp/issues/96
  run('clean',
      ['assets', 'build', 'css', 'js'],
      'archive',
      cb);
});

/*
 * clean - remove files in build directory
 */
gulp.task('clean', function(cb){
  del([path.join(lessonRoot, 'build')], {force: true}, cb);
});

/*
 * links - check for broken links
 */
gulp.task('links', ['dist'], checkLinks);

gulp.task('github', function(cb){
  var github = githubhook({
    host: "0.0.0.0",
    port: 8082,
    path: "/pushchanges",
    secret: "123456"
  });
  github.on('push', function(repo, ref, data) {
    var branchName = _s.strRightBack(ref, "/");
    var fullNameRepository = data.repository.full_name;
    var removedFilesArray = data["head_commit"]["removed"];
    var addedFilesArray = data["head_commit"]["added"];
    var modifiedFilesArray = data["head_commit"]["modified"];
    console.log(fullNameRepository);
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
  gulp.watch(path.join(lessonRoot, 'src', '**'), ['build', reload]);
  gulp.watch(path.join(__dirname, 'templates', '**'), ['build', reload]);

  // styles
  gulp.watch(path.join(__dirname, 'styles', '**', '*'), ['css', reload]);

  // scripts
  gulp.watch(path.join(__dirname, 'scripts', '**'), ['js', reload]);

  // assets
  gulp.watch(path.join(__dirname, 'assets', '**'), ['assets', reload]);
});
