<template>
  <div>
    People showing: {{peopleCount}}
  </div>

  <b-table
    id="tbl-next-steps" 
    striped hover small
    :items="getNextSteps"
    :fields="fields"
    :sort-by.sync="table.sortBy"
    :sort-desc.sync="table.sortDesc"

    primary-key='id'
    responsive="sm"
    sticky-header="1000px"
    bordered
    thead-class="tableHead bg-dark text-white"
    @row-clicked="expandAdditionalInfo"   
    >

  <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="sendEmail(row)">Prepare Email</b-btn>
          <b-btn size="sm" v-b-popover.hover.top="showEmail(row)" title="Popover Title">Show Email</b-btn>
          
          <!--TODO:style
          <b-btn size="sm" :id="$props.id" title="Popover Title">Show Email</b-btn>
            <b-popover :target="$props.id" triggers="hover" placement="top">
              <template #title>Popover Title</template>
              {{ showEmail(row) }}
            </b-popover>
          -->
        </span>
    </template>


  <template #cell(show_details)="row">
              <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
              <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                -
              </b-form-checkbox>
            </template>

        <template #row-details="row">
              <b-card>
                <b-row>
                  <b-col sm="4">
                    <b>Next Step Due Date: </b>{{ row.item.StepDueDate.toDateString() }}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="4">
                    <b>Project Completion Date: </b>{{  row.item.ProjectEndDate.toDateString() }}
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="12" class="text-sm-left">
                    <b-table 
                      striped hover small
                      :items="row.item.EventLog"
                      :fields="detailsFields"
                      :sort-by.sync="timeline.sortBy"
                      :sort-desc.sync="timeline.sortDesc"

                      responsive="sm" 
                      bordered
                      thead-class="tableHead bg-dark text-white"
                      >
                    </b-table>

                  </b-col>
                </b-row>
              </b-card>
            </template>

  </b-table>
</template>
  
  
<script>
import { toRaw } from 'vue';
import { isEmpty, createEmailString, createEmailInLocalClient } from '@/assets/utils';
import { usePerson, usePersonProject, usePersonProjectEvent, useLifecycle, useDisplayStore, useAccount, useEvent } from '@/main';
import { workingDaysBetweenDates } from '@/assets/utils';

