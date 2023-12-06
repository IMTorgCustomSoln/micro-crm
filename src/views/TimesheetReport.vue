<template>
    <b-col cols="12">
    <b-form>
        <b-card bg-variant="light">
            <b-form-group
              label="Timeperiod Start:"
              label-for="timeperiod"
              label-cols-sm="4"
              label-align-sm="right"
              >
              <b-form-datepicker 
                id="project-startdate" 
                :initial-date="getTodaysDate"
                v-model="startdate" 
                class="mb-2"
                >
                </b-form-datepicker>
            </b-form-group>
        </b-card>
    </b-form>
        <b-table
          striped hover small
          :items="getEventHoursByProject"
          :fields="tableFields"

          style="white-space: pre-line;"
          >
        </b-table>
    </b-col>
</template>

<script>
import { useDisplayStore, useEvent, useProject } from '@/main';

export default{
    name:'TimesheetReport',
    data(){
        return{
            startdate: null,
            tableFields: null
        }
    },
    mounted(){
        const today = new Date()
        const startDate = today.addDays(-14)
        this.tableFields = this.getTableFields(startDate)

    },
    computed:{
        getTodaysDate:()=> useDisplayStore.getTodaysDate,
        getProjects:()=>useProject.all(),
    },
    methods:{
        getTimeWindow(weeks=2, startdate, result='endDate'){
            const startDate = new Date(startdate)
            const days = weeks * 7
            if(result=='endDate'){
                for(const day of days){
                    const endDate = startDate.addDays(days)
                    return endDate
                }
            }else if(result=='daysArray'){
                const result = []
                for(const day of days){
                    const date = (startDate.addDays(day)).toDateString()
                    const fieldDate = {
                        key:date,
                        label:date
                    }
                    result.push(fieldDate)
                }
                return endDate
            }else{
                console.log(`parameter 'result' ${result} is not in expected options <'endDate', 'daysArray'>`)
                throw new TypeError
            }
        },
        getTableFields(startdate){
            const fields = getTimeWindow(weeks=2, startdate, result='endDate')
            this.tableFields = tableFields.push(...fields)
        },
        getEventHoursByProject(){ 
          const projects = useProject.all()
          for(const project of projects){
            const events = useEvent.withAllRecursive().get().map(item => item.eventFull)
            const records = []
            for(const event of events){
              const projectIdsLinkedToEvent = events.flatMap(item => getUniqueArrValues( item.Project.map(prj => prj.ProjectId )) )
              if(projectIdsLinkedToEvent.indexOf(project.id) != -1){
                  //TODO:get hours each day, st: [{project:project.Name, 5/1: 3.4, 5/2: 4.5, ...}]
                records.push({
                  Date: event.Date,
                  Type: event.Type,
                  Participants: event.Particpants.map(item => `${item.Fullname} (${item.Firm} / ${item.Office})`),
                  Comments: event.Comments
                })
              } 
            }
        }
          return records
        },
        getProjectName(project){
            return project.id
        }

    }
}

const tableFields = [{
        key:'Project',
        label:'Project',
        sortable:true,
        formatter:'getProjectName'
    }
]

</script>

<style>
</style>