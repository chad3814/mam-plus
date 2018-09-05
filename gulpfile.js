const Gulp = require('gulp');
const Del = require('del');
const Ts = require('gulp-typescript');
const Srcmap = require('gulp-sourcemaps');
const Header = require('gulp-header');
const Inject = require('gulp-inject-string')
const Min = require('gulp-uglify-es').default;
const Fs = require('fs');
const pkg = require('./package.json');

const globs = {
    app: 'src/**/*.ts',
    meta: 'metadata.txt'
}

const path = {
    scripts: {
        dest: 'release/',
        name: `${pkg.name}.user.js`
    },
    dev_scripts: {
        dest: 'build/',
        name: `${pkg.name}_dev.user.js`
    }
}

let tsSettings = {
    strict: true,
    target: "es6",
    rootDir: "src"
}

let env = 'dev';

/** Returns a path object relative to the env */
function basePathEnv(){
    let pathObj = path.dev_scripts;
    pkg.env = '_dev';
    if ( env == 'release' ) {
        pathObj = path.scripts;
        pkg.env = '';
    }
    return pathObj;
}

/** Returns the current timestamp */
function buildTime(){
    const mString = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let now = new Date();
    let month = mString[ now.getUTCMonth() ];
    let day = now.getUTCDate();
    return `${month} ${day}`;
}

/** Task to clean the output directories */
Gulp.task(
    'clean', () => {
        return Del( [ path.dev_scripts.dest ] );
    }
);

/** Task to set the working Env to release */
Gulp.task(
    'releaseEnv', () => {
        return new Promise( (resolve) => {
            env = 'release';
            resolve();
        } );
    }
);

/** Task to minify the userscript */
Gulp.task(
    'minify', () => {
        let loc = basePathEnv();
        return Gulp.src( `${loc.dest}/${loc.name}` )
            .pipe( Min() )
            .pipe( Gulp.dest( loc.dest ) );
    }
);

/** Task to insert a userscript header from a file, with package.json info */
Gulp.task(
    'insertHead', () => {
        let loc = basePathEnv();
        return Gulp.src( `${loc.dest}/${loc.name}` )
            // Insert userscript header
            .pipe( Header( Fs.readFileSync( 'metadata.txt', 'utf8' ), { pkg: pkg } ) )
            // Output the file
            .pipe( Gulp.dest( loc.dest ) );
    }
);

/** Task to convert the .ts files into a _dev.user.js file */
Gulp.task(
    'procTS_dev', () => {
        let loc = basePathEnv();
        tsSettings.outFile = loc.name;
        let timestamp = buildTime();

        return Gulp.src( globs.app, { base: 'src' } )
            // Initiate sourcemap
            /* TODO:
            * Figure out why sourcemapping displays everything as originating from
            * the last line of the main file
            */
            .pipe( Srcmap.init() )
                // Inject timestamp
                .pipe( Inject.replace( '##timestamp##', timestamp ) )
                // Compile typescript
                .pipe( Ts( tsSettings ) )
            // Write sourcemap
            .pipe( Srcmap.write() )
            // Output the file
            .pipe( Gulp.dest( loc.dest ) );
    }
);
/** Task to convert the .ts files into a .user.js file */
Gulp.task(
    'procTS_build', () => {
        let loc = basePathEnv();
        tsSettings.outFile = loc.name;
        let timestamp = buildTime();

        return Gulp.src( globs.app )
            // Inject timestamp
            .pipe( Inject.replace( '##timestamp##', timestamp ) )
            // Compile typescript
            .pipe( Ts( tsSettings ) )
            // Output the file
            .pipe( Gulp.dest( loc.dest ) );
    }
);

/** NPM build task. Use for one-off development */
Gulp.task(
    'build', Gulp.series( 'clean','procTS_dev','insertHead' )
);

/** NPM watch task. Use for continual development */
Gulp.task(
    'watch', () => {
        Gulp.watch( [globs.app, globs.meta], Gulp.series( 'procTS_dev', 'insertHead' ) );
    }
);

/** NPM release task. Use for publishing the compiled script */
Gulp.task(
    'release', Gulp.series( Gulp.parallel('clean','releaseEnv'), 'procTS_build','minify', 'insertHead' )
);
