var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var jspm = require('jspm');
var replace = require('gulp-replace');

const PATH_WEB = './web';
const PATH_SASS = [PATH_WEB + '/sass/**/*.scss'];
const PATH_CSS = PATH_WEB + '/css';
const PATH_JS = PATH_WEB + '/js';
const PATH_ES = PATH_WEB + '/es';

gulp.task('default', ['sass', 'sass-min', 'jspm-bundle']);
gulp.task('bundle', ['default']);

gulp.task('w', ['sass'], function() {
	gulp.watch(PATH_SASS, ['sass']);
});

gulp.task('sass', function(done) {
	gulp
		.src(PATH_SASS)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(PATH_CSS))
		.on('end', done);
});

gulp.task('sass-min', function(done) {
	gulp
		.src(PATH_SASS)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(PATH_CSS))
		.on('end', done);
});

gulp.task('jspm-bundle', function(done) {
	var builder = new jspm.Builder(PATH_WEB, PATH_WEB + '/config.js');
	builder
		.buildStatic('es/main', PATH_WEB + '/js/main.min.js', {
			minify : true
		})
		.then(function(output) {
			done();
		});
});
