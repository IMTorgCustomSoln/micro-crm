import Vue, { createApp } from '@vue/compat';
import {BootstrapVue, BIcon, BootstrapVueIcons} from 'bootstrap-vue';
import App from './App.vue';

import { pinia}  from './stores/config.js';
import { useRepo } from "pinia-orm";


//style
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('b-icon', BIcon)




//start
const app = createApp(App)
app.use(pinia)

//stores must be init after pinia is used
import DisplayStore from '@/stores/DisplayStore';

export const useDisplayStore = DisplayStore()



//table init
import Person from "@/stores/Person.js";
import Project from "@/stores/Project.js";
import {Lifecycle, LifecycleStep} from "@/stores/Lifecycle.js";
import {PersonProjectStatus} from '@/stores/PersonProjectStatus';
import {Interaction} from '@/stores/Interaction';
import {UseCase} from '@/stores/UseCase';

export const usePerson = useRepo(Person, pinia);
export const useProject= useRepo(Project, pinia);
export const useLifecycle = useRepo(Lifecycle, pinia);
export const useLifecycleStep = useRepo(LifecycleStep, pinia);
export const useStatus = useRepo(PersonProjectStatus, pinia);
export const useInteraction = useRepo(Interaction, pinia);
export const useUseCase = useRepo(UseCase, pinia);


//set defaults
import {testLifecycle} from './stores/Lifecycle.js';
if(useDisplayStore.populateDefault){
    for(const plan of testLifecycle){
        useLifecycle.save({
              Name: plan.Name,
              LifecycleStep: plan.LifecycleStep
            });
      }
}


//load test data
import {populateProjectTestData, populateContactTestData} from '@/assets/defaults.js';
if(useDisplayStore.populateTestData){
    populateProjectTestData(useProject)
    populateContactTestData(usePerson)
}




app.mount('#app')