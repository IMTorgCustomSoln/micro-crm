<template>

    <b-modal 
        id="new-project-modal"
        >
        <template #modal-title>
            Project
        </template>
        
        <div>
          <div v-if="this.form.error">
            <span>{{ this.form.error }}</span>
          </div>
          <b-form>
            <b-card bg-variant="light">
                <b-form-group
                  label="Name:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.project.name"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Category:"
                  label-for="nested-state"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <!--TODO: datalist for typing search (like below) does work, but it may be cleaner to just select from options-->
                  <b-form-input id="nested-state" v-model="form.project.category" list="category-list"></b-form-input>
                  <b-form-datalist id="category-list">
                    <option v-for="category in availableCategoryList" :key="category.id">{{ category }}</option>
                  </b-form-datalist>
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
                  label-for="lifecycle"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-form-select id="mySelect2" v-model="form.project.lifecycle" :options="lifecycleList"/>
                </b-form-group>

                <b-form-group
                  label="Source Repos:"
                  label-for="repos"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-form-input id="repos" v-model="form.project.repos"></b-form-input>
                </b-form-group>
              
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
            <div v-if="isCurrentProject">
              <b-button @click="cloneProject" v-b-modal.modal-close_visit class="btn-sm m-1" >Clone</b-button>
            </div>
            
            <b-button @click="addProject" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update</b-button>
        </template>
    </b-modal>

</template>

<script>
import { toRaw } from 'vue';
import {useDisplayStore} from '@/main.js';
import {useProject, useLifecycle, usePerson} from '@/main.js';
import { useCollect } from 'pinia-orm/dist/helpers';


export default {
  name: 'ModalProject',
  props:['item'],
  watch: { 
      item: {
          handler: function(newItem, oldVal) {
            const prj = JSON.parse(JSON.stringify(this.$props.item));
            this.form.project.id = prj.id;
            this.form.project.name = prj.Name;
            this.form.project.status = prj.Status;
            this.form.project.category = prj.Category;
            this.form.project.startdate = prj.StartDate;
            this.form.project.enddate = prj.EndDate;
            this.form.project.lifecycle = prj.Lifecycle.Name;
            this.form.project.repos = prj.Repos;

            this.originalProjectName = prj.Name;
            this.isCurrentProject = true;
            this.$bvModal.show('new-project-modal');
            },
            deep: true
          }
  },
  data(){
    return{
      isCurrentProject: false,
      selectedItem: useDisplayStore.viewSelection,
      originalProjectName: '',
      form:{
        error:'',
        project:{
          id:'',
          name:'',
          category: '',
          status: '',
          startdate: '',
          enddate:'',
          lifecycle: '',
          repos: ''
        }
      }
    }
  },
  mounted(){
    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      //console.log('Modal is about to be closed', bvEvent, modalId)
      this.initializeFormValues()
    })
  },
  computed:{
    availableCategoryList: () => {
      //TODO:maybe this should just be the `useDisplayStore.project.availableCategory`
      let categories = useCollect(useProject.all()).sortBy('Name').map(item=>item.Category)
      if(Array.isArray(categories)){
        categories = categories.concat( toRaw(useDisplayStore.project.availableCategory) )
      } else {
        categories = useDisplayStore.project.availableCategory
      }
      return categories
    },
    availableStatusList: () => useDisplayStore.project.availableStatus,
    lifecycleList: () => useCollect(useLifecycle.all()).sortBy('Name').map(item=>item.Name)
  },
  methods:{
    initializeFormValues(){
      this.form.project.name = ''
      this.form.project.category = useDisplayStore.project.initialCategory
      this.form.project.status = useDisplayStore.project.initialStatus
      this.form.project.startdate = useDisplayStore.project.initialStartDate
      this.form.project.enddate = ''
      this.form.project.lifecycle = useDisplayStore.project.initialLifecycle
      this.form.project.repos = ''

      this.originalProjectName = ''
      this.form.error = ''
    },
    addProject() {
      const projectIds = useCollect(useProject.all()).sortBy('id').map(item => item.id)
      const lifecycleId = useLifecycle.where('Name', this.form.project.lifecycle).get()[0]
      const checkId = projectIds.includes(this.form.project.id)
      if(checkId){
        //update existing
        useProject.save({
          id: this.form.project.id,
          Name: this.form.project.name,
          Status: this.form.project.status,
          Category: this.form.project.category,
          StartDate: this.form.project.startdate,
          EndDate: this.form.project.enddate,
          LifecycleId: lifecycleId,
          Repos: this.form.project.repos
        });
      } else {
        //create new
        useProject.save({
          Name: this.form.project.name,
          Status: this.form.project.status,
          Category: this.form.project.category,
          StartDate: this.form.project.startdate,
          EndDate: this.form.project.enddate,
          Lifecycle: lifecycleId,
          Repos: this.form.project.repos
          });
        }
        Object.keys(this.form.project).forEach( k => {
          this.form.project[k] = ''
        })
        console.log(useProject.all());
        this.$bvModal.hide('new-project-modal');
        this.initializeFormValues();
    },
    cloneProject(){
      this.form.error = ''
      const contacts = useCollect(usePerson.all()).sortBy('Fullname')
      const tgtContacts = contacts.filter(item => toRaw(item.Projects).includes(this.originalProjectName) )

      const checkProjectNameExists = useProject.where('Name', this.form.project.name).get()
      if(checkProjectNameExists.length > 0){
        this.form.error = 'ERROR: Change project name'
        return false
      }
      this.form.project.id = ''
      const lifecycleId = useLifecycle.where('Name', this.form.project.lifecycle).get()[0]
      //create new project
      useProject.save({
        Name: this.form.project.name,
        Status: this.form.project.status,
        Category: this.form.project.category,
        StartDate: this.form.project.startdate,
        EndDate: this.form.project.enddate,
        LifecycleId: lifecycleId,
        Repos: this.form.project.repos
        });
      //update contacts with new project
      for(const contact of tgtContacts){
        const projects = JSON.parse(JSON.stringify(contact.Projects))
        projects.push(this.form.project.name)
        usePerson.save({
          id: contact.id,
          Projects: projects
        })
      }
      Object.keys(this.form.project).forEach( k => {
        this.form.project[k] = ''
      })
      this.$bvModal.hide('new-project-modal');
      this.initializeFormValues();

      return true;
    }
  }
}
</script>


<style scoped>

</style>