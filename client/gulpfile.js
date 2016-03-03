// Include gulp itself
var gulp = require('gulp');

// Include plugins
// var watchify = require('watchify');
// var concat = require('gulp-concat');
// var del = require('del');
// var connect = require('gulp-connect');
// var proxy = require('http-proxy-middleware');
// var rename = require("gulp-rename");

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
    console.log('Loading ', taskFile);
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
