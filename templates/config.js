var pngquant = require('imagemin-pngquant');

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

var hbs {
  data: ['./_src/markup/_data/**/*.{js,json}'<% if(cuttlefish) { %>, './node_modules/cuttlefish/_data'<% } %>],
  helpers: ['./node_modules/handlebars-layouts'<% if(cuttlefish) { %>, './node_modules/cuttlefish/_helpers'<% }%>],
  partials: ['./_src/markup/_partials/**/*.hbs', '_src/markup/_layouts/**/*.hbs'<% if(cuttlefish) { %>, './node_modules/cuttlefish/_helpers'<% }%>],
};

var syncOptions = (!project.bypassCms) ? {
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
  proxy: project.url
}:{
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
  server: {
    baseDir: './build'
  }
};

/**
 * Task Settings
 * -----------------------------
 * These are individual task settings.
 */
module.exports = {
  paths: {
    html: (project.bypassCms ? './build/' : './pages/'),
    css: (project.bypassCms ? './build/css/' : './css/'),
    images: (project.bypassCms ? './build/images/' : './images/'),
    scripts: (project.bypassCms ? './build/js/' : './js/'),
    cdn: 'https://'+project.name+'.clcdn.com/',
  },

  handlebars: {
    bustCache: true,
    debug: true,
    data: hbs.data,
    helpers: hbs.helpers,
    partials: hbs.partials,
  },

  minifyHtml: {
    /* You can pick and choose what gets stripped out here. See https://www.npmjs.com/package/gulp-minify-html for more options */
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
    src: '_src/sprites/**/*',
    style: '_sprite.scss',
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
        dest: '_src/markup/_partials',
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
