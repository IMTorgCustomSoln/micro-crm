<template>
      <div v-if="setViewSelection=='Contact'">
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
            <tr v-for="(contact, key) in contactList">
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

      <div v-else-if="setViewSelection=='Project'">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Lifecycle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, key) in projectList">
              <td>{{ project.Name }}</td>
              <td>{{ project.Status }}</td>
              <td>{{ project.Category }}</td>
              <td>{{ project.StartDate }}</td>
              <td>{{ project.EndDate }}</td>
              <td>{{ project.Lifecycle }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="setViewSelection=='Lifecycle'">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Steps</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plan, key) in lifecycleList">
              <td>{{ plan.Name }}</td>
              <td>{{ plan.Steps }}</td>
            </tr>
          </tbody>
        </table>
      </div>
</template>



<script>
  import {displayStore} from '../main.js';
  import {useCollect} from 'pinia-orm/dist/helpers';
  import {usePerson, useProject, useLifecycle} from '../main.js';



 

  export default {
    name: 'ContactsTable',
    computed: {
      setViewSelection: () => displayStore.viewSelection,
      contactList: () => useCollect(usePerson.all()).sortBy('Fullname'),
      projectList: () => useCollect(useProject.all()).sortBy('Name'),
      lifecycleList: () => useCollect(useLifecycle.all()).sortBy('Name'),
    },
    data() {
      return {
        viewSelection:''
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

const testProjects = [
  {
    name:'',
    status:'',
    category:'',
    startdate:'',
    enddate:'',
    lifecycle:''
  }
]

const testLifecycle = [
  {
    name:'',
    steps:''
  }
]



</script>