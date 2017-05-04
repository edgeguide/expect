const gulp = require('gulp');
const babel = require('gulp-babel');
const fs = require('fs');
let ignored = ['browser', 'package.json', 'README.md'];

gulp.task('default', done => {
  transpileDirectory({
    src: 'src',
    dest: 'dist'
  });

  function transpileDirectory({src, dest}) {
    let files = fs.readdirSync(src);

    files.forEach(file => {
      if (ignored.indexOf(file) !== -1) {
        return;
      }
      if (file.indexOf('.js') !== -1) {
        transpileFile({
          src: `${src}/${file}`,
          dest: `${dest}`
        });
      } else {
        transpileDirectory({
          src: `${src}/${file}`,
          dest: `${dest}/${file}`
        });
      }
    });

    function transpileFile({src, dest}) {
      gulp.src(src)
      .pipe(babel({
        presets: ['es2015', 'stage-2']
      }))
      .pipe(gulp.dest(dest));
    }
  }
});
