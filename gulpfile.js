var build = require('./build'); // build.js in same folder
var gulp = require("gulp");
var less = require('gulp-less');
var zip = require('gulp-zip');
var path = require('path');
var browserSync = require('browser-sync');
var fs = require("fs");

// reload shorthand
var reload = browserSync.reload;

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
gulp.task('server', ['build', 'less', 'assets'], function () {
  browserSync.init({
    server: { baseDir: 'build' }
  });
});

/*
 * build less files to css
 */
gulp.task('less', ['fonts'], function() {
  console.log('debug less');
  return gulp.src('styles/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'styles', 'includes') ]
    }))
    .pipe(gulp.dest('build/assets/css/'));
});

/*
 * copy glyphicon fonts from bootstrap
 */
gulp.task('fonts', function(){
  return gulp.src('node_modules/bootstrap/fonts/*')
    .pipe(gulp.dest('build/assets/fonts/'));
});

/*
 * copy all assets to build directory
 */
gulp.task('assets', function(){
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('build/assets/'));
});

/*
 * metalsmith building
 */
gulp.task('build', build);


/*
 * # DEFAULT TASK #
 * do metalsmith and css build
 * copy assets
 * serve build directory with livereload
 * watch files -> build
 */
gulp.task('default', ['server'], function(){
  /*
   * ## WATCHES ##
   */
  // files which are built with metalsmith
  gulp.watch('src/**/*', ['build', reload]);
  gulp.watch('templates/**/*', ['build', reload]);

  // styles
  gulp.watch('styles/**/*', ['less', reload]);

  // assets
  gulp.watch('assets/**/*', ['assets', reload]);
});
