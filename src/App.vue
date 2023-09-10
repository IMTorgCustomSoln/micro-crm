<template>
    <div>
        <Navbar/>
      <main>
        <b-container class="bv-example-row">
            <b-row>
                <b-col>
        <component :is="selection"/>
                </b-col>
            </b-row>
        </b-container>
      </main>
    </div>
</template>
  
<script>
import {displayStore} from '@/main.js';
import Navbar from '@/components/Navbar.vue';

import ContactPage from '@/views/ContactPage.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import LifecyclePage from '@/views/LifecyclePage.vue';

export default {
  name: `LayoutDefault`,
  components:{
    Navbar,
    ContactPage,
    ProjectPage,
    LifecyclePage
  },
  data() {
    return {
    };
  },
  computed:{
      selection: () => {
        console.log(displayStore.viewSelection.path)
        return displayStore.viewSelection.path; 
    }
  }
};
</script>