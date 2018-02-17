var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');


module.exports = function (gulp, $) {

    function makeScript(doWatch) {
        var bundler = browserify({
            entries: ['./app78923x/src/app.js'],
            debug: true,
            cache: {},
            packageCache: {},
            fullPaths: doWatch
        });
        if (doWatch) {
            bundler = watchify(bundler);
        }

        var rebundle = function() {
            var stream = bundler.bundle();
            stream.on('error', function() {
                console.log('error');
            });
            stream = stream.pipe(source('script.js'));
            return stream.pipe(gulp.dest($.cfg.destFolder));
        };

        bundler.on('update', rebundle);
        bundler.on('log', function(l) {
            console.log(l);
        });

        return rebundle();
    }

    gulp.task('make-script', function() {
        return makeScript(false);
    });

    gulp.task('make-script-watch', function() {
        return makeScript(true);
    });
};

