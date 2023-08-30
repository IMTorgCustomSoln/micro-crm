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
          <b-button 
            id='btnNewContact'
            v-b-modal.new-contacts-modal
            size="sm" 
            class="my-2 my-sm-0" 
            type="button"
            @click="$bvModal.show('new-contacts-modal')"
            >New {{ selectedItem }}
          </b-button>
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
        <!-- modal -->
        <b-modal 
          id="new-contacts-modal" 
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
                  <b-form-input id="nested-street" v-model="form.fullname"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Title:"
                  label-for="nested-city"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-city" v-model="form.title"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Email:"
                  label-for="nested-state"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-state" v-model="form.email"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Number:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.number"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Office:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.office"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Firm:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.firme"></b-form-input>
                </b-form-group>
              
                <b-form-group
                  label="Projects:"
                  label-for="nested-country"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-country" v-model="form.projects"></b-form-input>
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
  </div>
</div>
</template>

<script>
import {displayStore} from '../main.js';
import {usePerson} from '../main.js';

import WorkSessionIO from './WorkSessionIO.vue';


export default {
  name: 'NavBar',
  components:{
    WorkSessionIO
  },
  data(){
    return{
      selectedItem: "-",
      options: [
        {value: '1', text: 'Customer Lifecycle'},
        {value: '2', text: 'Project Portfolio'},
        {value: '3', text: 'Contact'},
      ],
      form:{
        fullname:'',
        title:'',
        email:'',
        number:'',
        office:'',
        firm:'',
        projects:''
      }
    }
  },
  methods:{
    changeItem(option){
      this.selectedItem = option.text
      displayStore.viewSelection = option
      console.log(displayStore)
    },
    addPerson() {
        usePerson.save({
          Fullname: this.form.fullname,
          Title: this.form.title,
          Email: this.form.email,
          Number: this.form.number,
          Office: this.form.office,
          Firm: this.form.firm,
          Projects: this.form.projects,
        });
        Object.keys(this.form).forEach( k => {
          this.form[k] = ''
        })
        console.log(usePerson.all());
    }
  }
}
</script>


<style scoped>
.navbar{
    margin-bottom: 10px;
}

</style>