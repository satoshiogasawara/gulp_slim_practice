var gulp = require("gulp");
var plumber = require("gulp-plumber");
var browser = require("browser-sync");
var ssi = require('connect-ssi')
var bower = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require('gulp-rename');
var sass = require("gulp-sass");
var slim = require("gulp-slim");
var autoprefixer = require("gulp-autoprefixer");
var cache = require('gulp-cached');
var notify = require('gulp-notify');
var merge = require('merge-stream');
var csscomb = require('gulp-csscomb');
var imagemin = require("gulp-imagemin");
var minimist = require('minimist')
var replace = require('gulp-replace');
var changed  = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');

/*--------------------- generate [gulp g --page hoge] --------------------*/
gulp.task('g', function(){
    var knownOptions = {
        string: 'page',
         default: { env: process.env.NODE_ENV || 'under' }
    };
    var options = minimist(process.argv.slice(2), knownOptions)
    var page = options.page
    var pageupper = page.charAt(0).toUpperCase() + page.slice(1);
    console.dir(page + "ページに必要なファイルを生成しています");
    var img = gulp.src('./app/images/_under/')
        .pipe(rename("_" + page))
        .pipe(gulp.dest('./app/images/'));
    var css = gulp.src('./app/stylesheets/under.sass')
        .pipe(rename(page + ".sass"))
        .pipe( replace( '#Under', '#' + pageupper ) )
        .pipe(gulp.dest('./app/stylesheets/'));
    var folder = gulp.src('./app/views/under/')
        .pipe(rename(page))
        .pipe(gulp.dest('./app/views/'));
    var slim = gulp.src('./app/views/under/*')
        .pipe( replace( '#Under', '#' + pageupper ) )
        .pipe(gulp.dest('./app/views/' + page));
    return merge(img, css, folder, slim);
});


/*--------------------- sass [sass] --------------------*/
gulp.task("sass", function() {
  gulp.src("./app/stylesheets/application.sass")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({pretty: true}))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("./public/css/"))
    .pipe(browser.reload({stream:true}));
    });

/*--------------------- slim [slim] --------------------*/
gulp.task('slim', function() {
  var dest = gulp.src(["./app/views/**/*.slim" , '!./app/views/partial/*.slim'])
    .pipe(cache( 'slim' ))
    .pipe(plumber())
    .pipe(slim({
      pretty: true,
      require: 'slim/include',
      options: 'include_dirs=["./app/views/partial"]'
    }))
    .pipe(gulp.dest('./public/'))

    var top =  gulp.src('./app/views/index.slim')
    .pipe(slim({
      pretty: true,
      require: 'slim/include',
      options: 'include_dirs=["./app/views/partial"]'
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(browser.reload({stream:true}));

    return merge(dest, top);
});

/*--------------------- image [imagemin] --------------------*/
gulp.task("imagemin", function() {
    gulp.src("./app/images/**/*.+(jpg|jpeg|png|gif|svg)")
        .pipe(changed( './public/img/' ))
        .pipe(imagemin())
        .pipe(gulp.dest("./public/img/"));
});


/*--------------------- csscomb [comb] --------------------*/
gulp.task('comb', function() {
  return gulp.src('./public/css/*.css')
    .pipe(csscomb())
    .pipe(gulp.dest('./public/css/'));
});

/*--------------------- JavaScript [jsmin] --------------------*/
gulp.task("jsmin", function() {
    gulp.src("./app/javascripts/*.js")
        .pipe(changed( 'jsmin' ))
        .pipe(plumber())
        .pipe(uglify())
        .pipe( rename({
          extname: '.min.js'
        }) )
        .pipe(gulp.dest("./public/js/"))
        .pipe(browser.reload({stream:true}))
});

/*--------------------- WordPress [wordpress] --------------------*/
gulp.task( 'wordpress', function () {
    return gulp.src( [
            'public/**'
        ] )
        .pipe(changed( 'wordpress' ))
        .pipe( replace( '<link rel="stylesheet" href="/', '<link rel="stylesheet" href="<?php bloginfo("template_url"); ?>/' ) )
        .pipe( replace( '<script src="/', '<script type="text/javascript" src="<?php bloginfo("template_url"); ?>/' ) )
        .pipe( replace( '<a href="/', '<a href="<?php echo home_url(); ?>/' ) )
        .pipe( replace( '<img src="/', '<img src="<?php bloginfo("template_url"); ?>/' ) )
        .pipe( replace( '<input type="image" src="/', '<input type="image" src="<?php bloginfo("template_url"); ?>/' ) )
        .pipe( replace( '<!--#include virtual="/include/side.html" -->', '<?php get_template_part( "side" ); ?>' ) )
        .pipe( replace( '<!--#include virtual="/include/header.html" -->', '<?php get_header(); ?>' ) )
        .pipe( replace( '<!--#include virtual="/include/footer.html" -->', '<?php get_footer(); ?>' ) )
        .pipe( gulp.dest( 'wordpress' ) );
});

/*--------------------- deploy [deploy] --------------------*/
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var conn_config = {
  host: 'hoge',
  user: 'hoge',
  password: 'password',
  parallel: 5,
  log: gutil.log
}
var remoteDest = '/home/hogehoge/www/hogehoge';
var globs = [
        'public/**'
];

gulp.task('deploy', function(){
  var conn = ftp.create(conn_config);
  gulp.src(globs, {buffer: false, dot: true})
    .pipe(conn.newerOrDifferentSize(remoteDest))
    .pipe(conn.dest(remoteDest));
});

/*--------------------- browser sync [server] --------------------*/
gulp.task("server", function() {
    browser({
        server: {
            baseDir: ["./public/"],
        },

         ghostMode: {
          location: true
        }
    });
});

/*--------------------- bower [bower] --------------------*/
gulp.task('bower', function() {
  var jsDir = './app/javascripts/',
      jsFilter = gulpFilter('**/*.js', {restore: true});
  return gulp.src( bower({
      paths: {
        bowerJson: 'bower.json'
      }
    }) )
    .pipe( jsFilter )
    .pipe( concat('_bundle.js') )
    .pipe( gulp.dest(jsDir) )
    .pipe( uglify({
      // !から始まるコメントを残す
      preserveComments: 'some'
    }) )
    .pipe( rename({
      extname: '.min.js'
    }) )
    .pipe( gulp.dest('./public/js/') )
    .pipe( jsFilter.restore );
});

/*--------------------- default [gulp] --------------------*/
gulp.task('default', ['server' , 'watch' , 'bower' ,'imagemin' ,'slim'] );

/*--------------------- watch --------------------*/
gulp.task('watch', function () {
    gulp.watch(['./app/views/**/*.slim','./app/views/partial/*.slim'],['slim']);
    gulp.watch("./app/**/*.sass", ['sass']);
    gulp.watch("./app/javascripts/*.js", ['jsmin']);
});
