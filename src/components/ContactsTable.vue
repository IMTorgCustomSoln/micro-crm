<template>
      <div v-if="setViewSelection=='Contact'">
        <table class="table table-striped">
          <thead>
            <tr>
              <th></th>
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
            <tr v-for="(contact, index) in contactList" :key="contact.id">
              <td> <b-icon-x-square class="h5 mb-1 destroy" font-scale="0.5" @click="removeContact(contact)" /> {{ index }}</td>
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
              <th></th>
              <th>Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Lifecycle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, index) in projectList" :key="project.id">
              <td> <b-icon-x-square class="h5 mb-1 destroy" font-scale="0.5" @click="removeProject(project)" /> {{ index }}</td>
              <td>{{ project.Name }}</td>
              <td>{{ project.Status }}</td>
              <td>{{ project.Category }}</td>
              <td>{{ project.StartDate.toDateString() }}</td>
              <td>{{ project.EndDate.toDateString() }}</td>
              <td>{{ project.Lifecycle }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="setViewSelection=='Lifecycle'">
        <table class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Project Count</th>
              <th>Steps</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plan, index) in lifecycleList" :key="plan.id">
              <td> <b-icon-x-square class="h5 mb-1 destroy" font-scale="0.5" @click="removePlan(plan)" /> {{ index }}</td>
              <td>{{ plan.Name }}</td>
              <td>{{ plan.Count }}</td>
              <td>{{ plan.LifecycleStep.map(item => item.Name) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
</template>



<script>
  import {displayStore} from '../main.js';
  import {useCollect} from 'pinia-orm/dist/helpers';
  import {usePerson, useProject, useLifecycle} from '../main.js';
  import {groupBy} from '../assets/utils';

  import {testContacts, testProjects} from '../assets/defaults';
  import {testLifecycle} from '../stores/Lifecycle.js';


 

  export default {
    name: 'ContactsTable',
    computed: {
      setViewSelection: () => displayStore.viewSelection,
      contactList: () => useCollect(usePerson.all()).sortBy('Fullname'),
      projectList: () => useCollect(useProject.all()).sortBy('Name'),
      lifecycleList: () => {
        const plans = useLifecycle.with('LifecycleStep').get()
        plans.map(item => {
          item.LifecycleStep = item.LifecycleStep.map(step => {
            return step.parsePlaceholder
          })
        })
        const projects = useCollect(useProject.all()).sortBy('Lifecycle')
        const groupedPlans = groupBy(projects, prj => prj.Lifecycle)
        
        const newPlans = []
        if(plans.length > 0 && projects.length > 0){
          for(let plan of plans){
            let filtered = groupedPlans.get(plan.Name)
            let planCount = 0
            if(filtered){
              planCount = filtered.length
            }
            plan.Count = planCount
            newPlans.push(plan)
            }
          return newPlans
        } else {
          return newPlans
        }
      }
    },
    data() {
      return {
        viewSelection:''
      };
    },
    
    mounted(){
      const env = true
      if(env){
        populateTestData(
          this.contactList.length,
          this.projectList.length,
          this.lifecycleList.length
        )
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
      },
      removeContact(contact){
        usePerson.destroy(contact.id)
      },
      removeProject(project){
        useProject.destroy(project.id)
      },
      removePlan(plan){
        useLifecycle.destroy(plan.id)
      },
    },
};



function populateTestData(contactCount, projectCount, lcplanCount){
  // Populate tables with test data
  if(contactCount == 0){
    for(const contact of testContacts){
      usePerson.save({
            Fullname: contact.Fullname,
            Title: contact.Title,
            Email: contact.Email,
            Number: contact.Number,
            Office: contact.Office,
            Firm: contact.Firm,
            Projects: contact.Projects,
      });
    }
  }
  if(projectCount == 0){
    for(const project of testProjects){
      useProject.save({
          Name: project.Name,
          Status: project.Status,
          Category: project.Category,
          StartDate: project.Startdate,
          EndDate: project.Enddate,
          Lifecycle: project.Lifecycle
        });
    }
  }
  if(lcplanCount == 0){
    for(const plan of testLifecycle){
      useLifecycle.save({
            Name: plan.Name,
            LifecycleStep: plan.LifecycleStep
          });
    }
  } 
}


</script>