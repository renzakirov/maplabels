module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'maplabels',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'label with photos on map or on pictur'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
    }
  },
  plugins: [{
      src: '~plugins/nuxt-plugin.js',
      ssr: false
    },
    '~/plugins/fireauth.js'
  ],
  router: {
    middleware: 'router-auth'
  },
  css: [
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css',
    'spectre.css/src/spectre.scss',
    '@/assets/css/main.scss'
  ],
  mode: 'spa'
}
