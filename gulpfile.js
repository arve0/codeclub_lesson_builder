/*
 * # DEPENDENCIES #
 */
var gulp = require("gulp");
var browserSync = require('browser-sync');
var reload = browserSync.reload; // reload shorthand
var path = require('path');
var addsrc = require('gulp-add-src');
// html building
var build = require('./build'); // build.js in same folder
// styles and scripts
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
// archive
var zip = require('gulp-zip');
var fs = require("fs");


/*
 * # TASKS #
 */

/*
 * Create archive files for each subdir of build/oppgaver.
 * Each archive includes all assets.
 */
gulp.task('archive', function() {
    var source = 'build/oppgaver';
    var src_dirs = fs.readdirSync(source).filter(function(file) {
        return fs.statSync(path.join(source), file).isDirectory();
    });
    var last_pass;
    for(var dir in src_dirs) {
        var dirname = src_dirs[dir];
        last_pass = gulp.src([
            'build/{assets,assets/**}',
            'build/{oppgaver,oppgaver/{'+dirname+','+dirname+'/**}}',
        ])
        .pipe(zip(dirname+'.zip'))
        .pipe(gulp.dest(source+'/'+dirname));
    }
    return last_pass;
});


/*
 * serve build directory
 */
gulp.task('server', ['build', 'css', 'js', 'assets'], function () {
  browserSync.init({
    server: { baseDir: 'build' }
  });
});

/*
 * build less files to css, prefix and minify
 */
gulp.task('css', function() {
  return gulp.src('styles/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'styles', 'includes') ]
    }))
    .pipe(addsrc([
      'node_modules/scratchblocks2/build/scratchblocks2.css'
    ]))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('build/assets'));
});

/*
 * copy all assets to build directory
 */
gulp.task('assets', function(){
  return gulp.src([
      'assets/**/*',
      'node_modules/scratchblocks2/build/*/*.png',
      'node_modules/bootstrap/dist/*/glyphicons-halflings-regular.*'
    ])
    .pipe(gulp.dest('build/assets'));
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
  .pipe(addsrc([
    'node_modules/jquery/dist/jquery.min.js'
  ]))
  .pipe(concat('script.min.js'))
  .pipe(gulp.dest('build/assets'));
});

/*
 * metalsmith building
 */
gulp.task('build', build);


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
  gulp.watch('src/**/*', ['build', reload]);
  gulp.watch('templates/**/*', ['build', reload]);

  // styles
  gulp.watch('styles/**/*', ['css', reload]);

  // scripts
  gulp.watch('scripts/**/*', ['js', reload]);

  // assets
  gulp.watch('assets/**/*', ['assets', reload]);
});
