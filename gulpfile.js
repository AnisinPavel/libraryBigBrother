//gulp

import gulp from "gulp";
import gulpIf from "gulp-if";
import gulpPlumber from "gulp-plumber";
import browserSync, { watch } from "browser-sync";
import { deleteAsync } from "del";
import rename from "gulp-rename";

//html

import htmlMin from "gulp-htmlmin";

//css

//js

//image

//server

let dev = false;

const path = {
  src: {
    base: "src/",
    html: "src/*.html",
    scss: "src/scss/**/*.scss",
    js: "src/js/index.js",
    img: "src/img/**/*.{jpg,svg,jpeg,png,gif}",
    assets: ["src/fonts/**/*.*", "src/icons/**/*.*"],
  },
  dist: {
    base: "dist/",
    html: "dist/",
    css: "dist/css/",
    js: "dist/js/",
    img: "dist/img",
  },
  watch: {
    html: "src/*.html",
    scss: "src/scss/**/*.scss",
    js: "src/js/**/*.*",
    img: "src/img/**/*.{jpg,svg,jpeg,png,gif}",
  },
};

export const html = () =>
  gulp
    .src(path.src.html)
    .pipe(
      gulpIf(
        !dev,
        htmlMin({
          removeComments: true,
          collapseWhitespace: true,
        })
      )
    )
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.stream());

export const scss = () =>
  gulp
    .src(path.src.scss)
    .pipe(gulpIf(dev, sourcemaps.init()))
    .pipe(scssToCss().on("error", scssToCss.logError))
    .pipe(
      gulpIf(
        !dev,
        autoprefixer({
          cascade: false,
        })
      )
    )
    .pipe(gulpIf(!dev, gcmq()))
    .pipe(gulpIf(!dev, gulp.dest(path.dist.css)))
    .pipe(
      gulpIf(
        !dev,
        cleanCSS({
          2: {
            specialComments: 0,
          },
        })
      )
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulpIf(dev, sourcemaps.write()))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.stream());

export const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    host: "localhost",
    //tunnel: true,
    server: {
      baseDir: "dist",
    },
  });

  gulp.watch(path.src.html, html);
};
