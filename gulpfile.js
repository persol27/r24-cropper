var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    include = require('gulp-include'),
    minify = require('gulp-minify');

gulp.task('css', () => {
    return gulp.src('assets/scss/index.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', () => {
    return gulp.src('assets/js/index.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist/js'))
        /*
        .pipe(minify())
        .pipe(gulp.dest('dist/js'))
        */
})