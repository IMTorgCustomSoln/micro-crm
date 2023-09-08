import Vue, { createApp } from '@vue/compat';
import {BootstrapVue, BIcon, BootstrapVueIcons} from 'bootstrap-vue';
import App from './App.vue';

import router from '@/router/index.js'
import { pinia}  from './stores/config.js';
import { useRepo } from "pinia-orm";

import { useDisplayStore } from './stores/DisplayStore';
import Person from "./stores/Person.js";
import Project from "./stores/Project.js";
import {Lifecycle, LifecycleStep} from "./stores/Lifecycle.js";

//style
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('b-icon', BIcon)




//start
const app = createApp(App)
app.use(pinia)
app.use(router)

//stores must be init after pinia is used
export const displayStore = useDisplayStore()

//table init
export const usePerson = useRepo(Person, pinia);
export const useProject= useRepo(Project, pinia);
export const useLifecycle = useRepo(Lifecycle, pinia);
export const useLifecycleStep = useRepo(LifecycleStep, pinia);

app.mount('#app')