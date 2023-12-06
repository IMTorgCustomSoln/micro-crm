<template>
    
    <h1>Events</h1>
      <b-table
        striped hover small
        :items="eventList"
        :fields="fields"

        primary-key='id'
        responsive="sm" sticky-header="1000px"
        bordered
        thead-class="tableHead bg-dark text-white"
      >
      <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="editEvent(row)">Edit</b-btn>
          <b-btn size="sm" @click="deleteEvent(row)">Delete</b-btn>
        </span>
    </template>
    </b-table>
    <ModalEvent :event="form.event"/>

</template>


<script>
import { getUniqueArrValues } from '@/assets/utils';
import { useEvent, usePerson } from '@/main';
import ModalEvent from '@/components/modals/ModalEvent.vue'

export default{
    name: 'TableEvent',
    components:{
      ModalEvent
    },
    data(){
        return{
          fields: tableFields,
          form:{
            event:{}
          }
        }
    },
    computed:{
        eventList(){
          const events = useEvent
                          .withAllRecursive()
                          .get()
                          .map(item => item.eventFull)
          return events
        }
    },
    methods:{
      editEvent(row){
        const event = JSON.parse(JSON.stringify(row)).item
        Object.assign(this.form.event, event)
        this.$bvModal.show('event-modal')
      },
      deleteEvent(row){
        const event = JSON.parse(JSON.stringify(row)).item
        useEvent.where('id', event.id).delete()
      },
      getDateString(date){
        return (new Date(date)).toDateString()
      },
      formatProjects(personProjects){
        const projectNames = personProjects.map(item => item.Project.Name)
        const uniqueList = getUniqueArrValues(projectNames).join(' ').trim()
        return uniqueList
      },
      formatParticipants(personProjects){
        const participanttNames = personProjects.map(item => item.Fullname)
        const participantList = getUniqueArrValues(participanttNames)
        return `(${participantList.length}) - ${participantList.join(', ')}`
      },
      formatTimeLength(val){
        return val
      }
    }
}

const tableFields = [{
        key: 'StartDate',
        label: 'Date',
        sortable: true,
        formatter: "getDateString"
    }, {
        key: 'TimeLength',
        label: 'Time Length (days)',
        sortable: true,
        formatter: "formatTimeLength"
    }, {
        key: 'Type',
        label: 'Type',
        sortable: true
    }, {
        key: 'Project',
        label: 'Project',
        sortable: true,
        formatter: "formatProjects"
    }, {
        key: 'Particpants',
        label: 'Particpants',
        sortable: true,
        formatter: "formatParticipants"
    }, {
        key: 'StepCompleted',
        label: 'Step Completed',
        sortable: true
    }, {
        key: 'AddressFeedback',
        label: 'Feedback Addressed',
        sortable: true
    }, {
        key: 'Comments',
        label: 'Comments',
        sortable: true
    }, {
        key: 'actions',
        label: 'Actions'
    }
]


</script>