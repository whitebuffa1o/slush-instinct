var gulp = require('gulp');
var instinctFile = require('./node_modules/instinct_cl/gulpfile')(gulp);

gulp.task('default', ['instinct'], function(){
  console.log('You can have custom gulp tasks per project!');
});
