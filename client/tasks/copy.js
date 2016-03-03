module.exports = function (gulp, $) {

    var es = require('event-stream');
    var connect = require('gulp-connect');

    // Copy static files into build directory
    gulp.task('copy', function() {
        // Copy all images
        var s1 = gulp.src('app/resources/**/*.+(png|ico|jpg)', {base: 'app'})
            .pipe(gulp.dest('app/build'));
        // Copy main index file
        var s2 = gulp.src('app/index.html', {base: 'app'})
            .pipe(gulp.dest('app/build'));
        // Copy all angular templates 
        var s3 = gulp.src('app/src/**/*.html', {base: 'app'})
            .pipe(gulp.dest('app/build'));

        return es.merge(s1, s2, s3);
    });

};

