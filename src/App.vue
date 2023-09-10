<template>
    <div>
        <NavBar/>
      <main>
        <b-container class="bv-example-row">
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
import NavBar from '@/components/Navbar.vue';

import ContactPage from '@/views/ContactPage.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import LifecyclePage from '@/views/LifecyclePage.vue';

export default {
  name: `App`,
  components:{
    NavBar,
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
    }
  }
};
</script>