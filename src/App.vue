<template>
  <header>
    <Navbar/>
  </header>

  <main>
    <b-container class="bv-example-row">
  <b-row>
    <b-col>
      <ContactsTable/>
    </b-col>
  </b-row>
</b-container>
    
    

  </main>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import ContactsTable from './components/Contacts.vue';

/*
//TODO: a way to reference store variables because they cannot be destructured

import { storeToRefs } from 'pinia';
import { useDisplayStore } from './stores/DisplayStore';
const {viewSelection, viewCount} = storeToRefs(useDisplayStore());
console.log(viewSelection)

viewCount++
console.log(viewCount)
*/

import {displayStore} from './main.js'

console.log(displayStore.viewSelection)
displayStore.viewCount++
console.log(displayStore.viewCount)



</script>


<style scoped>

</style>