export default {
  name:'EventReport',
  data(){
    return {
      table:{
        sortBy: 'DaysUntilDue',
        sortDesc: false,
      },
      timeline:{
        sortBy: 'Order',
        sortDesc: true,
      },
      fields: fields,
      detailsFields: detailsFields,
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
      const account = useAccount.all()[0]
      for(const person of personWithProjects){
        for(const personProject of person.PersonProject){

          if( !isEmpty(toRaw(useDisplayStore.projectSelection)) ){
            if(personProject.ProjectId != useDisplayStore.projectSelection.id){
              continue
            }
          }   
              //
              const completed = personProject.StepStatus.filter(step => step.CompletionDate!=null)
              const mxIdx = completed.length > 0 
                              ? completed.length - 1 
                              : 0
              const lastCompletedStep = personProject.StepStatus[mxIdx]
              const daysFromLastCompletedStepStart = workingDaysBetweenDates(
                                                        true, 
                                                        toRaw(lastCompletedStep.CompletionDate),
                                                        useDisplayStore.getTodaysDate 
                                                        )

              //
              const lifecycleSteps = useLifecycle.withAllRecursive().find(personProject.Project.LifecycleId)
              const currentStep = lifecycleSteps.LifecycleStep.length > mxIdx + 1
                                    ? lifecycleSteps.LifecycleStep[mxIdx+1] 
                                    : lifecycleSteps.LifecycleStep[mxIdx]
              const daysUntilDue = currentStep.DurationBizDays - daysFromLastCompletedStepStart
              const dt = new Date(lastCompletedStep.CompletionDate)
              const currentStepDueDate = dt.addDays(currentStep.DurationBizDays)
              const daysUntilProjectEndDate = workingDaysBetweenDates(
                                                  true,
                                                  useDisplayStore.getTodaysDate,  
                                                  personProject.Project.EndDate
                                                  )

              //
              const record = {}
              record.DaysUntilDue = daysUntilDue
              record.StepDueDate = currentStepDueDate
              record.DaysInCurrentStep = daysFromLastCompletedStepStart
              record.DaysUntilProjectEndDate = daysUntilProjectEndDate
              record.ProjectEndDate = (new Date(personProject.Project.EndDate))
              record.Person = person.Fullname
              record.Project = personProject.Project.Name
              record.personProject = [personProject]
              record.CurrentStep = currentStep.Name

              //
              const eventsWithLogs = []
              //const rec = {Date:null, Category:null, Type:null, StepOrder:null, StepCompleted:null, AddressFeedback:null, Comments:null}
              const events = personProject.Events.map(item => {
                const event = useEvent.find(item.id)
                const rec = {
                  Date: this.getFormattedDate(event.Datetime),
                  Category: 'Event',
                  Type: event.Type, 
                  StepOrder: null, 
                  StepCompleted: event.StepCompleted, 
                  AddressFeedback: event.AddressFeedback,
                  Comments: event.Comments
                }
                return rec
              });
              const steps = personProject.StepStatus.map(item => {
                const rec = {
                  Date: this.getFormattedDate(item.CompletionDate),
                  Category: 'Lifecycle',
                  Type: item.LifecycleStep.Name, 
                  StepOrder: item.LifecycleStep.Order, 
                  StepCompleted: null, 
                  AddressFeedback: null,
                  customElementsomments: null
                }
                return rec
              })
              eventsWithLogs.push(...events)
              eventsWithLogs.push(...steps)
              record.EventLog = eventsWithLogs

              //email action
              record.EmailToSend = {}
              record.EmailToSend.PersonEmail = person.Email
              const formMapping = {'<CONTACT_FULLNAME>':person.Fullname, '<PRODUCT_NAME>':personProject.Project.Name, '<ACCOUNT_FULLNAME>':account.Fullname}
              Object.keys(formMapping).forEach( (k,idx) => {
                currentStep.EmailForm = currentStep.EmailForm.replace(String(k), formMapping[k])
              })
              record.EmailToSend.EmailForm = currentStep.EmailForm
              results.push(record)

        }
      }
      //this.populatePeopleCount(results)
      this.peopleCount = results.length
      return results
      }
  },
  methods:{
      expandAdditionalInfo(row) {
          row._showDetails = !row._showDetails
      },
      sendEmail(row){
        const emailToSend = toRaw(row.item.EmailToSend)
        const msgInfo = createEmailString(emailToSend.PersonEmail, 
                                    '<subject>', 
                                    emailToSend.EmailForm
                                    )
        createEmailInLocalClient(msgInfo)
        const comment = `Provisioned email with the following:'\n\n${msgInfo}`
        useEvent.save({
          PersonProject: toRaw(row.item.personProject),
          Datetime: useDisplayStore.todaysDate,
          Type: 'Message',
          Comments: comment,
        })
        console.log(comment)
      },
      getFormattedDate(val){
        return (new Date(val)).toDateString()
      },
      showEmail(row){
        const emailToSend = toRaw(row.item.EmailToSend)
        const msgInfo = createEmailString(emailToSend.PersonEmail, 
                                    '<subject>', 
                                    emailToSend.EmailForm
                                    )
        return msgInfo
      }
  },
}


const fields = [{
  key: 'DaysUntilDue',
  label: 'Days Until Due',
  sortable: true
}, {
  key: 'DaysInCurrentStep',
  label: 'Days In Current Step',
  sortable: true
}, {
  key: 'DaysUntilProjectEndDate',
  label: 'Days Until Project End Date',
  sortable: true
}, {
  key: 'Person',
  label: 'Person',
  sortable: true
}, {
  key: 'Project',
  label: 'Project',
  sortable: true
}, {
  key: 'CurrentStep',
  label: 'Current Step',
  sortable: true
}, {
  key: 'actions',
  label: 'Actions'
}];


const detailsFields = [
  {
    key: 'Date',
    label: 'Date',
    sortable: true,
    //formatter: "getFormattedDate"
  },{
    key: 'Category',
    label: 'Category',
    sortable: true
  },{
    key: 'Type',
    label: 'Type',
    sortable: true
  },{
    key: 'StepOrder',
    label: 'Step Order',
    sortable: true
  },{
    key: 'StepCompleted',
    label: 'Step Completed',
    sortable: true
  },{
    key: 'AddressFeedback',
    label: 'Address Feedback',
    sortable: true
  },{
    key: 'Comments',
    label: 'Comments',
    sortable: true
  },
]







</script>
  
  
<style scoped>

</style>