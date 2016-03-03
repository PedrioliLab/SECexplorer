module.exports = function (gulp, $) {

    var connect = require('gulp-connect');
    var proxy = require('http-proxy-middleware');

    // Start development server that serves static files and proxies
    // API requests to backend server
    gulp.task('start-server', function() {
        return connect.server({
            port: 8010,
            root: 'app/build',
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

};
