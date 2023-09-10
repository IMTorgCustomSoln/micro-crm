<template>
    <div>
        <Navbar/>
      <main>
        <component :is="selection"/>
      </main>
    </div>
  </template>
  
  <script>
  import {displayStore} from '../main.js';
  import Navbar from '@/components/Navbar.vue';

  export default {
    name: `LayoutDefault`,
    components:[Navbar],
    data() {
      return {
      };
    },
    computed:{
        selection() => displayStore.viewSelection
    }
  };
  </script>