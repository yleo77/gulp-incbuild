# gulp-incbuild

A gulp plugin with incrementify for helping developer generate increment file between two versions of a given file base on old version.

## Usage

```
var paths = {
  files: ['garbage/**/*.js'],     // src files
  last_dir: './dist/production',  // the last version of project
  inc_dir: './dist/release'       // where inc files could be saved
};
gulp.task('incbuild', ['clean'], function() {
  return gulp.src(paths.files, {
      base: './'
    })
    .pipe(inc({
      last_dir: paths.last_dir,
      inc_dir: paths.inc_dir
    }))

    .pipe(gulp.dest('./dist/release'));
});
```

## License

The MIT License (MIT)