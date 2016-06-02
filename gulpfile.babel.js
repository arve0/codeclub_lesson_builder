/**
 * # DEPENDENCIES #
 */
var gulp = require('gulp')
try {
  var browserSync = require('browser-sync')
  var reload = browserSync.reload // reload shorthand
} catch (e) { }
var path = require('path')
var join = path.join  // shorthand
var addsrc = require('gulp-add-src')
var del = require('del')
var run = require('run-sequence')
var _ = require('lodash')
// metalsmith building
var build = require('./build.js')
var buildIndexes = require('./build-indexes.js')
var buildSearchIndex = require('./build-search-index.js')
// styles and scripts
var less = require('gulp-less')
var concat = require('gulp-concat')
var autoprefixer = require('gulp-autoprefixer')
var minify = require('gulp-minify-css')
var uglify = require('gulp-uglify')
var browserify = require('browserify')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var buffer = require('vinyl-buffer')
// pdf generation
var pdf = require('./pdf.js')
// link-checking
var checkLinks = require('./check-links')
// get configuration variables
var config = require('./config.js')

// github hooks
var exec = require('child_process').exec
var githubhook = require('githubhook')

/**
 * # TASKS #
 */

/**
 * serve build directory
 */
gulp.task('server', ['build', 'build-indexes', 'css', 'js:client', 'js:vendor', 'assets'], function () {
  browserSync.init({
    server: { baseDir: config.buildRoot },
    ghostMode: false
  })
})

/**
 * build less files to css, prefix and minify
 */
gulp.task('css', function (cb) {
  return gulp.src('styles/main.less')
    .pipe(less())
    .on('error', cb)
    .pipe(addsrc([
      'node_modules/highlight.js/styles/idea.css',
      'node_modules/intro.js/introjs.css'
    ]))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(config.assetRoot))
})

/**
 * copy all assets to build directory
 */
gulp.task('assets', function () {
  return gulp.src([
    'assets/**/*',
    'node_modules/bootstrap/dist/*/glyphicons-halflings-regular.*'
  ]).pipe(gulp.dest(config.assetRoot))
})

/**
 * browserify and uglify client-side scripts
 */
var b = browserify({
  entries: './scripts/index.js',
  cache: {},
  packageCache: {},
  plugin: [watchify],
  debug: true
}).transform('babelify', { presets: ['es2015'] })
b.on('log', console.log)

gulp.task('js:client', function () {
  // do not uglify in dev env
  return b.bundle()
    .on('error', (err) => {
      console.log(err)
      this.emit('end')
    })
    .pipe(source('script.min.js'))
    .pipe(gulp.dest(config.assetRoot))
})

gulp.task('js:dist', function () {
  return b.bundle()
    .on('error', (err) => {
      console.log(err)
      this.emit('end')
    })
    .pipe(source('script.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.assetRoot))
})

/**
 * concat and uglify vendor scripts
 */
gulp.task('js:vendor', function () {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/scratchblocks/src/scratchblocks.js',
    'node_modules/scratchblocks/src/translations.js',
    'node_modules/bootstrap/js/modal.js',
    'node_modules/bootstrap/js/tooltip.js',
    'node_modules/bootstrap/js/popover.js'
  ])
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(config.assetRoot))
})

/**
 * metalsmith building
 */
gulp.task('build', build)
gulp.task('build-force', (cb) => {
  build(cb, { force: true })
})
gulp.task('build-indexes', buildIndexes)
gulp.task('build-search-index', buildSearchIndex)

/**
 * dist - build all without serving
 */
gulp.task('dist', function (cb) {
  // preferred way to this will change in gulp 4
  // see https://github.com/gulpjs/gulp/issues/96
  run('clean',
      ['assets', 'build-force', 'build-indexes', 'build-search-index', 'css', 'js:dist', 'js:vendor'],
      'pdf',
      function (err) {
        // make sure process exit (b = watchify bundle)
        b.close()
        cb(err)
      })
})

/**
 * clean - remove files in build directory
 */
gulp.task('clean', function (cb) {
  del([join(config.lessonRoot, 'build')], {force: true}, cb)
})

/**
 * pdf - generate pdfs of all htmls
 */
gulp.task('pdf', pdf)

/**
 * links - check for broken links
 */
gulp.task('links', checkLinks('http://localhost:3000/'))
gulp.task('prodlinks', checkLinks(config.productionCrawlStart))

/**
 * github webhook for automatic building
 */
gulp.task('github', function (cb) {
  var github = githubhook({
    host: config.ghHost,
    port: config.ghPort,
    path: config.ghPath,
    secret: config.ghSecret
  })
  github.on('*', function (event) {
    if (event !== 'pull_request') {
      console.log('Webhook event "' + event + '". Nothing to do.')
    }
  })
  github.on('pull_request', build)
  github.listen()
  var currentlyBuilding = false
  function build (repo, ref, data) {
    if (currentlyBuilding) {
      console.log('Already building. Waiting 4 minutes...')
      _.delay(build, 4 * 60 * 1000, repo, ref, data)
    } else if (data.pull_request.merged) {
      currentlyBuilding = true
      console.log('Merged PR, building...')
      exec(config.ghMergeCommand, function (err, stdout, stderr) {
        if (err !== null) {
          console.log(stderr)
        } else {
          console.log('Build successfull.')
        }
        currentlyBuilding = false
      })
    } else {
      console.log('Webhook event "pull_request", not merged. Nothing to do.')
    }
  }
})

/**
 * # DEFAULT TASK #
 * do metalsmith build
 * build, concat and minify styles
 * concat and uglify scripts
 * copy assets
 * serve build directory with livereload
 * watch files -> build and reload upon changes
 */
gulp.task('default', ['server'], function () {
  /**
   * ## WATCHES ##
   */
  // files which are built with metalsmith
  gulp.watch([join(config.sourceRoot, '/**'), '!' + config.sourceRoot + '/**/index.md'], ['build', reload])
  gulp.watch([join(__dirname, '/layouts/**'), config.sourceRoot + '/**/index.md'], ['build-indexes', reload])

  // styles
  gulp.watch(join(__dirname, 'styles', '**', '*'), ['css', reload])

  // scripts
  gulp.watch(join(__dirname, 'scripts', '**'), ['js:client', reload])

  // assets
  gulp.watch(join(__dirname, 'assets', '**'), ['assets', reload])
})
