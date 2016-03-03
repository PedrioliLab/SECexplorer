module.exports = function (gulp, $) {

    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var uglify = require('gulp-uglify');
    var browserify = require('browserify');
    var rename = require('gulp-rename');
    var sourcemaps = require('gulp-sourcemaps');

    // Use browserify to convert the module system to be browser-compatible
    // and include referenced npm libraries.
    gulp.task('make-script', function() {
      return browserify($.cfg.sourceFile, {debug: true})
          .bundle()
          .pipe(source('script.js'))
          .pipe(gulp.dest($.cfg.destFolder))
          .pipe(buffer())
          .pipe(sourcemaps.init({
              loadMaps: true
          }))
          .pipe(uglify())
          .pipe(sourcemaps.write('.'))
          .pipe(rename('script.min.js'))
          .pipe(gulp.dest($.cfg.destFolder));
    });

};

