// Include gulp itself
var gulp = require('gulp');

// Define variables
var config = {
    sourceDir: './app/src',
    sourceFile: './app/src/app.module.js',
    destFolder: './app/build' 
};

// Read tasks
var taskPath = './tasks';
var taskList = require('fs').readdirSync(taskPath);

taskList.forEach(function(taskFile) {
    var $ = {
        cfg: config
    };
    require(taskPath + '/' + taskFile)(gulp, $);
});

gulp.task('default', [
    'clean',
    'make-script',
    'make-style',
    'copy',
    'watch',
    'start-server'
]);
