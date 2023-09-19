<template>
  <div v-if="this.contactsSelected.length > 0">
    <span>Contacts: {{ this.contactsSelected.length }}    </span>
    <ModalLogInteraction :contacts="contactsSelected"/>
  </div>
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
  </b-table>

  </template>
  
  
<script>
import {toRaw} from 'vue';
import {useCollect} from 'pinia-orm/dist/helpers';
import {useDisplayStore, usePerson} from '@/main.js';
import ModalLogInteraction from './ModalLogInteraction.vue';


export default{
  name: 'TableContact',
  components:{
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
    };
  },
  methods: {
    selectRow(rows){
      const contacts = JSON.parse(JSON.stringify(rows))
      const results = []
      if(useDisplayStore.projectSelection){
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
    removeContact(contact){
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
