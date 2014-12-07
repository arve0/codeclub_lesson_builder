var build = require('./metalsmith');
var gulp = require("gulp");
var less = require('gulp-less');
var path = require('path');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// server
gulp.task('server', function () {
  browserSync.init({
      server: { baseDir: './build' }
  });
});

gulp.task('less', function() {
    gulp.src('./less/**/*.less')
    .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('build', ['less'], build);

gulp.task('default', ['server'], function(){
  gulp.watch('./src/**/*', build);
  gulp.watch('./templates/**/*', build);

  // wait for build, then reload
  gulp.watch('./build/index.html', browserSync.reload);
});
