import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import App from './App'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-default/index.css'

import { store } from './store/store.js'


const signature = ` /$$$$$$$$                 /$$      /$$
|_____ $$                 | $$  /$ | $$
     /$$/                 | $$ /$$$| $$
    /$$/                  | $$/$$ $$ $$
   /$$/                   | $$$$_  $$$$
  /$$/                    | $$$/ \  $$$
 /$$$$$$$$       /OO      | $$/   \  $$       /OO
|________/      |__/      |__/     \__/      |__/`;
console.log(signature);

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI, { locale })

new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
