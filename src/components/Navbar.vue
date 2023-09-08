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
          <b-dropdown-item v-for="option in options" 
                        :key="option.value" 
                        :value="option.value"
                        @click="changeItem(option)"
                        >
          {{option.text}}
          </b-dropdown-item>        
        </b-nav-item-dropdown>

        <b-nav-form>
          <div v-if="selectedItem=='Contact'">
            <b-button 
              id='btnNewContact'
              v-b-modal.new-contact-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-contact-modal')"
              >New {{ selectedItem }}
            </b-button>
          </div>
          <div v-else-if="selectedItem=='Project'">
            <b-button 
              id='btnNewProject'
              v-b-modal.new-project-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-project-modal')"
              >New {{ selectedItem }}
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
              >New {{ selectedItem }}
            </b-button>
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
  
  <div>
        <!-- Contact modal -->
        <b-modal 
          id="new-contact-modal" 
          >
        <template #modal-title>
            New Contact
        </template>
        
        <div>
          <b-form>
            <b-card bg-variant="light">
              <b-form-group
                label-cols-lg="3"
                label="New Contact"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  label="Name:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.contact.fullname"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Title:"
                  label-for="nested-city"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-city" v-model="form.contact.title"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Email:"
                  label-for="nested-state"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-state" v-model="form.contact.email"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Number:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.contact.number"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Office:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.contact.office"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Firm:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.contact.firme"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Projects:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.contact.projects"></b-form-input>
                </b-form-group>
              
            </b-form-group>
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addPerson" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Contact</b-button>
                <!--<b-button @click="processData" v-b-modal.modal-close_visit class="btn-sm m-1" >Process Data</b-button>-->
        </template>
        </b-modal>

        <!-- Project modal -->
        <b-modal 
          id="new-project-modal" 
          >
        <template #modal-title>
            New Project
        </template>
        
        <div>
          <b-form>
            <b-card bg-variant="light">
              <b-form-group
                label-cols-lg="3"
                label="New Project"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  label="Name:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.project.name"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Status:"
                  label-for="project-status"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-select id="project-status" v-model="form.project.status" :options="availableStatusList"/>
                </b-form-group>
              
                <b-form-group
                  label="Category:"
                  label-for="nested-state"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-state" v-model="form.project.category"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Start Date:"
                  label-for="project-startdate"
                  label-cols-sm="3"
                  label-align-sm="right"
                  >
                  <b-form-datepicker id="project-startdate" v-model="form.project.startdate" class="mb-2"></b-form-datepicker>
                </b-form-group>
              
                <b-form-group
                  label="End Date:"
                  label-for="project-enddate"
                  label-cols-sm="3"
                  label-align-sm="right"
                  >
                  <b-form-datepicker id="project-enddate" v-model="form.project.enddate" class="mb-2"></b-form-datepicker>
                </b-form-group>
              
                <b-form-group
                  label="Associated Lifecycle:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-form-select id="mySelect2" v-model="form.project.lifecycle" :options="lifecycleListName"/>
                <!--
                  <b-dropdown 
                    id="dropdown-1" 
                    text="Dropdown Button" 
                    class="m-md-2"
                    v-model="form.project.lifecycle"
                    v-for="(plan, index) in lifecycleList" :key="plan.id"
                    >
                    <b-dropdown-item>{{ plan.Name }}</b-dropdown-item>
                  </b-dropdown>-->
                </b-form-group>
              
            </b-form-group>
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addProject" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Project</b-button>
                <!--<b-button @click="processData" v-b-modal.modal-close_visit class="btn-sm m-1" >Process Data</b-button>-->
        </template>
        </b-modal>

        <!-- Lifecycle modal -->
        <b-modal 
          id="new-lifecycle-modal" 
          >
        <template #modal-title>
            New Lifecycle
        </template>
        
        <div>
          <b-form>
            <b-card bg-variant="light">
              <b-form-group
                label-cols-lg="3"
                label="New Lifecycle"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  label="Name:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.lifecycle.name"></b-form-input>
                </b-form-group>

                <!-- Step card-->
                <b-card bg-variant="light">
                <b-form-group
                label-cols-lg="3"
                label="New Step"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
                >
                <b-form-group
                  label="Name:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.lifecycle.step.name"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Order:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.lifecycle.step.order"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Placeholder:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.lifecycle.step.placeholder"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Email Template:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-form-textarea
                  id="textarea"
                  v-model="form.lifecycle.step.emailForm"
                  placeholder="Enter something..."
                  rows="5"
                  max-rows="10"
                ></b-form-textarea>
                <!--
                  <b-form-input id="nested-street" v-model="form.lifecycle.step.emailForm"></b-form-input>-->
                </b-form-group>
                <b-button @click="addLifecycleStep" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Step</b-button>

                </b-form-group>
                </b-card>
              
                <b-form-group
                  label="Steps:"
                  label-for="nested-city"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  {{form.lifecycle.steps}}
                </b-form-group>
              
            </b-form-group>
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addLifecycle" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Lifecycle</b-button>
        </template>
        </b-modal>
  </div>
</div>
</template>

<script>
import {useCollect} from 'pinia-orm/dist/helpers';
import {displayStore} from '../main.js';
import {usePerson, useProject, useLifecycle} from '../main.js';
import { LifecycleStep } from '../stores/Lifecycle';
import {availableStatus} from '../stores/Project';

import WorkSessionIO from './WorkSessionIO.vue';


export default {
  name: 'NavBar',
  components:{
    WorkSessionIO
  },
  computed:{
    availableStatusList: () => availableStatus,
    lifecycleListName: () => useCollect(useLifecycle.all()).sortBy('Name').map(item => item.Name)
  },
  data(){
    return{
      selectedItem: "-",
      options: [
        {value: '1', text: 'Lifecycle'},
        {value: '2', text: 'Project'},
        {value: '3', text: 'Contact'},
      ],
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
      }
    }
  },
  methods:{
    changeItem(option){
      this.selectedItem = option.text
      displayStore.viewSelection = option.text
      console.log(displayStore)
    },
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
    }
  }
}
</script>


<style scoped>
.navbar{
    margin-bottom: 10px;
}

</style>