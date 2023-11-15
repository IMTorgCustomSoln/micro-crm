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
import {Account} from '@/stores/Account.js';
import {Person} from "@/stores/Person.js";
import {Project} from "@/stores/Project.js";
import {Lifecycle, LifecycleStep} from "@/stores/Lifecycle.js";
import {PersonProjectStatus} from '@/stores/PersonProjectStatus';
import {PersonProjectStatusEvent} from '@/stores/Event';
import {Event} from '@/stores/Event';
import {Feedback} from '@/stores/Feedback';

export const useAccount = useRepo(Account, pinia);
export const usePerson = useRepo(Person, pinia);
export const useProject= useRepo(Project, pinia);
export const useLifecycle = useRepo(Lifecycle, pinia);
export const useLifecycleStep = useRepo(LifecycleStep, pinia);
export const usePersonProject = useRepo(PersonProjectStatus, pinia);
export const usePersonProjectEvent = useRepo(PersonProjectStatusEvent, pinia);
export const useEvent = useRepo(Event, pinia);
export const useFeedback = useRepo(Feedback, pinia);


//set defaults
import { defaultSteps, defaultLifecycle } from '@/assets/defaults.js';

//test data
for(let step of defaultSteps){
    defaultLifecycle.LifecycleStep.push(step)
  }
export const testLifecycle = [defaultLifecycle]
if(useDisplayStore.populateDefault){
    for(const plan of testLifecycle){
        useLifecycle.save({
              Name: plan.Name,
              LifecycleStep: plan.LifecycleStep
            });
      }
}


app.mount('#app')