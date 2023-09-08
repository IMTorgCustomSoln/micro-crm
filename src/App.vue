<template>
        <Navbar/>
        <b-container class="bv-example-row">
            
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>

            <router-view></router-view>

        
    
  <b-row>
    <b-col>

    </b-col>
  </b-row>
</b-container>



    

</template>


<script setup>
import Navbar from '@/components/Navbar.vue';


</script>