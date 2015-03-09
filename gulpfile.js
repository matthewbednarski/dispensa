var gulp = require('gulp');
var manifest = require('gulp-manifest');

gulp.task('manifest', function(){
  gulp.src(['src/*'])
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
     }))
    .pipe(gulp.dest('src/'));
});

gulp.task('default', ['manifest'], function() {
  // place code for your default task here
});
