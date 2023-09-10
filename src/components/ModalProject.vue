<template>
            <b-button 
              id='btnNewProject'
              v-b-modal.new-project-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-project-modal')"
              >New Project
            </b-button>

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
                </b-form-group>
              
            </b-form-group>
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addProject" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Project</b-button>
        </template>
    </b-modal>

</template>

<script>
import {displayStore} from '../main.js';
import {useProject} from '@/main.js';


export default {
  name: 'ModalProject',
  data(){
    return{
      selectedItem: displayStore.viewSelection,
      form:{
        project:{
          name:'',
          status:'',
          category:'',
          startdate:'',
          enddate:'',
          lifecycle:''
        },
      }
    }
  },
  methods:{
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
    }
}
</script>


<style scoped>

</style>