import Vue, { createApp } from '@vue/compat'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createORM } from 'pinia-orm'
import {BootstrapVue, BIcon, BootstrapVueIcons} from 'bootstrap-vue';

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('b-icon', BIcon)

const app = createApp(App)
const pinia = createPinia().use(createORM()).use(createPersistedState({
    auto: true,
    storage: localStorage
}))
app.use(pinia)

app.mount('#app')
