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
    
</template>

<script>
import { toRaw } from 'vue';
import {useProject, useLifecycle} from '@/main.js';
import ModalLifecycle from '@/components/modals/ModalLifecycle.vue'

export default {
  name: 'TableLifecycle',
  components:{
    ModalLifecycle
  },
  computed: {
    lifecycleList: () => {
      // match lifecylce plans with projects 
      const lifecycles = JSON.parse(JSON.stringify( useLifecycle.withAll().get() ))
      const grpPrjs = useProject.withAll().groupBy('LifecycleId').get()
      for(const plan of lifecycles){
        plan.Projects = grpPrjs[plan.id]
        plan.ProjectCount = plan.Projects.length
        plan.LifecycleStep = sortSteps(plan.LifecycleStep, 'Order')     //ensure correct order
      }
      return lifecycles
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
    /*const env = true
    if(env){
      populateTestData(this.lifecycleList.length)
    }*/
  },
  methods: {
    /*clearAll(){
      const ids = usePerson.all().map(item => item.id)
      console.log(ids)
      usePerson.destroy(ids)
    },*/
    editItem(item){
      const lifecycle = JSON.parse(JSON.stringify(item)).item
      Object.assign(this.form.lifecycle, lifecycle  )
      this.$bvModal.show('new-lifecycle-modal')   //TODO:tightly coupled, but no direct dependency
    },
    deleteItem(item){
      const lifecycle = toRaw(item).item
      if(lifecycle.ProjectCount == 0){
          useLifecycle.where('id', lifecycle.id).delete()
          return true
      }
      alert(`ERROR: A Lifecycle Plan can only be deleted if it is first replaced in all associated Projects\n
      Plan '${lifecycle.Name}' is currently used with ${lifecycle.ProjectCount} Projects.`)
      return false
    },
    getFormattedSteps(row){
      const steps = row.map(item => ` ${item.Name}`)
      return steps.toString()
    }
  },
};


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
        key: 'ProjectCount',
        label: 'Used by Projects'
    }, {
        key: 'actions',
        label: 'Actions'
    }
]

function sortSteps(arrSteps, key){
  //Sort array of steps by their order
  return arrSteps.sort((a,b) => a[key]- b[key])
}


</script>