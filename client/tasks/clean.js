module.exports = function (gulp, $) {

    var del = require('del');

    // Clean old build files
    gulp.task('clean', function() {
        return del(['app78923x/build']);
    });

};

