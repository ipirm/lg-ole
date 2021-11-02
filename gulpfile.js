const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const fileinclude = require('gulp-file-include');

// HTML FILE INCLUDE
function fileInclude() {
    return src('app/index.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app/sections'
        }))
        .pipe(dest('./'));
}

// Sass Task
function scssTask() {
    return src('app/scss/style.scss', {sourcemaps: true})
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('assets/css', {sourcemaps: '.'}));
}

// JavaScript Task
function jsTask() {
    return src('app/js/script.js', {sourcemaps: true})
        .pipe(terser())
        .pipe(dest('assets/js', {sourcemaps: '.'}));
}

// Browsersync Tasks
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch(['app/*.html', 'app/sections/**/*.html'], series(browsersyncReload, fileInclude));
    watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
    scssTask,
    jsTask,
    fileInclude,
    browsersyncServe,
    watchTask
);