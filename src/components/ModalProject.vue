<template>

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
                  <b-form-input id="nested-state" v-model="form.project.category" list="category-list"></b-form-input>
                  <datalist id="category-list">
                    <option v-for="category in availableCategoryList" :key="category.id">{{ category }}</option>
                  </datalist>
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
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-form-select id="mySelect2" v-model="form.project.lifecycle" :options="lifecycleList"/>
                </b-form-group>
              
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addProject" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update Project</b-button>
        </template>
    </b-modal>

</template>

<script>
import { toRaw } from 'vue';
import {useDisplayStore} from '@/main.js';
import {useProject, useLifecycle} from '@/main.js';
import { useCollect } from 'pinia-orm/dist/helpers';


export default {
  name: 'ModalProject',
  props:['item'],
  watch: { 
      item: {
          handler: function(newItem, oldVal) {
            const prj = JSON.parse(JSON.stringify(this.$props.item))
            this.form.project.id = prj.id;
            this.form.project.name = prj.Name;
            this.form.project.status = prj.Status;
            this.form.project.category = prj.Category;
            this.form.project.startdate = prj.StartDate;
            this.form.project.enddate = prj.EndDate;
            this.form.project.lifecycle = prj.Lifecycle;
            this.$bvModal.show('new-project-modal')
            },
            deep: true
          }
  },
  data(){
    return{
      selectedItem: useDisplayStore.viewSelection,
      form:{
        project:{
          id:'',
          name:'',
          category: '',
          status: '',
          startdate: '',
          enddate:'',
          lifecycle: ''
        },
      }
    }
  },
  mounted(){
    this.initializeFormValues()
  },
  computed:{
    availableCategoryList: () => {
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
    },
    addProject() {
      const projectIds = useCollect(useProject.all()).sortBy('id').map(item => item.id)
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
          Lifecycle: this.form.project.lifecycle
        });
      } else {
        //create new
        useProject.save({
          Name: this.form.project.name,
          Status: this.form.project.status,
          Category: this.form.project.category,
          StartDate: this.form.project.startdate,
          EndDate: this.form.project.enddate,
          Lifecycle: this.form.project.lifecycle
          });
        }
        Object.keys(this.form.project).forEach( k => {
          this.form.project[k] = ''
        })
        console.log(useProject.all());
        this.$bvModal.hide('new-project-modal');
        this.initializeFormValues();
    },
    }
}
</script>


<style scoped>

</style>