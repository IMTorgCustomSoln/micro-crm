<template>
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Fullname</th>
              <th>Title</th>
              <th>Email</th>
              <th>Number</th>
              <th>Office</th>
              <th>Firm</th>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, key) in contact_list">
              <td>{{ contact.Fullname }}</td>
              <td>{{ contact.Title }}</td>
              <td>{{ contact.Email }}</td>
              <td>{{ contact.Number }}</td>
              <td>{{ contact.Office }}</td>
              <td>{{ contact.Firm }}</td>
              <td>{{ contact.Projects }}</td>
            </tr>
          </tbody>
  </table>
      </div>
</template>



<script>
  import { useCollect } from 'pinia-orm/dist/helpers';
  import {usePerson} from '../main.js';


 

  export default {
    name: 'ContactsTable',
    computed: {
      contact_list: () => useCollect(usePerson.all()).sortBy('Fullname')
    },
    data() {
      return {
        /*
        form: {
          username: "",
          fullname: "",
          age: "",
          email: "",
        },*/
      };
    },
    
    mounted(){
      for(const contact of testContacts){
        usePerson.save(contact);
      }
      //this.syncData()
      //this.clearAll()
    },

    methods: {
      /*
      syncData(){
        //TODO: is this needed???
        const savedData = JSON.parse(localStorage.Person).data
        for(let key in savedData){
          let item = savedData[key]
          usePerson.save({
            Username: item.Username,
            Fullname: item.Fullname,
            Age: item.Age,
            Email: item.Email
          })
        }
        console.log(usePerson.all());
      },
      addcontact() {
        usePerson.save({
          Username: this.form.username,
          Fullname: this.form.fullname,
          Age: this.form.age,
          Email: this.form.email,
        });
        console.log(usePerson.all());
      },*/
      clearAll(){
        const ids = usePerson.all().map(item => item.id)
        console.log(ids)
        usePerson.destroy(ids)
      }
    },
};

const testContacts = [
      {
          Fullname: 'Jane Doe',
          Title:'Ms',
          Email:'',
          Number:'',
          Office:'',
          Firm:'',
          Projects:'',
        },
        {
          Fullname: 'John Smith',
          Title:'Mr',
          Email:'',
          Number:'',
          Office:'',
          Firm:'',
          Projects:'',
        }
      ]
</script>