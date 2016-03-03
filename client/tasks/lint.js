module.exports = function (gulp, $) {

    var jshint = require('gulp-jshint');

    gulp.task('lint', function() {
        return gulp.src($.cfg.sourceDir + '/**/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

};
