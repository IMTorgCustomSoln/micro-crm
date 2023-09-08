<template>
  <b-row>
    <b-col>
      <ContactsTable/>
    </b-col>
  </b-row>
</template>


<script setup>
import ContactsTable from '@/components/ContactsTable.vue';

import {displayStore} from '@/main.js'

console.log(displayStore.viewSelection)
displayStore.viewCount++
console.log(displayStore.viewCount)

</script>


<style scoped>

</style>
