<template>
    <div>
        <NavbarTop/>
      <main>
        <SideBar/>
        <b-container class="bv-example-row">
          <div><b>Selected:</b> {{ selectedProjects }}</div>
          <div v-if="selectedProjects">
            <Event label="Log Event" contacts="[]"/>
            <ModalFeedback label="Log Feedback"/>
          </div>
            <b-row>
                <component :is="selectedPath"/>
            </b-row>
        </b-container>
      </main>
    </div>
</template>
  
<script>
import {useDisplayStore} from '@/main.js';
import NavbarTop from '@/components/NavbarTop.vue';
import SideBar from '@/components/Sidebar.vue';

import Event from '@/components/modals/ModalEvent.vue';
import ModalFeedback from '@/components/modals/ModalFeedback.vue';

import ContactPage from '@/views/ContactPage.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import LifecyclePage from '@/views/LifecyclePage.vue';
import EventReport from '@/views/EventReport.vue'
import NextStepsReport from './views/NextStepsReport.vue';


export default {
  name: `App`,
  components:{
    NavbarTop,
    SideBar,

    EventReport,
    ModalFeedback,

    ContactPage,
    ProjectPage,
    LifecyclePage,
    NextStepsReport
  },
  data() {
    return {
    };
  },
  computed:{
    selectedPath: () => {
      return useDisplayStore.viewSelection.path; 
    },
    selectedProjects(){
      return useDisplayStore.projectSelection.Name
    }
  }
};
</script>