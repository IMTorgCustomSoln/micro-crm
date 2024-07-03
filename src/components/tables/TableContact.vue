<template>
  <div>
    <b-row>
      <b-col cols="12">
      <div v-if="selectedProjects">
        <b-button size="sm" @click="logEvent">Log Event</b-button>
        <b-button size="sm" @click="logFeedback">Log Feedback</b-button>
      </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
      <div v-if="this.contactsSelected.length > 0">
        <span id="contacts">Contacts: {{ this.contactsSelected.length }}</span>
        <br>
        <b-button id="clearSelections" size="sm" @click="clearSelected">Clear Row Selections</b-button>
        <span><em>Note: only contact selections from the same project can be used to Log something.</em></span>
      </div>
      </b-col>
    </b-row>
  <b-row>
    <b-col>
      <ExportToCsv :exportArray="this.visibleRecords" />
    </b-col>
  </b-row>
</div>

  <div>
  <b-table 
    ref="contactsTable"
    striped hover small
    :items="contactList"
    :fields="fields"

    primary-key='id'
    responsive="sm" sticky-header="1000px"
    bordered
    thead-class="tableHead bg-dark text-white"

    selectable
    select-mode="multi"
    @row-selected="onRowSelected"  
    >
    <template #cell(actions)="row">
        <span>
          <b-button size="sm" @click="editContact(row)">Edit</b-button>
          <b-button size="sm" @click="deleteContact(row)">Delete</b-button>
        </span>
    </template>
  </b-table>
  <ModalContact :item="form.contact"/>
  <ModalEvent :contact="contactsSelected"/>
  <ModalFeedback :source="contactsSelected"/>
  </div>

  </template>
  
  
<script>
import {toRaw} from 'vue';
import {isEmpty} from '@/assets/utils'
import {useDisplayStore, usePerson, usePersonProject, useEvent, useFeedback, useLifecycleStep} from '@/main.js';
import ModalContact from '@/components/modals/ModalContact.vue';
import ModalEvent from '@/components/modals/ModalEvent.vue'
import ModalFeedback from '@/components/modals/ModalFeedback.vue'
import ExportToCsv from '@/components/shared/ExportToCsv.vue';

export default{
  name: 'TableContact',
  components:{
    ModalContact,
    ModalEvent,
    ModalFeedback,
    ExportToCsv
  },
  watch:{
    getTableFields(newVal, oldVal){
      Object.assign(this.fields, newVal)
    }
  },
  computed: {
    selectedProjects(){
      return useDisplayStore.projectSelection.Name
    },
    getTableFields(){
      //works with `watch:getTableFields()` to change this.fields - TODO:too complicated!
      if(!isEmpty(useDisplayStore.projectSelection)){
        Object.assign(this.fields, fieldsWithProject)
        return fieldsWithProject
      } else {
        Object.assign(this.fields, fieldsWithOutProject)
        return fieldsWithOutProject
      }
    },
    setViewSelection: () => useDisplayStore.viewSelection,
    contactList: () => {
      const isEmptyProject = isEmpty(useDisplayStore.projectSelection)
      if(!isEmptyProject){
        const projects = usePerson.withAll().get().map(item => item.contactWithSelectedProject).filter(item => item != undefined)
        return projects
      }else{
        const projects = usePerson.withAll().get().map(item => item.contactWithProjectFull).filter(item => item != undefined)
        return projects
      }
    },
  },
  data() {
    return {
      visibleRecords: [],
      viewSelection: '',
      contactsSelected: [],
      fields: [],
      form:{
        contact:{}
      }
    };
  },
  mounted(){
    //preserve row selection after page change
    const itemIds = this.$refs.contactsTable.items.map(item => item.id)
    const participantIds = useDisplayStore.participants.map(item => item.id)
    for(const id of participantIds){
      const index = itemIds.indexOf( id )
      this.$refs.contactsTable.selectRow(index)
    }

    //force re-run after mount
    this.getFomattedRows()
  },
  methods: {
    getFomattedRows(){
      if(this){
        for(const item of this.contactList){
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
    logEvent(){
      this.$bvModal.show('event-modal')
    },
    logFeedback(){
      this.$bvModal.show('feedback-modal')
    },
    clearSelected() {
        this.$refs.contactsTable.clearSelected()
    },
    onRowSelected(rows){
      const contacts = JSON.parse(JSON.stringify(rows))
      const selected = toRaw(useDisplayStore.projectSelection)
      if(!isEmpty(selected)){
        this.contactsSelected = contacts
        useDisplayStore.participants = contacts
        console.log(this.contactsSelected)
      } else {
        this.contactsSelected.length = 0
      }
    },
    editContact(row){
      const contact = JSON.parse(JSON.stringify(row)).item
      Object.assign(this.form.contact, contact)
      this.$bvModal.show('new-contact-modal')   //TODO:tightly coupled, but no direct dependency
    },
    deleteContact(row){
      const contact = JSON.parse(JSON.stringify(row)).item
      usePerson.where('id', contact.id).delete()
    },
    formatReferredBy(val){
      if(!isEmpty(useDisplayStore.projectSelection)){
        return val ? val.Fullname : ''
      }else{
        return val
      }
    }
  }
};



// Table data items
const fieldsWithProject = [{
        key: 'Fullname',
        label: 'Fullname',
        sortable: true
    }, {
        key: 'Title',
        label: 'Title',
        sortable: true
    }, {
        key: 'ReferredBy',
        label: 'Referred By',
        sortable: true,
        formatter: 'formatReferredBy'
    }, {
        key: 'Email',
        label: 'Email',
        sortable: true,
    }, {
        key: 'Number',
        label: 'Number',
        sortable: true,
    }, {
        key: 'Office',
        label: 'Office',
        sortable: true,
    }, {
        key: 'Firm',
        label: 'Firm',
        sortable: true,
    }, {
        key: 'Statuses',
        label: 'Status',
        sortable: true,
    }, {
        key: 'ReferencesGiven',
        label: 'References Given',
        sortable: true,
    }, {
        key: 'Events',
        label: 'Events',
        sortable: true,
    }, {
        key: 'Feedback',
        label: 'Feedback',
        sortable: true,
    }, {
        key: 'actions',
        label: 'Actions'
    }]


const fieldsWithOutProject = [{
        key: 'Fullname',
        label: 'Fullname',
        sortable: true
    }, {
        key: 'Title',
        label: 'Title',
        sortable: true
    }, {
        key: 'ReferredBy',
        label: 'Referred By',
        sortable: true,
        formatter: 'formatReferredBy'
    }, {
        key: 'Email',
        label: 'Email',
        sortable: true,
    }, {
        key: 'Number',
        label: 'Number',
        sortable: true,
    }, {
        key: 'Office',
        label: 'Office',
        sortable: true,
    }, {
        key: 'Firm',
        label: 'Firm',
        sortable: true,
    }, {
        key: 'ProjectCnt',
        label: 'Projects',
        sortable: true,
    }, {
        key: 'ReferencesGiven',
        label: 'References Given',
        sortable: true,
    }, {
        key: 'Events',
        label: 'Events',
        sortable: true,
    }, {
        key: 'Feedback',
        label: 'Feedback',
        sortable: true,
    }, {
        key: 'actions',
        label: 'Actions'
    }]

</script>
  
  
<style scoped>
  
 </style>
