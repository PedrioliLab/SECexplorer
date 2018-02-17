module.exports = function (gulp, $) {

    var es = require('event-stream');
    var connect = require('gulp-connect');

    // Copy static files into build directory
    gulp.task('copy', function() {
        // Copy all images
        var s1 = gulp.src('app78923x/resources/**/*.+(png|ico|jpg)', {base: 'app78923x'})
            .pipe(gulp.dest('app78923x/build'));
        // Copy main index file
        var s2 = gulp.src('app78923x/index.html', {base: 'app78923x'})
            .pipe(gulp.dest('app78923x/build'));
        // Copy all angular templates 
        var s3 = gulp.src('app78923x/src/**/*.html', {base: 'app78923x'})
            .pipe(gulp.dest('app78923x/build'));

        return es.merge(s1, s2, s3);
    });

};

