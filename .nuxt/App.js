import Vue from 'vue'
import NuxtLoading from './components/nuxt-loading.vue'

import '../assets/css/app.styl'

import '../assets/css/main.scss'

import '../node_modules/flag-icon-css/css/flag-icon.min.css'


let layouts = {

  "_default": () => import('../layouts/default.vue'  /* webpackChunkName: "layouts/default" */).then(m => m.default || m)

}

let resolvedLayouts = {}

export default {
  head: {"title":"Vue Vixens - Workshops for Foxy People to Learn Vue.js","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Vue Vixens - Workshops for Foxy People to Learn Vue.js"},{"name":"msapplication-TileColor","content":"#2b5797"},{"name":"msapplication-config","content":"\u002Ficons\u002Fbrowserconfig.xml"},{"name":"theme-color","content":"#fff"}],"link":[{"rel":"apple-touch-icon","sizes":"180x180","href":"\u002Ficons\u002Fapple-touch-icon.png"},{"rel":"icon","type":"image\u002Fpng","sizes":"32x32","href":"\u002Ficons\u002Ffavicon-32x32.png"},{"rel":"icon","type":"image\u002Fpng","sizes":"16x16","href":"\u002Ficons\u002Ffavicon-16x16.png"},{"rel":"icon","type":"manifest","href":"\u002Ficons\u002Fsite.webmanifest"},{"rel":"mask-icon","href":"\u002Ficons\u002Fsafari-pinned-tab.svg","color":"#5bbad5"},{"rel":"shortcut icon","href":"\u002Ficons\u002Ffavicon.ico"},{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ficons\u002Ffavicon.ico"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Roboto:300,400,500,700|Material+Icons"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Lato"},{"rel":"stylesheet","href":"https:\u002F\u002Fuse.fontawesome.com\u002Freleases\u002Fv5.0.10\u002Fcss\u002Fall.css","integrity":"sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD\u002FOvrJ+37WqIM7UoBtwHO6Nlg","crossorigin":"anonymous"}],"style":[],"script":[{"src":"\u002F\u002Fapp.storyblok.com\u002Ff\u002Fstoryblok-latest.js?t=plc0fBh2no8owEeTALSN2wtt"}]},
  render(h, props) {
    const loadingEl = h('nuxt-loading', { ref: 'loading' })
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      }
    }, [ templateEl ])

    return h('div',{
      domProps: {
        id: '__nuxt'
      }
    }, [
      loadingEl,
      transitionEl
    ])
  },
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  beforeCreate () {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created () {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (typeof window !== 'undefined') {
      window.$nuxt = this
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },
  
  mounted () {
    this.$loading = this.$refs.loading
  },
  watch: {
    'nuxt.err': 'errorChanged'
  },
  
  methods: {
    
    errorChanged () {
      if (this.nuxt.err && this.$loading) {
        if (this.$loading.fail) this.$loading.fail()
        if (this.$loading.finish) this.$loading.finish()
      }
    },
    
    setLayout (layout) {
      if (!layout || !resolvedLayouts['_' + layout]) layout = 'default'
      this.layoutName = layout
      let _layout = '_' + layout
      this.layout = resolvedLayouts[_layout]
      return this.layout
    },
    loadLayout (layout) {
      if (!layout || !(layouts['_' + layout] || resolvedLayouts['_' + layout])) layout = 'default'
      let _layout = '_' + layout
      if (resolvedLayouts[_layout]) {
        return Promise.resolve(resolvedLayouts[_layout])
      }
      return layouts[_layout]()
      .then((Component) => {
        resolvedLayouts[_layout] = Component
        delete layouts[_layout]
        return resolvedLayouts[_layout]
      })
      .catch((e) => {
        if (this.$nuxt) {
          return this.$nuxt.error({ statusCode: 500, message: e.message })
        }
      })
    }
  },
  components: {
    NuxtLoading
  }
}

