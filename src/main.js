import Vue, { createApp } from '@vue/compat';
import {BootstrapVue, BIcon, BootstrapVueIcons} from 'bootstrap-vue';
import App from './App.vue';

import pinia from './stores/config.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('b-icon', BIcon)



const app = createApp(App)
app.use(pinia)
app.mount('#app')