<template>
<!--
<b-button 
              id='btnNewLifecycle'
              v-b-modal.new-lifecycle-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-lifecycle-modal')"
              >New Lifecycle
            </b-button>
-->
    <div>
        <b-modal 
          id="new-lifecycle-modal"
          size="xl"
          >
        <template #modal-title>
            New Lifecycle
        </template>
        
        <div>
          <b-form>
            <b-card bg-variant="light">
              <!--
              <b-form-group
                label-cols-lg="3"
                label="New Lifecycle"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >-->
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
                  label="Duration (business days):"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.lifecycle.step.duration"></b-form-input>
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
                <div v-if="this.form.lifecycle.step.inSteps">
                  <b-button @click="updateLifecycleStep" v-b-modal.modal-close_visit class="btn-sm m-1" >Update Step</b-button>
                </div>

                </b-form-group>
                </b-card>
              
                <b-form-group
                  label="Steps:"
                  label-for="nested-city"
                  label-cols-sm="3"
                  label-align-sm="left"
                >
                  <!--{{form.lifecycle.steps}}-->
                  <b-table 
                      striped hover small
                      selectable
                      select-mode="single"
                      :items="form.lifecycle.steps"
                      :fields="form.lifecycle.displayStepsTableFields"

                      primary-key='id'
                      responsive="sm" sticky-header="1000px"
                      bordered
                      thead-class="tableHead bg-dark text-white"
                      @row-clicked="editStep" 
                    >
                  </b-table>

                </b-form-group>
              
            <!--</b-form-group>-->
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addLifecycle" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update Lifecycle</b-button>
        </template>
        </b-modal>
    </div>

</template>

<script>
import {useCollect} from 'pinia-orm/dist/helpers';
import {useDisplayStore} from '@/main.js';
import {useLifecycle} from '@/main.js';
import {LifecycleStep} from '../stores/Lifecycle';



