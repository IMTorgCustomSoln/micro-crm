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
import ModalEvent from '@/components/modals/ModalEvent.vue';
import ModalContact from '@/components/modals/ModalContact.vue';


export default{
  name: 'TableContact',
  components:{
    ModalContact,
    ModalEvent
  },
  computed: {
    getTableFields: () => {
      if(useDisplayStore.projectSelection){
        Object.assign(this.fields, fieldsWithProject)
      } else {
        Object.assign(this.fields, fieldsWithOutProject)
      }
    },
    setViewSelection: () => useDisplayStore.viewSelection,
    contactList: () => {
      const contacts = []
      const prjGroups = usePersonProject.withAll().groupBy('StatusId').get()
      for(const personPrjId in prjGroups){
        let person = JSON.parse(JSON.stringify( usePerson.find(personPrjId) ))
        if(person){
          const referredBy = []
          const statuses = []
          let prjs_cnt = 0
          let refs_cnt = 0
          let event_cnt = 0
          let feedback_cnt = 0
          for(const item of prjGroups[personPrjId]){
            const checkSelection = !isEmpty(useDisplayStore.projectSelection)
            const checkPrj = checkSelection ? item.ProjectId == useDisplayStore.projectSelection.id : true
            if(checkPrj){
              if(checkSelection){
                //referred by
                const names = usePersonProject.withAll().where('RefId', item.StatusId).get().map(ref => ref.ReferredBy.Fullname)
                referredBy.push(...names)
                //current status
                const mxDate = new Date(Math.max(...item.StepStatus.map(e => new Date(e.StatusDate) )))
                const currentStatus = item.StepStatus.filter(e => +e.StatusDate == +mxDate)[0]
                const prjName = item.Project.Name.toString()
                const lcStepName = useLifecycleStep.find(currentStatus.LifecycleStepId).Name
                const rec = {}
                rec[prjName] = lcStepName
                statuses.push(rec)
              }
              //attrs
              prjs_cnt = prjs_cnt + 1
              refs_cnt = item ? refs_cnt + usePersonProject.withAll().where('RefId', item.StatusId).get().length : refs_cnt
              event_cnt = item.pivot ? event_cnt + useEvent.withAll().where('id', item.pivot.EventId).get().length: event_cnt
              feedback_cnt = item ? feedback_cnt + useFeedback.withAll().where('PersonProjectId', item.id).get().length: feedback_cnt
            }
          }
          delete person['id']
          delete person['PersonProjectStatus']
          person['ReferredBy'] = referredBy
          person['Statuses'] = statuses
          person['Projects'] = prjs_cnt
          person['References'] = refs_cnt
          person['Events'] = event_cnt
          person['Feedback'] = feedback_cnt
          if(person['Projects']>0){
            contacts.push(person)
          }
        }
      }
      return contacts

      /*
      const contacts = useCollect(usePerson.all()).sortBy('Fullname')
      const contactsWithInteractions = usePerson.with('Statuses', (query) => {query.with('Interactions')}).get()
      const contactsWithUseCases = usePerson.with('Statuses', (query) => {query.with('UseCases')}).get()

      for(let i = 0; i < contacts.length; i++){
        contacts[i]['interactions'] = contactsWithInteractions[i]['Statuses'][0]['Interactions'].length
        contacts[i]['usecases'] = contactsWithUseCases[i]['Statuses'][0]['UseCases'].length
      }

      if( !isEmpty(toRaw(useDisplayStore.projectSelection))){
        return contacts.filter(item => toRaw(item.Projects).includes(useDisplayStore.projectSelection.Name) )
      } else {
        return contacts
      }*/
    },
  },
  data() {
    return {
      viewSelection:'',
      contactsSelected: [],
      fields: null,
      form:{
        contact:{}
      }
    };
  },
  methods: {
    selectRow(rows){
      const contacts = JSON.parse(JSON.stringify(rows))
      const results = []
      const selected = toRaw(useDisplayStore.projectSelection)
      if(!isEmpty(selected)){
        const ids = contacts.map(item => item.id)
        const items = usePerson.where('id', ids).with('Statuses').get()
        for(const item of items){
          const contact = contacts.filter(contact => contact.id == item.id)[0]
          let tmp = item['Statuses'].filter(status => status.Project == toRaw(useDisplayStore.projectSelection).Name)[0]
          contact['Status'] = tmp['CurrentLifecycleStep']
          results.push(contact)
        }
      }

      if(results.length > 0){
        Object.assign(this.contactsSelected, results)
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
        key: 'Projects',
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
        key: 'Projects',
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
