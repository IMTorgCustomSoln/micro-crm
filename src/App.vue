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
import ContactsTable from './components/ContactsTable.vue';

import {displayStore} from './main.js'

console.log(displayStore.viewSelection)
displayStore.viewCount++
console.log(displayStore.viewCount)



</script>


<style scoped>

</style>
