// Include gulp itself
var gulp = require('gulp');

// Include plugins
var browserify = require('browserify');
var watchify = require('watchify');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var rename = require("gulp-rename");

// Define variables
var sourceDir = 'app/src';
var sourceFile = 'app/src/app.module.js';
var destFolder = 'app/build';

// Lint Task
gulp.task('lint', function() {
    return gulp.src(sourceDir + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile LESS files
gulp.task('less', function() {
    return gulp.src('app/styles/**/*.less')
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(destFolder));
});

// Use browserify to convert the module system to be browser-compatible
// and include referenced npm libraries.
gulp.task('js', function() {
  return browserify(sourceFile, {debug: true})
      .bundle()
      .pipe(source('script.js'))
      .pipe(gulp.dest(destFolder))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('script.min.js'))
      .pipe(gulp.dest(destFolder));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(sourceDir + '/**/*.js', ['lint', 'js']);
    gulp.watch('app/styles/**/*.less', ['less']);
    gulp.watch('app/**/*.+(html|png|ico|jpg)', ['copy']);
});

// Clean old build files
gulp.task('clean', function() {
    return del(['app/build']);
});

// Start development server that serves static files and proxies
// API requests to backend server
gulp.task('connect', function() {
    connect.server({
        port: 8010,
        root: 'app',
        middleware: function(connect, opt) {
            return [
                proxy('/api', {
                    target: 'http://localhost:8020',
                    changeOrigin:true
                })
            ];
        }
    });
});

// Copy static files into build directory
gulp.task('copy', function() {
    // Copy all images
    gulp.src('app/resources/**/*.+(png|ico|jpg)', {base: 'app'})
        .pipe(gulp.dest('app/build'));
    // Copy main index file
    gulp.src('app/index.html', {base: 'app'})
        .pipe(gulp.dest('app/build'));
    // Copy all angular templates 
    gulp.src('app/src/**/*.html', {base: 'app'})
        .pipe(gulp.dest('app/build'));
});

gulp.task('default', [
    'clean',
    'js',
    'less',
    'copy',
    'watch',
    'connect'
]);
