import gulp from 'gulp';
const { src, dest } = gulp;
import autoprefixer from 'gulp-autoprefixer';
import browsersync from 'browser-sync';
import gulpclean from 'gulp-clean';
import cssbeautify from 'gulp-cssbeautify';
import cssnano from 'gulp-cssnano';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import gulppug from 'gulp-pug';
import rename from 'gulp-rename';
import rigger from 'gulp-rigger';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
const sass = gulpSass(nodeSass);
import uglify from 'gulp-uglify';

let path = {
  build: {
    html: 'dist/',
    js: 'dist/assets/js/',
    css: 'dist/assets/css/',
    font: 'dist/assets/fonts/',
    images: 'dist/assets/img/',
  },

  src: {
    font: 'src/assets/fonts/*',
    pug: 'src/pug/pages/**/*.pug',
    js: 'src/assets/js/*.js',
    css: 'src/assets/sass/style.scss',
    images: 'src/assets/img/**/*.{jpg,png,svg,gif,ico}',
  },

  watch: {
    font: 'src/assets/fonts/*',
    pug: 'src/pug/**/*.pug',
    js: 'src/assets/js/**/*.js',
    css: 'src/assets/sass/**/*.scss',
    images: 'src/assets/img/**/*.{jpg,png,svg,gif,ico}',
  },

  clean: './dist',
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    port: 3000,
  });
}

async function css() {
  return src(path.src.css, { base: 'src/assets/sass/' })
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min', extname: '.css' }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

async function js() {
  return src(path.src.js, { base: './src/assets/js/' })
    .pipe(plumber())
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min', extname: '.js' }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

async function images() {
  return src(path.src.images)
    .pipe(imagemin())
    .pipe(dest(path.build.images));
}

async function clean() {
  return gulpclean(path.clean);
}

async function pug() {
  return src(path.src.pug, { base: './src/pug/pages/' })
    .pipe(plumber())
    .pipe(gulppug({ pretty: true }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

async function font() {
  return src(path.src.font, { base: 'src/assets/fonts/' })
    .pipe(dest(path.build.font))
    .pipe(browsersync.stream());
}

async function watchFiles() {
  gulp.watch([path.watch.pug], pug);
  gulp.watch([path.watch.font], font);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
}

const build = gulp.series(clean, css, font, js, pug, images);
const watch = gulp.series(build, watchFiles, browserSync);

export { css, js, images, clean, pug, font, build, watch };
export default watch;
