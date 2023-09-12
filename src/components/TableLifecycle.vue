<template>

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
    
</template>

<script>
import {useCollect} from 'pinia-orm/dist/helpers';
import {usePerson, useProject, useLifecycle} from '../main.js';
import {groupBy} from '../assets/utils';
import {testLifecycle} from '../stores/Lifecycle.js';


export default {
  name: 'TableLifecycle',
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
      viewSelection:''
    };
  },
  
  mounted(){
    const env = true
    if(env){
      populateTestData(this.lifecycleList.length)
    }
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
  },
};



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
}


</script>