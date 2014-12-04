var gulp = require("gulp");
var browserSync = require('browser-sync');
var build = require('./metalsmith');
var reload = browserSync.reload;

// server
gulp.task('server', function () {
  browserSync.init({
      server: { baseDir: './build' }
  });
});

gulp.task('build', build);

gulp.task('default', ['server'], function(){
  gulp.watch('./src/**/*', build);
  gulp.watch('./templates/**/*', build);

  // wait for build, then reload
  gulp.watch('./build/**/*', browserSync.reload);
});
