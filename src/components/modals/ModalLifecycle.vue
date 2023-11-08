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
                  <b-form-input id="nested-state" 
                    v-model="form.lifecycle.step.placeholder" 
                    list="placeholder-list"
                    >
                  </b-form-input>
                    <b-button @click="addToPlaceholders">Add</b-button>
                  <datalist id="placeholder-list">
                    <option v-for="placeholder in availablePlaceholderList" :key="placeholder.id">{{ placeholder }}</option>
                  </datalist>
                  <div id="placeholders">
                    <div v-for="placeholder in this.form.lifecycle.displayPlaceholders" :key="placeholder.id">
                      <b-button @click="addPlaceholderToText($event)" class="btn-sm m-1">{{ placeholder }}</b-button>
                    </div>
                  </div>
                </b-form-group>
                <b-form-group
                  label="Email Template:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-form-textarea
                  id="textarea"
                  ref="ta"
                  v-model="form.lifecycle.step.emailForm"
                  placeholder="Enter something..."
                  rows="5"
                  max-rows="10"
                ></b-form-textarea>
                <!--
                  <b-form-input id="nested-street" v-model="form.lifecycle.step.emailForm"></b-form-input>-->
                </b-form-group>
                <b-button-group>
                <b-button @click="addLifecycleStep" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Step</b-button>
                <b-button @click="initializeStepValues" v-b-modal.modal-close_visit class="btn-sm m-1" >Clear Form Data</b-button>
                <div v-if="this.form.lifecycle.step.inSteps">
                  <b-button @click="updateLifecycleStep" v-b-modal.modal-close_visit class="btn-sm m-1" >Update Step</b-button>
                  <!--
                  <b-button @click="deleteLifecycleStep" v-b-modal.modal-close_visit class="btn-sm m-1" >Delete Step</b-button>
                  -->
                </div>
              </b-button-group>

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
                    <template #cell(actions)="row">
                      <span>
                        <b-btn size="sm" @click="deleteItem(row)">Delete</b-btn>
                      </span>
                    </template>
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
import toRaw from 'vue';
import {useCollect} from 'pinia-orm/dist/helpers';
import {useDisplayStore} from '@/main.js';
import {useLifecycle, useLifecycleStep} from '@/main.js';

