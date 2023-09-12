<template>
    
    <div>
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

</template>



<script>
import {displayStore} from '../main.js';
import {useCollect} from 'pinia-orm/dist/helpers';
import {usePerson, useProject} from '../main.js';

import {testProjects} from '../assets/defaults';




export default {
  name: 'TableProject',
  computed: {
    setViewSelection: () => displayStore.viewSelection,
    projectList: () => useCollect(useProject.all()).sortBy('Name')
  },
  data() {
    return {
      viewSelection:''
    };
  },
  mounted(){
    const env = true
    if(env){
      populateTestData(this.projectList.length)
    }
  },

  methods: {
    clearAll(){
      const ids = usePerson.all().map(item => item.id)
      console.log(ids)
      usePerson.destroy(ids)
    },
    removeProject(project){
      useProject.destroy(project.id)
    }
  },
};



function populateTestData(projectCount){
// Populate tables with test data
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
}


</script>