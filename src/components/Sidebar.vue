<template>
    <div>
      <!--TODO:different toggle methods
        [ref: SVG USED](https://www.onlinewebfonts.com/icon/477656)
        [ref: attached button](https://codepen.io/marijoha/pen/PNjZyW)
        [ref: navbar burger](https://codesandbox.io/p/sandbox/sidebar-m5ww8?file=%2FApp.vue%3A83%2C27)
      -->
    <div 
      type="button"
      v-b-toggle.sidebar-1 
      class="sidebar-toggle"
      @click="toggleHandler" 
      >
          <img class="icon"
            src="https://pic.onlinewebfonts.com/thumbnails/icons_477656.svg" 
            alt="Recipes Report Annual Document Summary Chart"
            >
      </div>
      

      <b-sidebar 
        id="sidebar-1" 
        ref="sidebar"

        title="" 
        shadow="lg"
        no-slide="true"
        z-index="100"
        >
        <template #header>
          <!--keep empty
            do not display header and exit button; otherwise, svg toggle icon will have problems
          -->
        </template>
        <div class="px-3 py-2">

          <!--Views-->
          <strong class="hdr">Views</strong>
            <ul style="list-style: none;">
              <div v-for="view of views" :key="view.value">
                    <li @click="getSelection(view)">{{ view.text }}</li>
                </div>
            </ul>

          <br>
          <!--Reports-->
          <strong class="hdr">Reports</strong>
            <ul style="list-style: none;">
                <div v-for="report of reports" :key="report.value">
                    <li @click="getSelection(report)">{{ report.text }}</li>
                </div>
            </ul>

        </div>
      </b-sidebar>

    </div>
  </template>

<script>
import { ref } from 'vue';
import {useDisplayStore} from '@/main.js';

export default {
    name: 'SideBar',
    data(){
        return{
          views: useDisplayStore.options.slice(3,5),
          reports: useDisplayStore.options.slice(5)
        }
    },
    methods:{
        getSelection(option){
            //this.selectedItem = option.text
            console.log(option)
            Object.assign(useDisplayStore.viewSelection, option)
        },
        toggleHandler(){
          console.log(this.$refs.sidebar)
          var toggleBtn = document.querySelector('.sidebar-toggle');
          //var sidebar = document.querySelector('.sidebar');
          toggleBtn.classList.toggle('is-closed');
          //sidebar.classList.toggle('is-closed');
        }
    }
}

</script>

<style lang="scss">

$color: white;
$icon_size: 80px;
$width__sidebar: 0;

.hdr{
  font-size: $header-size;
}

input[type="button"] {
    display: none;
}

.sidebar-toggle {
  position: fixed;
  z-index: 100;
  border: 4px solid $color;
  outline: none;
  width: $icon_size;
  height: $icon_size;
  border-radius: 50%;
  margin-left: $width__sidebar;
  margin-top: 1em;
  transform: rotate(45deg);
  cursor: pointer;
  transition: .2s;
  
  &.is-closed {
    transform: translateX(320px) rotate(0deg);  
  }
  
  /*TODO: fill svg background
  ref: https://stackoverflow.com/questions/13367868/how-to-modify-the-fill-color-of-an-svg-image-when-being-served-as-background-ima
   */
  .icon {
    background-color: white;
    -webkit-mask-image: url(https://pic.onlinewebfonts.com/thumbnails/icons_477656.svg);
    mask-image: url(https://pic.onlinewebfonts.com/thumbnails/icons_477656.svg);
    /*font-size: 1.5rem;
    color: $color;
    */
  }
}

#sidebar{
  z-index: 100;
}

.sidebar {
  width: $width__sidebar;
  height: 100vh;
  transition: .7s;
  
  &.is-closed {
    transform: translateX(-16em);
  }
}
</style>