import {Account} from '@/stores/Account';
import {Person} from '@/stores/Person';
import {Project} from '@/stores/Project';
import {LifecycleStep} from '@/stores/Lifecycle';



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
                placeholders: step.Placeholder,
                emailForm: step.EmailForm
              }
              newSteps.push(newStep);
            }
            this.form.lifecycle = {...this.form.lifecycle, steps: newSteps};
            this.initializeStepValues()
            this.$bvModal.show('new-lifecycle-modal');
            },
            deep: true
          }
  },
  data(){
    return{
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
            placeholders:[],
            emailForm:''
          },
          steps:[],
          displaySteps:[],
          displayPlaceholders:[],
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
    availablePlaceholderList: ()=>{
      const REMOVE = ['id','meta']
      const account = {type:'Account', obj: new Account()}
      const person = {type:'Contact', obj: new Person()}
      const project = {type:'Product', obj: new Project()}
      const objects = [account, person, project]

      const resultKeys = []
      for(let {type, obj} of objects){
        let attrs = Object.keys(obj)
        for(const attr of attrs){
          const check = REMOVE.every(item => !attr.includes(item))
          if(check){
            const name = `${type}_${attr}`.toUpperCase()
            resultKeys.push(name)
          }
        }
      }
      return resultKeys
    }
  },
  methods:{
    addToPlaceholders(){
      const place = JSON.parse(JSON.stringify(this.form.lifecycle.step.placeholder))
      const placeholders = JSON.parse(JSON.stringify(this.form.lifecycle.step.placeholders))
      if(place!='' && !placeholders.includes(place)){
        this.form.lifecycle.step.placeholders.push(place)
        const html = `<${place.toUpperCase()}>`
        this.form.lifecycle.displayPlaceholders.push(html)
      }
      this.form.lifecycle.step.placeholder = ''
    },
    addPlaceholderToText(event){
      const innerText = event.target.innerText
      const pos1 = this.$refs.ta.$el.selectionStart
      const newText = this.form.lifecycle.step.emailForm.substring(0,pos1) + innerText + this.form.lifecycle.step.emailForm.substring(pos1)
      this.form.lifecycle.step.emailForm = newText
    },
    initializeStepValues(){
      this.form.lifecycle.step.inSteps = false
      this.form.lifecycle.step.id = '';
      this.form.lifecycle.step.name = '';
      this.form.lifecycle.step.order = '';
      this.form.lifecycle.step.duration = '';
      this.form.lifecycle.step.placeholder = '';
      this.form.lifecycle.step = {...this.form.lifecycle.step, placeholders: []};
      this.form.lifecycle.step.emailForm = '';
      this.form.lifecycle = {...this.form.lifecycle, displayPlaceholders: []};
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
      this.form.lifecycle.step.placeholder = '';
      this.form.lifecycle.step = {...this.form.lifecycle.step, placeholders: row.placeholders};
      this.form.lifecycle.step.emailForm = row.emailForm

      this.form.lifecycle = {...this.form.lifecycle, displayPlaceholders: []};
      for(const place of row.placeholders){
        const html = `${place.toUpperCase()}`
        this.form.lifecycle.displayPlaceholders.push(html)
      }
    },
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
            Placeholder: step.placeholders,
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
        Placeholder: this.form.lifecycle.step.placeholders,
        EmailForm: this.form.lifecycle.step.emailForm,
      })
      const step = {
        id: Step.id, 
        name: Step.Name, 
        order: Step.Order, 
        duration: Step.DurationBizDays, 
        placeholders: JSON.parse(Step.Placeholder), 
        emailForm: Step.EmailForm
      }
      const arrSteps = JSON.parse(JSON.stringify(this.form.lifecycle.steps))
      const sortedArray = sortSteps(arrSteps, 'order')
      const orderedArray = addStepToArray(sortedArray, step )
      this.form.lifecycle = {...this.form.lifecycle, steps: orderedArray}
      this.initializeStepValues()
    },
    updateLifecycleStep(){
      const stepIds = this.form.lifecycle.steps.map(step => step.id)
      const idx = stepIds.indexOf(this.form.lifecycle.step.id)
      if(idx!=-1){
        this.form.lifecycle.steps[idx].name = this.form.lifecycle.step.name
        this.form.lifecycle.steps[idx].order = this.form.lifecycle.step.order
        this.form.lifecycle.steps[idx].duration = this.form.lifecycle.step.duration
        this.form.lifecycle.steps[idx].placeholder = this.form.lifecycle.step.placeholder
        this.form.lifecycle.steps[idx] = {...this.form.lifecycle.steps[idx], placeholders: this.form.lifecycle.step.placeholders}
        this.form.lifecycle.steps[idx].emailForm = this.form.lifecycle.step.emailForm
       this.initializeStepValues()
      }else{
        console.log(`ERROR: step ${idx} not currently in current lifecycle steps`)
      }
    },/*
    deleteLifecycleStep(){
      const stepIds = this.form.lifecycle.steps.map(step => step.id)
      const idx = stepIds.indexOf(this.form.lifecycle.step.id)
      if(idx!=-1){
        this.form.lifecycle.steps.splice(idx, 1)
        const newSteps = sortSteps(this.form.lifecycle.steps, 'order')
        this.form.lifecycle = {...this.form.lifecycle, steps: newSteps}
        useLifecycleStep.destroy(this.form.lifecycle.step.id)
        this.initializeStepValues()
      }else{
        console.log(`ERROR: step ${idx} not currently in current lifecycle steps`)
      }
    },*/
    deleteItem(row){
      const step = JSON.parse(JSON.stringify(row))['item']
      const stepIds = this.form.lifecycle.steps.map(step => step.id)
      const idx = stepIds.indexOf(step.id)
      if(idx!=-1){
        this.form.lifecycle.steps.splice(idx, 1)
        const newSteps = sortSteps(this.form.lifecycle.steps, 'order')
        this.form.lifecycle = {...this.form.lifecycle, steps: newSteps}
        useLifecycleStep.destroy(step.id)
        this.initializeStepValues()
      }else{
        console.log(`ERROR: step ${idx} not currently in current lifecycle steps`)
      }
    }
  }
}


const tableFields = [{
        key: 'order',
        label: 'Order',
    }, {
        key: 'name',
        label: 'Name',
    }, {
        key: 'duration',
        lable: 'Duration'
    }, {
        key: 'emailForm',
        label: 'Email Form'
    }, {
        key: 'actions',
        label: 'Actions'
    }
]



function sortSteps(arrSteps, key){
  //Sort array of steps by their order
  const newArray = arrSteps.sort((a,b) => a[key]- b[key])
  newArray.forEach((part,idx,arr)=>{
    arr[idx][key] = idx
  })
  return newArray
}


function addStepToArray(arrSteps, step){
  //add step to correct location
  let result = []
  if(arrSteps.length <= step.order){
    step.order = arrSteps.length
    arrSteps.push(step)
    result = arrSteps
  } else if (arrSteps.length > step.order & step.order == 0){
    result.push(step)
    result.push(...arrSteps)
  } else {
    result = arrSteps.slice(0, step.order)
    result.push(step)
    const last = arrSteps.slice(step.order, arrSteps.length+1)
    result.push(...last)
  }
  //reorder remaining steps
  result.forEach(function(part, index, theArray) {
    theArray[index].order = index;
  })
  return result
}



</script>


<style scoped>

</style>