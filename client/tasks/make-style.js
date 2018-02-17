module.exports = function (gulp, $) {

    var less = require('gulp-less');

    // Compile LESS files
    gulp.task('make-style', function() {
        return gulp.src('app78923x/styles/style.less')
            .pipe(less())
            .pipe(gulp.dest($.cfg.destFolder));
    });

};

