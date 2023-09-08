<template>
Home
</template>


<script setup>
  import {displayStore} from '@/main.js'
  
  console.log(displayStore.viewSelection)
  displayStore.viewCount++
  console.log(displayStore.viewCount)

</script>


<style scoped>

</style>
