<template>
    
    <div>
      <b-table 
        striped hover small
        selectable
        select-mode="single"
        :items="projectList"
        :fields="fields"

        primary-key='id'
        responsive="sm" sticky-header="1000px"
        bordered
        thead-class="tableHead bg-dark text-white"
        @row-selected="selectRow"  
      >
    </b-table>
    </div>

</template>



<script>
import {displayStore} from '../main.js';
import {useCollect} from 'pinia-orm/dist/helpers';
import {usePerson, useProject} from '../main.js';

import {testProjects} from '../assets/defaults';




export default {
  name: 'TableProject',
  data() {
    return {
      viewSelection:'',
      fields: fields
    };
  },
  mounted(){
    const env = true
    if(env){
      populateTestData(this.projectList.length)
    }
  },
  computed: {
    setViewSelection: () => displayStore.viewSelection,
    projectList: () => useCollect(useProject.all()).sortBy('Name')
  },
  methods: {
    selectRow(rows){
      const prj = JSON.parse(JSON.stringify(rows))[0]
      if(prj){
        displayStore.projectSelection = prj
      } else {
        displayStore.projectSelection = {}
      }
      console.log(rows)
    },
    clearAll(){
      const ids = usePerson.all().map(item => item.id)
      console.log(ids)
      usePerson.destroy(ids)
    },
    removeProject(project){
      useProject.destroy(project.id)
    },
    formatDateAssigned(value) {
      const dt = value.toDateString()
      return dt
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


// Table data items
const fields = [{
        key: 'Name',
        label: 'Name',
        sortable: true
    }, {
        key: 'Status',
        label: 'Status',
        sortable: true
    }, {
        key: 'Category',
        label: 'Category',
        sortable: true,
    }, {
        key: 'StartDate',
        label: 'Start Date',
        sortable: true,
        formatter: "formatDateAssigned"
    }, {
        key: 'EndDate',
        label: 'End Date',
        sortable: true,
        formatter: "formatDateAssigned"
    }, {
        key: 'Lifecycle',
        label: 'Lifecycle',
        sortable: true,
    }]





</script>