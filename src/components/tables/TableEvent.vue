<template>
    
    <h1>Events</h1>
    <div>
      <b-table
        striped hover small
        :items="eventList"

        primary-key='id'
        responsive="sm" sticky-header="1000px"
        bordered
        thead-class="tableHead bg-dark text-white"
      >
    </b-table>
    </div>

</template>


<script>
import { useEvent } from '@/main';

export default{
    name: 'TableEvent',
    data(){
        return{}
    },
    computed:{
        eventList(){
          const results = useEvent.withAllRecursive().get()
          return results
        }
    }
}
</script>