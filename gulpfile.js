'use strict'

var browserify = require('browserify')
var gulp = require('gulp')
var transform = require('vinyl-transform')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var rename = require('gulp-rename')
var minifyCSS = require('gulp-minify-css')
var less = require('gulp-less')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var es = require('event-stream')
var browserifyShim = require('browserify-shim')

require('colors')

var jsTaskFactory = function(jsSrc) {
  return function () {
    var tasks = jsSrc.map(function(entry) {
      var task = browserify({
        entries: './static/src/' + entry,
        debug: true,
        transform: [babelify, browserifyShim],
      })
      .bundle()
        .pipe(source(entry))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/root/dist/'))

      return task

    })

    return es.merge.apply(null, tasks)
  }
}

gulp.task('js', jsTaskFactory(['index.js']))


gulp.task('css', function() {
  gulp.src('./static/src/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/root/dist'));
})


gulp.task('build', ['js', 'css'])

gulp.task('watch', ['build'], function () {
  gulp.watch(['static/src/*.less', 'static/src/**/*.less'], ['css'])
  gulp.watch(['static/src/*.js', 'static/src/**/*.js'], ['js'])
})

gulp.task('help', function () {
  console.log('\n')
  console.log('↓↓↓↓↓↓↓↓ gulp help ↓↓↓↓↓↓↓↓'.blue)
  console.log('gulp js:'.yellow, '        编译 js 文件')
  console.log('gulp css:'.yellow, '       编译 css(less) 文件')
  console.log('gulp build:'.yellow, '     编译 js/css 文件')
  console.log('gulp watch:'.yellow, '     开启 watch，文件变化时自动编译')
  console.log('gulp help:'.yellow, '      查看帮助文件')
  console.log('\n')
})


gulp.task('default', ['build', 'help'])
