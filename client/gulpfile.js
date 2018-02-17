// Include gulp itself
var gulp = require('gulp');
var runSequence = require('run-sequence');

// Define variables
var config = {
    sourceDir: './app78923x/src',
    sourceFile: './app78923x/src/app.module.js',
    destFolder: './app78923x/build' 
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

gulp.task('start', 
    function() {
	    return runSequence(
		'clean',
		['make-script-watch', 'make-style'],
		'copy',
		'watch',
		'start-server'
	    )
	}
);

gulp.task('build', 
    function() {
	    return runSequence(
		'clean',
		['make-script', 'make-style'],
		'copy'
	    )
	}
);

gulp.task('default', 
    function() {
	    return runSequence(
		'build',
		'start'
	    )
	}
);
