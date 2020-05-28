import Vue from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faAngleRight);
library.add(faAngleLeft);
Vue.component('font-awesome-icon', FontAwesomeIcon);


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import _ from 'lodash'

import VueRouter from 'vue-router'
import Routes from './routes'
Vue.use(VueRouter);
//global register
//import Main from './Main.vue'
//Vue.component('maincontent', Main);
const bus = new Vue();
export default bus;

const router = new VueRouter({
  routes:Routes
});


new Vue({
  el: '#app',
  render: h => h(App), router:router
})
