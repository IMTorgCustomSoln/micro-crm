<template>
    
    <h1>Events</h1>
    <div>
      <b-table
        striped hover small
        :items="eventList"
        :fields="fields"

        primary-key='id'
        responsive="sm" sticky-header="1000px"
        bordered
        thead-class="tableHead bg-dark text-white"
      >
    </b-table>
    </div>

</template>


<script>

export default{
    name: 'TableEvent',
    data(){
        return{}
    },
    computed:{
        eventList:()=> []
    }
}
</script>