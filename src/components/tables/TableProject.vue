<template>
    
    <div>
      <b-table
        ref="prjTable" 
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
      <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="editItem(row)">Edit</b-btn>
          <b-btn size="sm" @click="deleteItem(row)">Delete</b-btn>
        </span>
      </template>
    </b-table>
    <ModalProject :item="form.project"/>
    </div>

</template>



<script>
import {toRaw, ref} from 'vue';
import {useDisplayStore} from '@/main.js';
import {useCollect} from 'pinia-orm/dist/helpers';
import {usePerson, useProject} from '@/main.js';
import ModalProject from '@/components/modals/ModalProject.vue';



export default {
  name: 'TableProject',
  components:{
    ModalProject
  },
  data() {
    return {
      viewSelection:'',
      fields: fields,
      form:{
        project: {}
      }
    };
  },
  mounted() {
    const itemIds = this.$refs.prjTable.items.map(item => item.id)
    const index = itemIds.indexOf(useDisplayStore.projectSelection.id)
    this.$refs.prjTable.selectRow(index)
  },
  computed: {
    setViewSelection: () => useDisplayStore.viewSelection,
    projectList: () => useCollect(useProject.all()).sortBy('Name')
  },
  methods: {
    selectRow(rows){
      const prj = JSON.parse(JSON.stringify(rows))[0]
      if(prj){
        useDisplayStore.projectSelection = prj
      } else {
        useDisplayStore.projectSelection = {}
      }
    },
    editItem(item){
      console.log(item)
      //this.form.project = item
      const prj = JSON.parse(JSON.stringify(item)).item
      Object.assign(this.form.project, prj  )
      this.$bvModal.show('new-project-modal')   //TODO:tightly coupled, but no direct dependency
    },
    deleteItem(item){
      const prj = JSON.parse(JSON.stringify(item)).item
      //useProject.destroy(prj.id)
      useProject.where('id', prj.id).delete()
    },
    deleteAll(){
      const ids = usePerson.all().map(item => item.id)
      console.log(ids)
      usePerson.destroy(ids)
    },
    formatDateAssigned(value) {
      const dt = value.toDateString()
      return dt
    }
  },
};






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
    }, {
        key: 'actions',
        label: 'Actions'
    }]





</script>