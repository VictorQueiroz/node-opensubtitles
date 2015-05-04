var gulp = require('gulp');
var jshint = require('gulp-jshint');

var paths = {
	scripts: ['lib/**/*.js']
}

gulp.task('jshint', function () {
	gulp.src(paths.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter());
});

gulp.task('scripts', ['jshint'], function () {
	//
});

gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['watch']);