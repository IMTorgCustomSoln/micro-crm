<template>
  <b-col cols="12">
  <div v-for="project of getProjects">
    {{ project.Name }}
    <div v-if="getEventsByProject(project).length > 0">
      <b-row>
        <b-col cols="12">
        <b-table
          striped hover small
          :items="getEventsByProject(project)"
          :fields="tableFields"

          style="white-space: pre-line;"
          >
        </b-table>
        </b-col>
      </b-row>
      <br>
    </div>
    <div v-else>
       (No events to display)
       <br>
    </div>
  </div>
  </b-col>
  
</template>
  
<script>
import { getUniqueArrValues } from '@/assets/utils';
import { useEvent, useProject } from '@/main';

export default {
  name:'EventSummaryReport',
  data(){
    return{
      tableFields: tableFields
    }
  },
  computed:{
    getProjects:()=>useProject.all(),
    getEvents(){
      const events = useEvent
                          .withAll()
                          .get()
                          .map(item => item.eventFull)
          const projects = useProject.all()
          for(const event of events){
            event.Project.map(personProject => {
              const project = projects.filter(project => project.id == personProject.ProjectId)[0]
              personProject.Project = project
            })
          }
          return events
    }
  },
  methods:{
    getEventsByProject(project){ 
      const events = this.getEvents//.map(item => item.eventFull)
      const records = []
      for(const event of events){
        const projectsIdsLinkedToEvent = events.flatMap(item => getUniqueArrValues( item.Project.map(prj => prj.ProjectId )) )
        if(projectsIdsLinkedToEvent.indexOf(project.id) != -1){
          records.push({
            Date: event.Date,
            Type: event.Type,
            Participants: event.Particpants.map(item => `${item.Fullname} (${item.Firm} / ${item.Office})`),
            Comments: event.Comments
          })
        } 
      }
      return records
    },
    getFormattedDate(val){
        return (new Date(val)).toDateString()
    },
    getFormattedParticipants(val){
      return val.join(', \n')
    }
  }
}

const tableFields=[{
  key:'Date',
  label:'Date',
  sortable:true,
  formatter:'getFormattedDate'
},{
  key:'Type',
  label:'Type',
  sortable:true
},{
  key:'Participants',
  label:'Participants',
  sortable:true,
  formatter:'getFormattedParticipants'
},{
  key:'Comments',
  label:'Comments',
  sortable:true
}]


</script>
  
  
<style scoped>

</style>