<template>
  <div v-if="this.contactsSelected.length > 0">
    <span>Contacts: {{ this.contactsSelected.length }}    </span>
    <ModalEvent :contacts="contactsSelected"/>
  </div>
  <div>
  <b-table 
    striped hover small
    selectable
    select-mode="multiple"
    :items="contactList"
    :fields="fields"

    primary-key='id'
    responsive="sm" sticky-header="1000px"
    bordered
    thead-class="tableHead bg-dark text-white"
    @row-selected="selectRow"  
    >
    <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="editContact(row)">Edit</b-btn>
          <b-btn size="sm" @click="deleteContact(row)">Delete</b-btn>
        </span>
    </template>
  </b-table>
  <ModalContact :item="form.contact"/>
  </div>

  </template>
  
  
<script>
import {toRaw} from 'vue';
import {useCollect} from 'pinia-orm/dist/helpers';
import {useDisplayStore, usePerson, usePersonProject, useEvent, useFeedback, useLifecycleStep} from '@/main.js';
import ModalContact from '@/components/modals/ModalContact.vue';


export default{
  name: 'TableContact',
  components:{
    ModalContact
  },
  watch:{
    getTableFields(newVal, oldVal){
      Object.assign(this.fields, newVal)
    }
  },
  computed: {
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
      const contacts = []
      const prjGroups = usePersonProject.withAll().groupBy('StatusId').get()
      if(!isEmpty(prjGroups)){
        for(const personPrjId in prjGroups){
          let person = JSON.parse(JSON.stringify( usePerson.find(personPrjId) ))
          if(person){
            let referredBy = null
            const referralGiven = []
            const projects = []
            let statuses = ''
            let prjs_cnt = 0
            let event_cnt = 0
            let feedback_cnt = 0
            for(const item of prjGroups[personPrjId]){
              //references given
              const peopleIdsReferredByThisPerson = usePersonProject.withAll().where('RefId', item.StatusId).get().map(item => item.StatusId)
              const names = usePerson.where('id', peopleIdsReferredByThisPerson).get().map(item => item.Fullname)
              referralGiven.push(...names)

              //checks
              const checkSelection = !isEmpty(useDisplayStore.projectSelection)
              const checkPrj = checkSelection ? item.ProjectId == useDisplayStore.projectSelection.id : true
              if(checkPrj){
                if(checkSelection){
                  //referred by
                  referredBy = item.ReferredBy

                  //references given
                  const peopleIdsReferredByThisPerson = usePersonProject.withAll().where('ProjectId', item.ProjectId).where('RefId', item.StatusId).get().map(item => item.StatusId)
                  const names = usePerson.where('id', peopleIdsReferredByThisPerson).get().map(item => item.Fullname)
                  referralGiven.length = 0
                  referralGiven.push(...names)

                  //current status
                  const mxDate = new Date(Math.max(...item.StepStatus.map(e => new Date(e.CompletionDate) )))
                  const currentStatus = item.StepStatus.filter(e => +new Date(e.CompletionDate) == +mxDate)[0]
                  const lcStepName = useLifecycleStep.find(currentStatus.LifecycleStepId).Name
                  /*use to keep status of all projects
                  const prjName = item.Project.Name.toString()
                  const rec = {}
                  rec[prjName] = lcStepName
                  statuses.push(rec)*/
                  statuses = lcStepName
                }
                //projects
                /*const rec = {}
                rec['id'] = item.Project.id
                rec['Name'] = item.Project.Name*/
                projects.push(item.Project.Name)

                //attrs
                prjs_cnt = prjs_cnt + 1
                event_cnt = item.pivot ? event_cnt + useEvent.withAll().where('id', item.pivot.EventId).get().length: event_cnt
                feedback_cnt = item ? feedback_cnt + useFeedback.withAll().where('PersonProjectId', item.id).get().length: feedback_cnt
              }
            }
            person['id']
            person['PersonProjectStatus']
            person['ReferredBy'] = referredBy ?  referredBy.Fullname : null
            person['Statuses'] = statuses
            person['Projects'] = projects
            person['ProjectCnt'] = prjs_cnt
            person['References'] = referralGiven.length
            person['Events'] = event_cnt
            person['Feedback'] = feedback_cnt
            if(person['ProjectCnt']>0){
              contacts.push(person)
            }
          }
        }
      }
      return contacts
    },
  },
  data() {
    return {
      viewSelection:'',
      contactsSelected: [],
      fields: [],
      form:{
        contact:{}
      }
    };
  },
  methods: {
    selectRow(rows){
      const contacts = JSON.parse(JSON.stringify(rows))
      const selected = toRaw(useDisplayStore.projectSelection)
      if(!isEmpty(selected)){
        /*
        const ids = contacts.map(item => item.id)
        const items = usePerson.where('id', ids).with('Statuses').get()
        for(const item of items){
          const contact = contacts.filter(contact => contact.id == item.id)[0]
          let tmp = item['Statuses'].filter(status => status.Project == toRaw(useDisplayStore.projectSelection).Name)[0]
          contact['Status'] = tmp['CurrentLifecycleStep']
          results.push(contact)
        }*/
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
    }
  },
};




function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}


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
        sortable: true
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
        key: 'Statuses',
        label: 'Status',
        sortable: true,
    }, {
        key: 'Events',
        label: 'Events',
        sortable: true,
    }, {
        key: 'References',
        label: 'References',
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
        key: 'Events',
        label: 'Events',
        sortable: true,
    }, {
        key: 'References',
        label: 'References',
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
