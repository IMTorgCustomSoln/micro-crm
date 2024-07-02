<template>
  
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
                  label="Referred to you by:"
                  label-for="nested-city"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-select id="nested-state" v-model="form.contact.referredBy" :options="availableRefByList"/>
                  <!-- // TODO:original stopped working, either use -select or -input
                    // ref-input: https://bootstrap-vue.org/docs/components/form#datalist-helper
                    // ref-select: https://bootstrap-vue.org/docs/components/form-select/
                    //
                    <b-form-datalist id="person-list" :options="availablePersonList">
                    <option v-for="person in availablePersonList" :key="person.id">{{ person.Fullname }}</option>
                    </b-form-datalist>-->
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
                  <b-form-input id="nested-country" v-model="form.contact.firm"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Projects: (multiple allowed with `Shift+click`)"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-select id="nested-country" v-model="form.contact.projects"  multiple :options="projectList"/>
                </b-form-group>
              
            <!--</b-form-group>-->
          </b-card>
          </b-form>
          </div>

            <template #modal-footer>
                  <b-button @click="addOrUpdateContact" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update Contact</b-button>
                  <!--<b-button @click="processData" v-b-modal.modal-close_visit class="btn-sm m-1" >Process Data</b-button>-->
              </template>

        </b-modal>
    </div>

</template>

<script>
import { arraysEqual, getRightSetDifferenceOfArrays } from '@/assets/utils';
import {useDisplayStore, useLifecycle} from '@/main.js';
import {usePerson, useProject, usePersonProject} from '@/main.js';
import { useCollect } from 'pinia-orm/dist/helpers';


export default {
  name: 'ModalContact',
  props:['item'],     //TODO: remember to use raw data when needed
  watch: { 
      item: {
          handler: function(newItem, oldVal) {
            const contact = JSON.parse(JSON.stringify(this.$props.item));
            this.form.contact.id = contact.id;
            this.form.contact.fullname = contact.Fullname;
            //TODO: how to assign a different reference to each project???
            if(contact.ReferredByList){
              if(contact.ReferredByList.length==1){
                this.form.contact.referredBy = contact.ReferredByList[0].Fullname;
              }else{
                this.error.multipleRefBys.display = true
                this.form.contact.referredBy = this.error.multipleRefBys.text
              }
            }
            this.form.contact.title = contact.Title;
            this.form.contact.email = contact.Email;
            this.form.contact.number = contact.Number;
            this.form.contact.office = contact.Office;
            this.form.contact.firm = contact.Firm;
            if(contact.Projects){
              const projects = contact.Projects.map(item => item.Project.Name)
              if(projects){
                this.form.contact = {...this.form.contact, projects: projects};
              }
            }
            this.$bvModal.show('new-lifecycle-modal');
            },
            deep: true
          }
  },
  data(){
    return{
      selectedItem: useDisplayStore.viewSelection,
      error:{
        multipleRefBys: {
          'display':false, 
          'text':'cannot display bc multiple names'
        }
      },
      form:{
        contact:{
          id: '',
          fullname:'',
          referredBy:'',
          title:'',
          email:'',
          number:'',
          office:'',
          firm:'',
          projects:[]
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
    selectedProjects(){
      return useDisplayStore.projectSelection
    },
    projectList(){
      return useProject.all().map(item=>item.Name)
    },
    availableRefByList(){
      if(this.error.multipleRefBys.display){
        return this.error.multipleRefBys.text
      }else{
        return usePerson.all().map(item => item.Fullname)
      }
    },
  },
  methods:{
    initializeFormValues(){
      this.form.contact.id = '';
      this.form.contact.fullname = '';
      this.form.contact.referredBy = '';
      this.form.contact.title = '';
      this.form.contact.email = '';
      this.form.contact.number = '';
      this.form.contact.office = '';
      this.form.contact.firm = '';
      this.form.contact = {...this.form.contact, projects: []};
      this.error.multipleRefBys.display = false
    },
    addOrUpdateContact() {
      /* Add or update Contact (tbl Person)

      note: Person table has dependency
          PersonProject: this.hasMany(PersonProject, 'PersonId'),   //insert with `ReferredBy` for selected Project
        so it must be saved with its PersonProjectId(s)
      */
      const editedRow = JSON.parse(JSON.stringify(this.$props.item))
      const personProjects = []
      //check for new projects by removing previous (from edited row) projects
      let currenProjectIds = []
      if(editedRow.Projects != undefined){
        currenProjectIds = editedRow.Projects.map(item => item.Project.id)
      }
      const newlyAddedProjectIds = useProject.withAll()
                                    .where('Name', this.form.contact.projects)
                                    .get()
                                    .map(item => item.id)
      const newProjectIds = getRightSetDifferenceOfArrays(newlyAddedProjectIds, currenProjectIds)
      //new projects
      for(const newProjectId of newProjectIds){
        const project = useProject.find(newProjectId)
        const initialStepId = useLifecycle.withAll()
                              .find(project.LifecycleId)
                              .lifecycleFull
                              .LifecycleStep[0].id
        const initialStep = {
          LifecycleStepId: initialStepId,
          CompletionDate: useDisplayStore.todaysDate
        }
        const refId = usePerson.withAll().get().filter(item => item.Fullname == this.form.contact.referredBy)[0]
        const personProject = {
          ProjectId: project.id,
          RefId: refId.id,
          StepStatus: [initialStep]
        }
        personProjects.push(personProject)
      }
      //existing projects
      const existingProjects = usePersonProject.withAll()
                                .where('PersonId', this.form.contact.id)
                                .where('ProjectId', currenProjectIds)
                                .get()
      personProjects.push(...existingProjects)
      //check if new user
      const personIds = useCollect(usePerson.all()).sortBy('id').map(item => item.id)
      const checkId = personIds.includes(this.form.contact.id)
      //save
      if(checkId){
        usePerson.save({
          id: this.form.contact.id,
          Fullname: this.form.contact.fullname,
          //ReferredBy: this.form.contact.referredBy,
          Title: this.form.contact.title,
          Email: this.form.contact.email,
          Number: this.form.contact.number,
          Office: this.form.contact.office,
          Firm: this.form.contact.firm,
          PersonProject: personProjects
        })
      }else{
        usePerson.save({
          Fullname: this.form.contact.fullname,
          //ReferredBy: this.form.contact.referredBy,
          Title: this.form.contact.title,
          Email: this.form.contact.email,
          Number: this.form.contact.number,
          Office: this.form.contact.office,
          Firm: this.form.contact.firm,
          PersonProject: personProjects
        })
      }
      //clean-up
      this.initializeFormValues();
      this.$bvModal.hide('new-contact-modal');
    }
  }
}
</script>


<style scoped>

</style>