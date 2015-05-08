var gulp = require('gulp'),
  browserify = require('browserify'),
  del = require('del'),
  source = require('vinyl-source-stream'),
  babelify = require('babelify');


var paths = {
    srcJs: [
      'ngreact.js',
      'angular.js',
      'react-state.js',
      'react-rerender.js'
    ],
    js: ['./bundle.js']
}


gulp.task('clean', function(done){
    del(['build'], done)
})


gulp.task('js', ['clean'], function() {
  paths.srcJs.forEach(function(file) {
    browserify({debug: true})
    .transform(babelify)
    .require('./src/' + file, {entry: true})
    .bundle()
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe(source(file))
    .pipe(gulp.dest('./html/static/'));
  })
})


// Rerun tasks whenever a file changes.
gulp.task('watch', ['js'], function() {
    gulp.watch(paths.srcJs.map(function(file) {
      return './src/' + file;
    }), ['js']);
});
