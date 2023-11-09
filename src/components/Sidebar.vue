<template>
    <div>
      <!--TODO:attach button to sidebar
        [ref](https://codepen.io/marijoha/pen/PNjZyW)
    
    -->
      <b-button v-b-toggle.sidebar-1>Details</b-button>

      <b-sidebar id="sidebar-1" title="" shadow>
        <div class="px-3 py-2">
          <strong class="hdr">Views</strong>
            <ul style="list-style: none;">
              <li>Events</li>
              <li>Interactions</li>
              <li>Feedback</li>
            </ul>

          <br>
          <strong class="hdr">Reports</strong>
            <ul style="list-style: none;">
                <div v-for="report of reports" :key="report.value">
                    <li @click="getSelection(report)">{{ report.text }}</li>
                </div>
            </ul>
            <!--
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>-->
        </div>
      </b-sidebar>
    </div>
  </template>

<script>
import {useDisplayStore} from '@/main.js';

export default {
    name: 'SideBar',
    data(){
        return{
            reports: useDisplayStore.options.slice(3)
        }
    },
    methods:{
        getSelection(option){
            //this.selectedItem = option.text
            console.log(option)
            Object.assign(useDisplayStore.viewSelection, option)
        },
    }
}

</script>

<style>
.hdr{
  font-size: 24px;
}
</style>