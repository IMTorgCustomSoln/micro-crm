<template>
<div >
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav >
        <b-nav-item >Logo</b-nav-item>
  
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
            <b-button 
              id='btnNewProject'
              v-b-modal.new-project-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-project-modal')"
              >New Project
            </b-button>
            <!--<ModalProject/>-->
          </div>

          <div v-else-if="selectedItem=='Contact'">
            <b-button 
              id='btnNewContact'
              v-b-modal.new-contact-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-contact-modal')"
              >
              New Contact
            </b-button>
          </div>
          <div v-else-if="selectedItem=='Lifecycle'">
            <b-button 
              id='btnNewLifecycle'
              v-b-modal.new-lifecycle-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-lifecycle-modal')"
              >New Lifecycle
            </b-button>
            <!--<ModalLifecycle/>-->
          </div>
        </b-nav-form>
      </b-navbar-nav>
  
        <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <WorkSessionIO></WorkSessionIO>
        
        <b-button 
          size="sm" 
          class="my-2 my-sm-0" 
          variant="outline-light" 
          style="margin-left:5px"
          type="button"
          v-b-modal="'account-modal'"
          @click="$bvModal.show('account-modal')"
          >User
        </b-button>
        <ModalAccount/>
        </b-nav-form>
        <!--
        Open modal from dropdown, ref: https://stackoverflow.com/questions/65298847/how-can-i-modify-a-dropdown-item-in-bootstrap-vue-to-open-a-modal
        <b-nav-item-dropdown text="User" right>
          <b-dropdown-item href="#">Account</b-dropdown-item>
          <b-dropdown-item href="#">Settings</b-dropdown-item>
        </b-nav-item-dropdown>
        -->
        </b-navbar-nav>
      
    </b-navbar>
  </div>
</div>
</template>

<script>
import {toRaw} from 'vue';
import {isEmpty} from '@/assets/utils.js';
import {useDisplayStore} from '@/main.js';
import WorkSessionIO from './WorkSessionIO.vue';

import ModalAccount from '@/components/modals/ModalAccount.vue'
//import ModalContact from '@/components/ModalContact.vue';
//import ModalProject from '@/components/ModalProject.vue';
//import ModalLifecycle from '@/components/ModalLifecycle.vue';


export default {
  name: 'NavbarTop',
  components:{
    WorkSessionIO,
    ModalAccount
    //ModalContact,
    //ModalProject,
    //ModalLifecycle
  },
  data(){
    return{
      selectedItem: '',
      options: useDisplayStore.options.slice(0,3)
    }
  },
  mounted(){
    this.selectedItem = useDisplayStore.viewSelection.text
  },
  computed:{
    displayProjectSelected: ()=>{
      let prj = {}
      const selected = toRaw(useDisplayStore.projectSelection)
      if(!isEmpty(selected)){
        prj = selected.Name
      }
      return prj
    }
  },
  methods:{
    changeItem(option){
      this.selectedItem = option.text
      //useDisplayStore.viewSelection = option
      Object.assign(useDisplayStore.viewSelection, option)
      console.log(JSON.parse(JSON.stringify(useDisplayStore)) )
    },
  }
}
</script>


<style scoped>
.navbar{
    margin-bottom: 10px;
}

</style>