'use strict';
 
var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var nodeSass = require('sass');
var sass = gulpSass(nodeSass);
var concat = require('gulp-concat');
var order = require('gulp-order');
var include = require('gulp-file-include');
var browserSync = require('browser-sync').init({
    server: {
        baseDir: './release/'
    }
});

gulp.task('js', function(){
	return gulp.src('./src/js/*.js')
		// .pipe(uglify())
		.pipe(order([
			"jquery.lazy.js",
			"materialize.js",
			"swiper-bundle.js",
			"autosize.js",
			"jquery.hyphen.ru.min.js",
			"master.js",
			"brand.js"
		]))
		.pipe(concat('master.js'))
		.pipe(gulp.dest('./release/js/'))
		.pipe(browserSync.stream());
});

gulp.task('sass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./release/css'))
        .pipe(browserSync.stream())
});

gulp.task('browser-sync', function(){
    return browserSync.reload();
});

gulp.task('html', function(){
	return gulp.src(['./release/*.html', './src/html/**/*.html'])
		.pipe(browserSync.stream());
});

gulp.task('include', function(){
	return gulp.src('./src/html/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/'));
})

gulp.task('watch', function(){
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('./release/*.html', gulp.series('html'));
	gulp.watch('./src/html/**/*.html', gulp.series('include'));
	gulp.watch(['./release/**/*.*'], gulp.series('browser-sync'));
	gulp.watch('./src/js/*.js', gulp.series('js'));
});