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
import { totalTimeBetweenDates } from '@/assets/utils';

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
        getDateShort(date){
            const month = date.getUTCMonth() + 1; //months from 1-12
            const day = date.getUTCDate();
            return month + "/" + day;
        },
        getTimeWindowByWeeks(weeks=2, startdate, result='endDate'){
            const startDate = new Date(startdate)
            const numberOfDays = weeks * 7
            const days = Array(numberOfDays).fill().map((element, index) => index + 1)
            if(result=='endDate'){
                const endDate = startDate.addDays(numberOfDays)
                return endDate
            }else if(result=='daysArray'){
                const result = []
                for(const day of days){
                    const date = (startDate.addDays(day))
                    const newdate = this.getDateShort(date)
                    const fieldDate = {
                        key:newdate,
                        label:newdate
                    }
                    result.push(fieldDate)
                }
                return result
            }else{
                console.log(`parameter 'result' ${result} is not in expected options <'endDate', 'daysArray'>`)
                throw new TypeError
            }
        },
        getTimeWindowByStartEnd(startdate, enddate){
            const startDate = new Date(startdate)
            const numberOfDays = Math.ceil( totalTimeBetweenDates('days', startdate, enddate) )
            const days = Array(numberOfDays).fill().map((element, index) => index + 1)
            const result = []
            for(const day of days){
                const date = (startDate.addDays(day))
                const newdate = this.getDateShort(date)
                result.push(newdate)
            }
            return result
        },
        getTableFields(startdate){
            tableFields.push({
                        key:'Project',
                        label:'Project'
                    })
            const fields = this.getTimeWindowByWeeks(2, startdate, 'daysArray')
            this.tableFields = tableFields.push(...fields)
        },
        getEventHoursByProject(){ 
          const projects = useProject.all()
          //const events = useEvent.withAllRecursive().get().map(item => item.eventFull)
          const events = this.getEvents
          const records = []
          for(const project of projects){
            const item = {}
            item['Project'] = project.Name
            for(const event of events){
                const ids = event.Project.map(item => item.ProjectId)
                if(ids.indexOf(project.id)!=-1){
                    if(event.TimeLength <= 1){
                        const newdate = this.getDateShort(event.StartDatetime)
                        if(Object.keys(item).indexOf(newdate)==-1){
                            item[newdate] = event.TimeLength
                        }else{
                            item[newdate] = item[newdate] + event.TimeLength
                        }
                    } else if(event.TimeLength > 1){
                        const days = this.getTimeWindowByStartEnd(event.StartDatetime, event.EndDatetime)
                        for(const day of days){
                            item[day] = 8
                        }
                    }
                }
              } 
            records.push(item)
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