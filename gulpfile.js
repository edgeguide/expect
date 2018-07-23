const gulp = require('gulp');
const babel = require('gulp-babel');
const fs = require('fs');
const ignored = ['browser', 'package.json', 'README.md'];

gulp.task('default', () => transpileDirectory({ src: 'src', dest: 'dist' }));

function transpileDirectory({ src, dest }) {
  fs.readdirSync(src).forEach(file => {
    if (ignored.includes(file)) return;
    file.includes('.js')
      ? transpileFile({
        src: `${src}/${file}`,
        dest: `${dest}`
      })
      : transpileDirectory({
        src: `${src}/${file}`,
        dest: `${dest}/${file}`
      });
  });
}

function transpileFile({ src, dest }) {
  gulp
    .src(src)
    .pipe(babel({ presets: ['es2015', 'stage-2'] }))
    .pipe(gulp.dest(dest));
}
