// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');

const loadPlugins = require('gulp-load-plugins');
const bs = require('browser-sync');

const plugins = loadPlugins();

const data = {
    pkg: require('./package.json'),
    date: new Date()
};
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(
            plugins.sass({
                outputStyle: 'expanded'
            })
        )
        .pipe(dest('tmp'));
};

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(
            plugins.babel({
                presets: ['@babel/preset-env']
            })
        )
        .pipe(dest('tmp'));
};

const page = () => {
    return src('src/**/*.html')
        .pipe(plugins.swig({ data }))
        .pipe(dest('tmp'));
};

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'));
};

const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'));
};

const clean = () => {
    return del(['dist', 'tem']);
};

const extra = () => {
    return src('public/**', { base: 'public' }).pipe(dest('dist'));
};

const serve = () => {
    watch('src/assets/styles/*.scss', style);
    watch('src/assets/scripts/*.js', script);
    watch('src/**/*.html', page);

    // Watch('src/assets/images/**', image);
    // watch('src/assets/fonts/**', font);
    // watch('public/**', extra);

    watch(['src/assets/images/**', 'src/assets/fonts/**', 'public/**'], bs.reload);

    bs.init({
        notify: false,
        port: 8887,
        open: false,
        files: 'dist/**',
        server: {
            baseDir: ['tmp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
};

const useref = () => {
    return src('tmp/*.html', { base: 'tmp' })
        .pipe(plugins.useref({ searchPath: ['tmp', '.'] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        })))
        .pipe(dest('dist'));
};

const compile = parallel(style, script, page);

const build = series(clean, parallel(series(compile, useref), font, image, extra));

// 开发
const dev = series(compile, serve);

module.exports = {
    compile,
    build,
    clean,
    serve,
    dev,
    useref
};
