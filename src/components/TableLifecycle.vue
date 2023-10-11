<template>

<div>
      <b-table 
        striped hover small
        :items="lifecycleList"
        :fields="fields"

        primary-key='id'
        responsive="sm" sticky-header="1000px"
        bordered
        thead-class="tableHead bg-dark text-white"
      >
      <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="editItem(row)">Edit</b-btn>
          <b-btn size="sm" @click="deleteItem(row)">Delete</b-btn>
        </span>
      </template>
    </b-table>
    <ModalLifecycle :item="form.lifecycle"/>
  </div>

<!--
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
          -->
    
</template>

<script>
import {useCollect} from 'pinia-orm/dist/helpers';
import {usePerson, useProject, useLifecycle} from '../main.js';
import {groupBy} from '../assets/utils';
import {testLifecycle} from '../stores/Lifecycle.js';
import ModalLifecycle from '@/components/ModalLifecycle.vue'


export default {
  name: 'TableLifecycle',
  components:{
    ModalLifecycle
  },
  computed: {
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
      lifecycle:'',
      fields: fields,
      form:{
        lifecycle: {}
      }
      //viewSelection:''
    };
  },
  
  created(){
    /*
    const env = true
    if(env){
      populateTestData(this.lifecycleList.length)
    }*/
  },
  methods: {
    clearAll(){
      const ids = usePerson.all().map(item => item.id)
      console.log(ids)
      usePerson.destroy(ids)
    },
    removePlan(plan){
      useLifecycle.destroy(plan.id)
    },
    editItem(item){
      console.log(item)
      //this.form.project = item
      const lifecycle = JSON.parse(JSON.stringify(item)).item
      Object.assign(this.form.lifecycle, lifecycle  )
      this.$bvModal.show('new-lifecycle-modal')   //TODO:tightly coupled, but no direct dependency
    },
    deleteItem(item){
      const lifecycle = JSON.parse(JSON.stringify(item)).item
      //useProject.destroy(prj.id)
      useLifecycle.where('id', lifecycle.id).delete()
    },
    getFormattedSteps(row){
      const steps = row.map(item => item.Name)
      return steps.toString()
    }
  },
};


/*
function populateTestData(lcplanCount){
  // Populate tables with test data
  if(lcplanCount == 0){
    for(const plan of testLifecycle){
      useLifecycle.save({
            Name: plan.Name,
            LifecycleStep: plan.LifecycleStep
          });
    }
  }
}*/


// Table data items
const fields = [{
        key: 'Name',
        label: 'Name',
        sortable: true
    }, {
        key: 'LifecycleStep',
        label: 'Lifecycle Steps',
        formatter: "getFormattedSteps"
    }, {
        key: 'Count',
        label: 'Used by Projects'
    }, {
        key: 'actions',
        label: 'Actions'
    }]




</script>