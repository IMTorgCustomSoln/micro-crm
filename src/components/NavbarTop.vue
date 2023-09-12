<template>
<div >
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav >
        <b-nav-item >Logo</b-nav-item>
        <b-nav-item>Prj: {{ displayProjectSelected }}</b-nav-item>
  
        <!-- Navbar dropdowns 
        ref:https://codesandbox.io/s/y31zkqnwkz?file=/App.vue
          -->
        <b-nav-item-dropdown 
          text="Select View" 
          v-model="selectedItem" 
          v-on:change="changeItem"
          >
          <b-dropdown-item 
            v-for="option of options" 
            :key="option.value" 
            :value="option.value"
            @click="changeItem(option)"
            > {{ option.text }}
          </b-dropdown-item>        
        </b-nav-item-dropdown>

        <b-nav-form>
          <div v-if="selectedItem=='Project'">
            <ModalProject></ModalProject>
          </div>
          <div v-else-if="selectedItem=='Contact'">
            <ModalContact></ModalContact>
          </div>
          <div v-else-if="selectedItem=='Lifecycle'">
            <ModalLifecycle/>
          </div>
        </b-nav-form>
      </b-navbar-nav>
  
        <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <WorkSessionIO></WorkSessionIO>
        </b-nav-form>
        <b-nav-item-dropdown text="User" right>
          <b-dropdown-item href="#">Account</b-dropdown-item>
          <b-dropdown-item href="#">Settings</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      
    </b-navbar>
  </div>
</div>
</template>

<script>
import {displayStore} from '../main.js';
import WorkSessionIO from './WorkSessionIO.vue';

import ModalContact from '@/components/ModalContact.vue';
import ModalProject from '@/components/ModalProject.vue';
import ModalLifecycle from '@/components/ModalLifecycle.vue';


export default {
  name: 'NavbarTop',
  components:{
    WorkSessionIO,
    ModalContact,
    ModalProject,
    ModalLifecycle
  },
  data(){
    return{
      selectedItem: '',
      options: displayStore.options
    }
  },
  mounted(){
    this.selectedItem = displayStore.viewSelection.text
  },
  computed:{
    displayProjectSelected: ()=>{
      let prj = {}
      if( displayStore.projectSelection){
        prj = displayStore.projectSelection.Name
      }
      return prj
    }
  },
  methods:{
    changeItem(option){
      this.selectedItem = option.text
      displayStore.viewSelection = option
      console.log(JSON.parse(JSON.stringify(displayStore)) )
    },
  }
}
</script>


<style scoped>
.navbar{
    margin-bottom: 10px;
}

</style>