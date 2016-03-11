module.exports = function (gulp, $) {

    var connect = require('gulp-connect');
    var watch = require('gulp-watch');

    // Watch Files For Changes
    gulp.task('watch', function() {
        gulp.watch($.cfg.sourceDir + '/**/*.js', ['lint', 'make-script-watch']);
        gulp.watch('app/styles/**/*.less', ['make-style']);
        gulp.watch('app/**/*.+(html|png|ico|jpg)', ['copy']);
        watch($.cfg.destFolder + '/**/*').pipe(connect.reload());
    });

};
