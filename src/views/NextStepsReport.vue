<template>
  <div>
    People showing: {{peopleCount}}
  </div>
  <b-table 
    striped hover small
    selectable
    select-mode="multiple"
    :items="getNextSteps"

    primary-key='id'
    responsive="sm" sticky-header="1000px"
    bordered
    thead-class="tableHead bg-dark text-white"
    @row-selected="selectRow"  
    >
  </b-table>
</template>
  
  
<script>
import { toRaw } from 'vue';
import { isEmpty } from '@/assets/utils';
import { usePerson, useLifecycle, useDisplayStore } from '@/main';
import { workingDaysBetweenDates } from '@/assets/utils';

export default {
  name:'EventReport',
  data(){
    return {
      peopleCount: 0
    }
  },
  computed:{
    getNextSteps(){
      //DaysUntilDue, Person.Fullname, Project.Name, CurrentStep, CountOfEventsSinceLastCompletionDate, Action(Send/Resend Email)
      //click for expansion of event log history
      //email send: Person.Email, body(filled)
      const results = []
      const personWithProjects = JSON.parse(JSON.stringify( usePerson.withAllRecursive(2).get() ))
      for(const person of personWithProjects){
        for(const personProject of person.PersonProjectStatus){

          if( !isEmpty(toRaw(useDisplayStore.projectSelection)) ){
            if(personProject.ProjectId != useDisplayStore.projectSelection.id){
              continue
            }
          }

              //
              const eventsWithLogs = []
              eventsWithLogs.push(...personProject.Events)
              eventsWithLogs.push(...personProject.StepStatus)

              const completed = personProject.StepStatus.filter(step => step.CompletionDate!=null)
              const mxIdx = completed.length > 0 ? completed.length - 1 : 0
              const lastCompletedStep = personProject.StepStatus[mxIdx]
              const daysFromLastCompletedStepStart = workingDaysBetweenDates(lastCompletedStep.CompletionDate)

              //
              const lifecycleSteps = useLifecycle.withAllRecursive().find(personProject.Project.LifecycleId)
              const currentStep = lifecycleSteps.LifecycleStep.length < mxIdx ? lifecycleSteps.LifecycleStep[mxIdx+1] : lifecycleSteps.LifecycleStep[mxIdx]
              const daysUntilDue = daysFromLastCompletedStepStart - currentStep.DurationBizDays

              //
              const record = {}
              record.DaysUntilDue = daysUntilDue
              record.DaysInCurrentStep = daysFromLastCompletedStepStart
              record.DaysUntilProjectEndDate = workingDaysBetweenDates(personProject.Project.EndDate)
              record.ProjectEndDate = personProject.Project.ProjectEndDate
              record.Person = person.Name
              record.Project = personProject.Project.Name
              record.CurrentStep = currentStep.Name
              record.EventLog = eventsWithLogs

              //email action
              record.EmailToSend = {}
              record.EmailToSend.PersonEmail = person.Email
              //const formMapping = {'CONTACT_FULLNAME':null, 'PRODUCT_NAME':null, 'ACCOUNT_FULLNAME':null}
              record.EmailToSend.EmailForm = currentStep.EmailForm
              results.push(record)

        }
      }
      //this.populatePeopleCount(results)
      this.peopleCount = results.length
      return results
    }
  },


}


</script>
  
  
<style scoped>

</style>