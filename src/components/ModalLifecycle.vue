<template>

<b-button 
              id='btnNewLifecycle'
              v-b-modal.new-lifecycle-modal
              size="sm" 
              class="my-2 my-sm-0" 
              type="button"
              @click="$bvModal.show('new-lifecycle-modal')"
              >New Lifecycle
            </b-button>

    <div>
        <b-modal 
          id="new-lifecycle-modal"
          size="lg" 
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
              
            <!--</b-form-group>-->
          </b-card>
          </b-form>
          </div>

          <template #modal-footer>
                <b-button @click="addLifecycle" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Lifecycle</b-button>
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
  computed:{
    availableStatusList: () => useDisplayStore.project.availableStatus,
    lifecycleListName: () => useCollect(useLifecycle.all()).sortBy('Name').map(item => item.Name)
  },
  data(){
    return{
      selectedItem: "-",
      options: [
        {value: '1', text: 'Lifecycle', path:'Lifecycle'},
        {value: '2', text: 'Project', path:'Project'},
        {value: '3', text: 'Contact', path:'Contact'},
      ],
      form:{
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
      useDisplayStore.viewSelection = option.text
      console.log(useDisplayStore)
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

</style>