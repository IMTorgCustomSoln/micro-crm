<template>
    <div>
        <NavbarTop/>
      <main>
        <SideBar/>
        <b-container class="bv-example-row">
          <div><b>Selected:</b> {{ selectedProjects }}</div>
          <div v-if="selectedProjects">
            <ModalEvent label="Log Event" contacts="[]"/>
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

import ModalEvent from '@/components/modals/ModalEvent.vue';
import ModalFeedback from '@/components/modals/ModalFeedback.vue';

//Navbar Views
import ContactPage from '@/views/ContactPage.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import LifecyclePage from '@/views/LifecyclePage.vue';

//Sidebar:Views
import EventPage from '@/views/EventPage.vue';
import FeedbackPage from '@/views/FeedbackPage.vue';


//Sidebar:Reports
import EventSummaryReport from '@/views/EventSummaryReport.vue';
import NextStepsReport from './views/NextStepsReport.vue';


export default {
  name: `App`,
  components:{
    NavbarTop,
    SideBar,
    ModalEvent,
    ModalFeedback,

    //
    ProjectPage,
    ContactPage,
    LifecyclePage,

    //
    EventPage,
    FeedbackPage,

    //
    EventSummaryReport,
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