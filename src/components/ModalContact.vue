<template>
    <b-button 
      id='btnNewContact'
      v-b-modal.new-contact-modal
      size="sm" 
      class="my-2 my-sm-0" 
      type="button"
      @click="$bvModal.show('new-contact-modal')"
      >
      New {{ selectedItem }}
    </b-button>



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
                  <b-button @click="addContact" v-b-modal.modal-close_visit class="btn-sm m-1" >Add Contact</b-button>
                  <!--<b-button @click="processData" v-b-modal.modal-close_visit class="btn-sm m-1" >Process Data</b-button>-->
              </template>

        </b-modal>
    </div>

</template>

<script>
//import {useCollect} from 'pinia-orm/dist/helpers';
import {displayStore} from '../main.js';
import {usePerson, useProject, useLifecycle} from '@/main.js';
//import { LifecycleStep } from '../stores/Lifecycle';
//import {availableStatus} from '../stores/Project';


export default {
  name: 'ModalContact',
  computed:{
    //availableStatusList: () => availableStatus,
    //lifecycleListName: () => useCollect(useLifecycle.all()).sortBy('Name').map(item => item.Name)
  },
  data(){
    return{
      selectedItem: displayStore.viewSelection,
      form:{
        contact:{
          fullname:'',
          title:'',
          email:'',
          number:'',
          office:'',
          firm:'',
          projects:''
        }
      }
    }
  },
  methods:{/*
    changeItem(option){
      this.selectedItem = displayStore.viewSelection
      console.log(displayStore)
    },*/
    addContact() {
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
    }
  }
}
</script>


<style scoped>

</style>