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
import Navbar from './components/Navbar.vue'
import ContactsTable from './components/Contacts.vue'

</script>


<style scoped>

</style>
