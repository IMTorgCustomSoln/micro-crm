<template>

    <b-modal 
        id="event-modal"
        >
        <template #modal-title>
            Event
        </template>
        
        <div>
          <div v-if="this.form.error">
            <span>{{ this.form.error }}</span>
          </div>
          <b-form>
            <b-card bg-variant="light">

                <b-form-group
                  label="Type:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-select id="nested-street" v-model="form.event.type" :options="eventTypesList"></b-form-select>
                </b-form-group>

                <b-form-group
                  label="Participants:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.event.participants"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Addresses Feedback?:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-select id="nested-street" v-model="form.event.addressFeedback" :options="feedbackList"/>
                </b-form-group>
                
                <b-form-group>
                  Current Lifecycle Step completed for all participants?
                  <b-form-checkbox
                    id="checkbox-1"
                    v-model="form.event.stepCompleted"
                    name="checkbox-1"
                    value="not_accepted"
                    unchecked-value="not_accepted"
                  >
                    check if yes 
                  </b-form-checkbox>
                </b-form-group>

                <b-form-group
                  label="Date:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-datepicker id="project-startdate" v-model="form.event.datetime" class="mb-2"></b-form-datepicker>
                </b-form-group>

                <b-form-group
                  label="Comments:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.event.comments"></b-form-input>
                </b-form-group>

            </b-card>
          </b-form>
          </div>

          <template #modal-footer>
            <b-button @click="addEvent" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update</b-button>
        </template>
    </b-modal>

</template>

<script>
import {toRaw} from 'vue';
import {useEvent, useFeedback} from '@/main';
import {useDisplayStore, usePersonProject, usePerson} from '@/main';
import { isEmpty } from '@/assets/utils';

export default {
    name: 'ModalEvent',
    props:['event','contact'],
    data(){
        return{
            eventsOriginal:null,
            form:{
                error:'',
                event: {
                  participants: null,
                  projects:null,
                  datetime: null,
                  type: null,
                  addressFeedback: null,
                  stepCompleted: null,
                  comments: null
                }
            }
        }
    },
    mounted(){
      this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
        //console.log('Modal is about to be closed', bvEvent, modalId)
        //let account = useCollect(useAccount.all()).sortBy('Fullname')[0]
        //this.form.account.name = account.Fullname
        const contact = toRaw(this.contact)
        const event = toRaw(this.event)
        if(contact){
        this.form.event.participants = this.sourceList.map(item => item.Fullname).join(', ')
        }else if(event){
          this.addItem(event)
        }
        else{
          console.log('ERROR: ModalEvent')
        }
      })
    },
    computed:{
      getCurrentStep: () => {
        return 1
      },
      sourceList: () => {
       return useDisplayStore.participants
      },
      eventTypesList: ()=> {
        return useDisplayStore.defaults.event
      },
      feedbackList: () => {
        const feedback = useFeedback.all()
        const items = feedback.map(item => `${item.Type}-${item.Role}-${item.Use}`)
        return items
      }
    },
    methods:{
      initializeFormValues(){
        console.log('TODO: init values')
      },
      addItem(event){
        this.eventsOriginal = event
        if(event.Particpants){
        const personIds = event.Particpants.map(item => item.StatusId)
        const names = usePerson.find(personIds).map(item => item.Fullname)

        this.form.event.participants = names;
        this.form.event.projects = event.Projects;
        this.form.event.datetime = event.Date;
        this.form.event.type = event.Type;
        this.form.event.addressFeedback = event.AddressFeedback;
        this.form.event.stepCompleted = event.StepCompleted;
        this.form.event.comments = event.Comments;
        }
      },
      addEvent(){
          //basic case of participants chosen from users
          //TODO:useAccount when the Event is a task performed by the user
            const selectedProject = useDisplayStore.projectSelection
            const participantNames = this.form.event.participants.split(',').map(item => item.trim())
            const participants = usePerson
                                  .withAll()
                                  .where('Fullname', participantNames)
                                  .get()
            for(const person of participants){
                const personProject = usePersonProject
                                        .where('PersonId', person.id)
                                        .where('ProjectId', selectedProject.id)
                                        .get()
                if(personProject.length == 1){
                  if(!this.eventsOriginal){
                    useEvent.save({
                      PersonProjectId: personProject[0].id,
                      Type: this.form.event.type,
                      Datetime: new Date(Date.parse(this.form.event.datetime)),
                      AddressFeedback: this.form.event.addressFeedback,
                      StepCompleted: this.form.event.stepCompleted,
                      Comments: this.form.event.comments,
                    })
                  }else{
                    useEvent.save({
                      id: this.eventsOriginal.id,
                      PersonProjectId: personProject[0].id,
                      Type: this.form.event.type,
                      Datetime: new Date(Date.parse(this.form.event.datetime)),
                      AddressFeedback: this.form.event.addressFeedback,
                      StepCompleted: this.form.event.stepCompleted,
                      Comments: this.form.event.comments,
                    })
                  }
                } else {
                  console.log(`ERROR: contact ${person} had ${personProject.length} projects`)
                }
            }
            this.initializeFormValues();
            this.$bvModal.hide('event-modal');
        }
    }
}


</script>