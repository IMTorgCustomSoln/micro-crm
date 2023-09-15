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
            </tr>
          </tbody>
        </table>

  </template>
  
  
  <script>
  import {toRaw} from 'vue';
  import {useCollect} from 'pinia-orm/dist/helpers';
  import {useDisplayStore, usePerson} from '@/main.js';
  import {testContacts} from '@/assets/defaults.js';


 

  export default{
    name: 'TableContact',
    computed: {
      //setViewSelection: () => displayStore.viewSelection,
      contactList: () => {
        const contacts = useCollect(usePerson.all()).sortBy('Fullname')
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
    mounted(){
      const env = useDisplayStore.populateTestData
      if(env){
        populateTestData(this.contactList.length)
      }
    },
    methods: {
      removeContact(contact){
        usePerson.destroy(contact.id)
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

function populateTestData(contactCount){
  // Populate tables with test data
  if(contactCount == 0){
    for(const contact of testContacts){
      usePerson.save({
            Fullname: contact.Fullname,
            Title: contact.Title,
            Email: contact.Email,
            Number: contact.Number,
            Office: contact.Office,
            Firm: contact.Firm,
            Projects: contact.Projects,
      });
    }
  }
}
</script>
  
  
<style scoped>
  
 </style>