export default {
  name: 'ModalLifecycle',
  props:['item'],
  watch: { 
      item: {
          handler: function(newItem, oldVal) {
            const lifecycle = JSON.parse(JSON.stringify(this.$props.item));
            this.form.lifecycle.id = lifecycle.id;
            this.form.lifecycle.name = lifecycle.Name;
            const newSteps = [];
            for(const step of lifecycle.LifecycleStep){
              const newStep = {
                id: step.id,
                name: step.Name,
                order: step.Order,
                duration: step.DurationBizDays,
                placeholder: step.Placeholder,
                emailForm: step.EmailForm
              }
              newSteps.push(newStep);
            }
            this.form.lifecycle = {...this.form.lifecycle, steps: newSteps};

            this.$bvModal.show('new-lifecycle-modal');
            },
            deep: true
          }
  },
  data(){
    return{/*
      selectedItem: "-",
      options: [
        {value: '1', text: 'Lifecycle', path:'Lifecycle'},
        {value: '2', text: 'Project', path:'Project'},
        {value: '3', text: 'Contact', path:'Contact'},
      ],*/
      form:{
        error:'',
        lifecycle:{
          id:'',
          name:'',
          step:{
            inSteps:'',
            id:'',
            name:'',
            order:'',
            duration:0,
            placeholder:'',
            emailForm:''
          },
          steps:[],
          //displaySteps:[],
          displayStepsTableFields: tableFields
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
    availableStatusList: () => useDisplayStore.project.availableStatus,
    lifecycleListName: () => useCollect(useLifecycle.all()).sortBy('Name').map(item => item.Name),
    /*
    checkStepInSteps: () => {
      if(this){
        const stepIds = this.form.lifecycle.steps.map(step => step.id)
        const idx = stepIds.indexOf(this.form.lifecycle.step.id)
        return idx == -1 ? false : true
      }
      else{
        return false
      }
    }*/
  },
  methods:{
    initializeStepValues(){
      this.form.lifecycle.step.inSteps = false
      this.form.lifecycle.step.id = ''
      this.form.lifecycle.step.name = ''
      this.form.lifecycle.step.order = ''
      this.form.lifecycle.step.duration = ''
      this.form.lifecycle.step.placeholder = ''
      this.form.lifecycle.step.emailForm = ''
    },
    initializeFormValues(){
      this.form.error = ''
      this.form.lifecycle.id = ''
      this.form.lifecycle.name = ''
      //this.form.lifecycle.steps.length = 0
      this.form.lifecycle = {...this.form.lifecycle, steps: []};
      this.initializeStepValues()
    },
    editStep(row){
      this.form.lifecycle.step.inSteps = true

      this.form.lifecycle.step.id = row.id
      this.form.lifecycle.step.name = row.name
      this.form.lifecycle.step.order = row.order
      this.form.lifecycle.step.duration = row.duration
      this.form.lifecycle.step.placeholder = row.placeholder
      this.form.lifecycle.step.emailForm = row.emailForm
    },
    /*
    changeItem(option){
      this.selectedItem = option.text
      useDisplayStore.viewSelection = option.text
      console.log(useDisplayStore)
    },*/
    addLifecycle(){
      //prepare data
      const LifecycleSteps = []
        for(const step of this.form.lifecycle.steps){
          const newStep = {
            id: step.id,
            LifecycleId: this.form.lifecycle.id,
            Name: step.name,
            DurationBizDays: parseInt(step.duration),
            Order: parseInt(step.order),
            Placeholder: [step.placeholder],
            EmailForm: step.emailForm
            }
          LifecycleSteps.push(newStep)
        }
      //check if currently in lc list
      const lifecycleIds = useCollect(useLifecycle.all()).sortBy('id').map(item => item.id)
      const checkId = lifecycleIds.includes(this.form.lifecycle.id)
      //update existing
      if(checkId){
        useLifecycle.save({
          id: this.form.lifecycle.id,
          Name: this.form.lifecycle.name,
          LifecycleStep: LifecycleSteps
        });
      }else{
      //add new
        useLifecycle.save({
          Name: this.form.lifecycle.name,
          LifecycleStep: LifecycleSteps
        });
      }
      this.initializeFormValues();
      this.$bvModal.hide('new-lifecycle-modal')
    },
    addLifecycleStep(){
      const Step = new LifecycleStep({
      //const step = {
        LifecycleId: this.form.lifecycle.id,
        Name: this.form.lifecycle.step.name,
        Order: parseInt(this.form.lifecycle.step.order),
        DurationBizDays: parseInt(this.form.lifecycle.step.duration),
        Placeholder: [this.form.lifecycle.step.placeholder],
        EmailForm: this.form.lifecycle.step.emailForm,
      })
      const step = {
        id: Step.id, 
        name: Step.Name, 
        order: Step.Order, 
        duration: Step.DurationBizDays, 
        placeholder: Step.Placeholder, 
        emailForm: Step.EmailForm
      }
      this.form.lifecycle.steps.push(JSON.parse(JSON.stringify(step)) )
      //this.initializeStepValues()
    },
    updateLifecycleStep(){
      const stepIds = this.form.lifecycle.steps.map(step => step.id)
      const idx = stepIds.indexOf(this.form.lifecycle.step.id)
      if(idx!=-1){
        this.form.lifecycle.steps[idx].name = this.form.lifecycle.step.name
        this.form.lifecycle.steps[idx].order = this.form.lifecycle.step.order
        this.form.lifecycle.steps[idx].duration = this.form.lifecycle.step.duration
        this.form.lifecycle.steps[idx].placeholder = this.form.lifecycle.step.placeholder
        this.form.lifecycle.steps[idx].emailForm = this.form.lifecycle.step.emailForm
        
        this.form.lifecycle.step.inSteps = ''
        this.form.lifecycle.step.id = ''
        this.form.lifecycle.step.name = ''
        this.form.lifecycle.step.order = ''
        this.form.lifecycle.step.duration = ''
        this.form.lifecycle.step.placeholder = ''
        this.form.lifecycle.step.emailForm = ''
      }else{
        console.log(`ERROR: step ${idx} not currently in current lifecycle steps`)
      }
    }
  }
}


const tableFields = [{
        key: 'order',
        label: 'Id',
    }, {
        key: 'name',
        label: 'Name',
    }, {
        key: 'duration',
        lable: 'Duration'
    }, {
        key: 'emailForm',
        label: 'Email Form'
    }, 
  ]


</script>


<style scoped>

</style>