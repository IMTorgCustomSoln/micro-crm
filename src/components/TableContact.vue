<template>

        <table class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Fullname</th>
              <th>Title</th>
              <th>Email</th>
              <th>Number</th>
              <th>Office</th>
              <th>Firm</th>
              <th>Projects</th>
              <th>Interactions</th>
              <th>UseCases</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, index) in contactList" :key="contact.id">
              <td> <b-icon-x-square class="h5 mb-1 destroy" font-scale="0.5" @click="removeContact(contact)" /> {{ index }}</td>
              <td>{{ contact.Fullname }}</td>
              <td>{{ contact.Title }}</td>
              <td>{{ contact.Email }}</td>
              <td>{{ contact.Number }}</td>
              <td>{{ contact.Office }}</td>
              <td>{{ contact.Firm }}</td>
              <td>{{ contact.Projects }}</td>
              <td>{{ contact.interactions }}</td>
              <td>{{ contact.usecases }}</td>
            </tr>
          </tbody>
        </table>

  </template>
  
  
<script>
import {toRaw} from 'vue';
import {useCollect} from 'pinia-orm/dist/helpers';
import {useDisplayStore, usePerson} from '@/main.js';


export default{
  name: 'TableContact',
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
      viewSelection:''
    };
  },
  methods: {
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


</script>
  
  
<style scoped>
  
 </style>
