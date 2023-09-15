<template>
    <span>
        <ModalProject name="Edit" :item="newitem" />
        <b-btn size="sm" @click="deleteItem(item)">Delete</b-btn>

        <!--
        <b-btn size="sm" @click="editItem(row)">Edit</b-btn>
        -->
    </span>
</template>

<script>
import ModalProject from '@/components/ModalProject.vue'
import {useProject} from '@/main.js';

export default {
    name: 'ProjectActions',
    components:{
        ModalProject
    },
    props:['item'],
    watch: { 
      item: {
          handler: function(newItem, oldVal) {
            this.newitem = JSON.parse(JSON.stringify(this.$props.item))
            },
            deep: true
          }
  },
    data(){
        return{
            newitem:{}
        }
    },
    methods:{
        deleteItem(item){
            const prj = JSON.parse(JSON.stringify(item)).item
            useProject.where('id', prj.id).delete()
        },
    }
}


</script>