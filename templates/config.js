var pngquant = require('imagemin-pngquant');
var path = require('path');

/**
 * General Settings
 * ----------------------------
 * Set up your project settings here. The project name is used
 * in some of the paths and filenames below. URL is needed for
 * browser-sync options.
 */

var project = {
  name: '<%= appNameSlug %>',
  url: '<%= appUrl %>',
  bypassCms: <%= bypass %>,
  cuttlefish: <%= cuttlefish %>,
};

var hbs = {
  data: ['./_src/markup/_data/**/*.{js,json}'],
  helpers: ['./node_modules/handlebars-layouts'],
  partials: ['./_src/markup/_partials/**/*.hbs', './_src/markup/_layouts/**/*.hbs'<% if(cuttlefish) { %>, './node_modules/cuttlefish/partials/**/*.hbs'<% }%>],
};

var syncOptions = {
  ghostMode: {
    clicks: false,
    location: true,
    forms: true,
    scroll: false,
  },
  logPrefix: project.name,
  open: 'external',
  port: 1337,
  xip: true,
}

if(project.bypassCms) {
  syncOptions.server = { baseDir: './build' }
} else {
  syncOptions.proxy = project.url
}

// Sprite source
// Needs to be specified here because sprity is annoying and 
// uses its own source, rather than gulp.src.. so we have to call it
// multiple times.
// 
// All other sources are listed below.
var spriteSource = ['./_src/sprites/**/*'];

/**
 * Task Settings
 * -----------------------------
 * These are individual task settings.
 */
module.exports = {
  paths: {
    html: {
      source: ['./_src/markup/**/*.{html,hbs,php}'],
      dest: (project.bypassCms ? './build/' : './pages/')
    },
    css: {
      source: ['./_src/sass/**/*.{scss,sass}'],
      dest: (project.bypassCms ? './build/css/' : './css/')
    },
    images: {
      source: ['./_src/images/**/*'],
      dest: (project.bypassCms ? './build/images/' : './images/')
    },
    scripts: {
      source: ['./_src/scripts/**/*.js'],
      dest: (project.bypassCms ? './build/js/' : './js/')
    },
    sprites: {
      source: spriteSource
    },
    svgSprites: {
      source: ['./_src/svgSprites/**/*.svg']
    },
    cdn: 'https://'+project.name+'.clcdn.com/',
  },

  handlebars: {
    bustCache: true,
    debug: true,
    data: hbs.data,
    helpers: hbs.helpers,
    partials: hbs.partials,
    parsePartialName: function(file){
      return path.basename(file.shortPath);
    }
  },

  htmlmin: {
    /* You can pick and choose what gets stripped out here. See https://github.com/kangax/html-minifier for more options */
    removeComments: true,
    collapseWhitespace: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  },

  images: {
    options: {
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false,
        cleanupIDs: false
      }],
      use: [pngquant()]
    },
  },

  sass: {
    fileName: project.name + '.css',
    options: {
      gulpSass:{
        errLogToConsole: true,
        sync: false,
      },
      autoprefixer: {
        browsers: ['last 2 versions']
      }
    }
  },

  scripts: {
    fileName: project.name + '.js',
  },

  sprites: {
    src: spriteSource,
    style: './_sprite.scss',
    dimension: [{
      ratio: 1, dpi: 72
    }, {
      ratio: 2, dpi: 192
    }],
    background: 'transparent',
    split: true,
    processor: 'sass',
  },

  svgSprites: {
    mode: {
      symbol: {
        dest: './_src/markup/_partials',
        sprite: 'inlineSvg.hbs',
        inline: true,
      }
    },
    svg: {
      xmlDeclaration: false,
      namespaceIDs: false,
    },
    shape: {
      transform: [{
        svgo: {
          plugins: [{
            cleanupIDs: false
          }]
        }
      }]
    }
  },

  sync: syncOptions
};
