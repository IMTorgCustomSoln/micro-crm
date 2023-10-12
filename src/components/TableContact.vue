<template>
  <div v-if="this.contactsSelected.length > 0">
    <span>Contacts: {{ this.contactsSelected.length }}    </span>
    <ModalLogInteraction :contacts="contactsSelected"/>
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
import {useDisplayStore, usePerson} from '@/main.js';
import ModalLogInteraction from './ModalLogInteraction.vue';
import ModalContact from './ModalContact.vue';


export default{
  name: 'TableContact',
  components:{
    ModalContact,
    ModalLogInteraction
  },
  computed: {
    setViewSelection: () => useDisplayStore.viewSelection,
    contactList: () => {
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
      }
    },
  },
  data() {
    return {
      viewSelection:'',
      contactsSelected: [],
      fields: fields,
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
const fields = [{
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
        key: 'interactions',
        label: 'Interactions',
        sortable: true,
    }, {
        key: 'references',
        label: 'References',
        sortable: true,
    }, {
        key: 'usecases',
        label: 'UseCases',
        sortable: true,
    }, {
        key: 'actions',
        label: 'Actions'
    }]

</script>
  
  
<style scoped>
  
 </style>
