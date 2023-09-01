import Vue, { createApp } from '@vue/compat';
import {BootstrapVue, BIcon, BootstrapVueIcons} from 'bootstrap-vue';
import App from './App.vue';

import {pinia} from './stores/config.js';
import { useRepo } from "pinia-orm";

import { useDisplayStore } from './stores/DisplayStore';
import Person from "./stores/Person.js";
import Project from "./stores/Project.js";
import {Lifecycle} from "./stores/Lifecycle.js";


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('b-icon', BIcon)



const app = createApp(App)
app.use(pinia)

//stores must be init after pinia is used
export const displayStore = useDisplayStore()

//table init
export const usePerson = useRepo(Person, pinia);
export const useProject= useRepo(Project, pinia);
export const useLifecycle = useRepo(Lifecycle, pinia);

app.mount('#app')