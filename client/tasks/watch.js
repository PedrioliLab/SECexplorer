module.exports = function (gulp, $) {

    var connect = require('gulp-connect');
    var watch = require('gulp-watch');

    // Watch Files For Changes
    gulp.task('watch', function() {
        // gulp.watch($.cfg.sourceDir + '/**/*.js', [
        //     'lint',
        // ]);
        gulp.watch('app78923x/styles/**/*.less', ['make-style']);
        gulp.watch('app78923x/**/*.+(html|png|ico|jpg)', ['copy']);
        watch($.cfg.destFolder + '/**/*').pipe(connect.reload());
    });

};
