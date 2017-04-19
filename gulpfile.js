const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('default', () => {
  return browserify('./src/index.js')
    .transform(babelify.configure({
      presets: ['es2015', 'stage-2']
    }))
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('src/browser'));
});
