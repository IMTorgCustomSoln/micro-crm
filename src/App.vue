<template>
    <div>
        <NavbarTop/>
      <main>
        <b-container class="bv-example-row">
          <div><b>Selected:</b> {{ selectedProjects }}</div>
            <b-row>
                <b-col>
                <component :is="selectedPath"/>
                </b-col>
            </b-row>
        </b-container>
      </main>
    </div>
</template>
  
<script>
import {displayStore} from '@/main.js';
import NavbarTop from '@/components/NavbarTop.vue';

import ContactPage from '@/views/ContactPage.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import LifecyclePage from '@/views/LifecyclePage.vue';

export default {
  name: `App`,
  components:{
    NavbarTop,
    ContactPage,
    ProjectPage,
    LifecyclePage
  },
  data() {
    return {
    };
  },
  computed:{
      selectedPath: () => {
        return displayStore.viewSelection.path; 
    },
    selectedProjects(){
      return displayStore.projectSelection.Name
    }
  }
};
</script>