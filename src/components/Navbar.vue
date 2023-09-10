<template>
<div >
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav >
        <b-nav-item >Home</b-nav-item>
  
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
            <!--
            <router-link :to="{'name':option.path}">{{option.text}}</router-link>
            <router-view/>-->
          </b-dropdown-item>        
        </b-nav-item-dropdown>

        <b-nav-form>
          <div v-if="selectedItem=='Contact'">
            <ModalContact></ModalContact>
          </div>
          <div v-else-if="selectedItem=='Project'">
            <ModalProject></ModalProject>
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
  name: 'NavBar',
  components:{
    WorkSessionIO,
    ModalContact,
    ModalProject,
    ModalLifecycle
  },
  computed:{/*
    availableStatusList: () => availableStatus,
    lifecycleListName: () => useCollect(useLifecycle.all()).sortBy('Name').map(item => item.Name)
    */
  },
  data(){
    return{
      selectedItem: "-",
      options: [
        {value: '1', text: 'Lifecycle', path:'LifecyclePage'},
        {value: '2', text: 'Project', path:'ProjectPage'},
        {value: '3', text: 'Contact', path:'ContactPage'},
      ],/*
      form:{
        contact:{
          fullname:'',
          title:'',
          email:'',
          number:'',
          office:'',
          firm:'',
          projects:''
        },
        project:{
          name:'',
          status:'',
          category:'',
          startdate:'',
          enddate:'',
          lifecycle:''
        },
        lifecycle:{
          name:'',
          step:{
            name:'',
            order:'',
            placeholder:'',
            emailForm:''
          },
          steps:[]
        }
      }*/
    }
  },
  methods:{
    changeItem(option){
      this.selectedItem = option.text
      displayStore.viewSelection = option
      console.log(JSON.parse(JSON.stringify(displayStore)) )
    },/*
    addPerson() {
        usePerson.save({
          Fullname: this.form.contact.fullname,
          Title: this.form.contact.title,
          Email: this.form.contact.email,
          Number: this.form.contact.number,
          Office: this.form.contact.office,
          Firm: this.form.contact.firm,
          Projects: this.form.contact.projects,
        });
        Object.keys(this.form.contact).forEach( k => {
          this.form.contact[k] = ''
        })
        console.log(usePerson.all());
        this.$bvModal.hide('new-contact-modal')
    },
    addProject() {
        useProject.save({
          Name: this.form.project.name,
          Status: this.form.project.status,
          Category: this.form.project.category,
          StartDate: this.form.project.startdate,
          EndDate: this.form.project.enddate,
          Lifecycle: this.form.project.lifecycle
        });
        Object.keys(this.form.project).forEach( k => {
          this.form.project[k] = ''
        })
        console.log(useProject.all());
        this.$bvModal.hide('new-project-modal')
    },
    addLifecycle() {
        useLifecycle.save({
          Name: this.form.lifecycle.name,
          LifecycleSteps: this.form.lifecycle.steps
        });
        Object.keys(this.form.lifecycle).forEach( k => {
          this.form.lifecycle[k] = ''
        })
        console.log(useLifecycle.all());
        this.$bvModal.hide('new-lifecycle-modal')
    },
    addLifecycleStep(){
      const step = new LifecycleStep(
        this.form.lifecycle.step.name,
        this.form.lifecycle.step.order,
        this.form.lifecycle.step.placeholder,
        this.form.lifecycle.step.emailForm,
      )
      this.form.lifecycle.steps.push(step)
    }*/
  }
}
</script>


<style scoped>
.navbar{
    margin-bottom: 10px;
}

</style>