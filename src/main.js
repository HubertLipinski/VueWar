import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { Loading } from 'buefy/dist/components/loading'
import { Tooltip } from 'buefy/dist/components/tooltip'
import { Tag } from 'buefy/dist/components/tag'
import { Taglist } from 'buefy/dist/components/tag'

Vue.config.productionTip = false

Vue.component('b-loading', Loading)
Vue.component('b-tooltip', Tooltip)
Vue.component('b-tag', Tag)
Vue.component('b-taglist', Taglist)
Vue.component('navbar-component', require('./components/Navbar').default)
Vue.component('footer-component', require('./components/Footer').default)

new Vue({
  router,
  store,
  Buefy,
  render: h => h(App)
}).$mount('#app')
