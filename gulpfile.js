var gulp = require('gulp')
	, gulpif = require('gulp-if')
	, templateCache = require('gulp-angular-templatecache')
	, concat = require('gulp-concat')
	, rename = require('gulp-rename')
	, ngAnnotate = require('gulp-ng-annotate')
	, uglify = require('gulp-uglify')
	, minifyHtml = require('gulp-minify-html')
	, minifyCss = require('gulp-minify-css')
	, lazypipe = require('lazypipe')
	, serve = require('gulp-serve')
	, path = require('path');
 
gulp.task('serve', serve([path.join(__dirname, 'src'), __dirname]));

var js = lazypipe()
		.pipe(function(){ return concat('expression-builder.js') })		
		.pipe(function(){ return gulp.dest('dist') })
		.pipe(function(){ return rename('expression-builder.min.js') })
		.pipe(ngAnnotate)
		.pipe(uglify);
		
var css = lazypipe()
	.pipe(function(){ return concat('expression-builder.css') })
	.pipe(function(){ return gulp.dest('dist') })
	.pipe(function(){ return rename('expression-builder.min.css') })
	.pipe(minifyCss);
	
var tpls = lazypipe()
	.pipe(minifyHtml)
	.pipe(function(){
		return templateCache({ 
			module: 'expression-builder'
		})
	});
	
gulp.task('default', function () {
    gulp.src(['src/**/*.*'])
		
		//lint the src .js files
        
		//convert html templates to .js
		.pipe(gulpif('*.html', tpls()))
		
		.pipe(gulpif('*.js', js()))
		.pipe(gulpif('*.css', css()))
        
		.pipe(gulp.dest('dist'));
});