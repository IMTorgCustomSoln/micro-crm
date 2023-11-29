<template>
    <div>
      <b-row >
        <ExportToCsv :exportArray="this.visibleRecords" />
      </b-row>

      <b-row>
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
      </b-row>
  </div>
</template>



<script>
import {toRaw, ref} from 'vue';
import { getMethod } from '@/assets/utils';
import {useDisplayStore} from '@/main.js';
import {usePerson, useProject, usePersonProject} from '@/main.js';
import ModalProject from '@/components/modals/ModalProject.vue';
import ExportToCsv from '../ExportToCsv.vue';


export default {
  name: 'TableProject',
  components:{
    ModalProject,
    ExportToCsv 
  },
  data() {
    return {
      visibleRecords: [],
      viewSelection:'',
      fields: fields,
      form:{
        project: {}
      }
    };
  },
  mounted() {
    //preserve row selection after page change
    const itemIds = this.$refs.prjTable.items.map(item => item.id)
    const index = itemIds.indexOf(useDisplayStore.projectSelection.id)
    this.$refs.prjTable.selectRow(index)

    //force re-run after mount
    this.getFomattedRows()
  },
  computed: {
    setViewSelection: () => useDisplayStore.viewSelection,
    projectList: () => {
      const projects = useProject.withAll().get().map(item => item.projectFull)
      return projects
    }
  },
  methods: {
    getFomattedRows(){
      if(this.projectList){
        for(const item of this.projectList){
          const record = {}
          for(const field of this.fields){
              if(field.formatter){
                  record[field.label] = this[field.formatter](item[field.key])
              }else{
                  record[field.label] = item[field.key]
              }
          }
          this.visibleRecords.push(record)
        }
      }
    },
    selectRow(rows){
      const prj = JSON.parse(JSON.stringify(rows))[0]
      if(prj){
        useDisplayStore.projectSelection = prj
      } else {
        useDisplayStore.projectSelection = {}
      }
    },
    editItem(item){
      const prj = JSON.parse(JSON.stringify(item)).item
      Object.assign(this.form.project, prj  )
      this.$bvModal.show('new-project-modal')   //TODO:tightly coupled, but no direct dependency
    },
    deleteItem(item){
      const prj = JSON.parse(JSON.stringify(item)).item
      useProject.where('id', prj.id).delete()
    },
    deleteAll(){
      const ids = usePerson.all().map(item => item.id)
      usePerson.destroy(ids)
    },
    formatDateAssigned(value) {
      const dt = value.toDateString()
      return dt
    },
    formatLifecycle(value){
      return value.Name
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
        formatter: "formatLifecycle"
    }, {
        key: 'ContactCount',
        label: 'Contacts',
        sortable: true
    }, {
        key: 'actions',
        label: 'Actions'
    }]
</script>