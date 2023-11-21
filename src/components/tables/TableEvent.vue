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
      <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="editEvent(row)">Edit</b-btn>
          <b-btn size="sm" @click="deleteEvent(row)">Delete</b-btn>
        </span>
    </template>
    </b-table>
    <ModalEvent :event="form.event"/>
    </div>

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
          const events = useEvent.withAllRecursive().get()
          const results = []
          for(const event of events){
            const record = {}
            record.id = event.id
            record.Date = event.Datetime
            record.Type = event.Type
            record.Project = event.PersonProject
            record.Particpants = event.PersonProject
            record.StepCompleted = event.StepCompleted
            record.AddressFeedback = event.AddressFeedback
            record.Comments = event.Comments
            results.push(record)
          }
          return results
        }
    },
    methods:{
      editEvent(row){
        const event = JSON.parse(JSON.stringify(row)).item
        Object.assign(this.form.event, event)
        this.$bvModal.show('event-modal')
      },
      deleteEvent(row){
        //TODO
        console.log(row)
      },
      getDateString(date){
        return (new Date(date)).toDateString()
      },
      getProjects(personProjects){
        const projects = personProjects.map(item => item.Project.Name)
            const uniqueList = getUniqueArrValues(projects).join(' ').trim()
            return uniqueList
      },
      getParticipants(personProjects){
        const persons = usePerson.withAllRecursive().get()
        const participantIds = personProjects.map(item => item.StatusId)
        const participantList = persons.filter(item => participantIds.indexOf(item.id) != -1 ).map(item => item.Fullname)
        return `(${participantList.length}) - ${participantList.join(', ')}`
      }
    }
}

const tableFields = [{
        key: 'Date',
        label: 'Date',
        sortable: true,
        formatter: "getDateString"
    }, {
        key: 'Type',
        label: 'Type',
        sortable: true
    }, {
        key: 'Project',
        label: 'Project',
        sortable: true,
        formatter: "getProjects"
    }, {
        key: 'Particpants',
        label: 'Particpants',
        sortable: true,
        formatter: "getParticipants"
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