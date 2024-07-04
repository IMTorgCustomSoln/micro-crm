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
                    value="accepted"
                    unchecked-value="not_accepted"
                  >
                    check if yes 
                  </b-form-checkbox>
                </b-form-group>

                <b-form-group
                  label="Start Datetime:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-input-group class="mb-3">
                    <b-form-input
                        id="example-input"
                        v-model="form.event.datetimeStart"
                        type="text"
                        placeholder="YYYY-MM-DD HH:mm"
                        autocomplete="off"
                        >
                      </b-form-input>

                      <b-input-group-append>
                        <b-form-datepicker
                          button-only
                          right
                          locale="en-US"
                          aria-controls="example-input"
                          @context="onStartContext"
                          >
                        </b-form-datepicker>
                        <b-form-timepicker
                          value="08:30:00"
                          button-only
                          right
                          locale="en"
                          aria-controls="example-input"
                          @context="onStartContext"
                          >
                        </b-form-timepicker>
                      </b-input-group-append>

                    </b-input-group>
                </b-form-group>

                <b-form-group
                  label="End Datetime:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <b-input-group class="mb-3">
                    <b-form-input
                        id="example-input"
                        v-model="form.event.datetimeEnd"
                        type="text"
                        placeholder="YYYY-MM-DD HH:mm"
                        autocomplete="off"
                        >
                      </b-form-input>

                      <b-input-group-append>
                        <b-form-datepicker
                          button-only
                          right
                          locale="en-US"
                          aria-controls="example-input"
                          @context="onEndContext"
                          >
                        </b-form-datepicker>
                        <b-form-timepicker
                          value="17:00:00"
                          button-only
                          right
                          locale="en"
                          aria-controls="example-input"
                          @context="onEndContext"
                          >
                        </b-form-timepicker>
                      </b-input-group-append>

                    </b-input-group>
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
//import DateTimePicker from '@/components/shared/DateTimePicker.vue';


export default {
    name: 'ModalEvent',
    props:['event','contact'],
    //components:{DateTimePicker},
    data(){
        return{
            eventsOriginal:null,
            form:{
                error:'',
                start:{
                  date: null,
                  time: null
                },
                end:{
                  date: null,
                  time: null
                },
                event: {
                  participants: null,
                  projects:null,
                  datetimeStart: null,
                  datetimeEnd: null,
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
        /*this logic determines whether modal should be populated as:
            - new Event
            - edit Event
        */
        const contact = this.participantList
        const event = toRaw(this.event)
        if(!isEmpty(event)){
          this.addItem(event)
        } else if(contact) {
          this.form.event.participants = this.participantList.map(item => item.Fullname).join(', ')
        } else {
          console.log('ERROR: ModalEvent not clicked, but initiated.')
        }
      })
    },
    computed:{
      getCurrentStep: () => {
        return 1
      },
      participantList: () => {
        //use selected contacts or the user-account
        if(useDisplayStore.participants.length > 0){
          return useDisplayStore.participants
        }else{
          const user_account = usePerson.withAll().where('id','user-account').get()
          return user_account
        }
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
      onStartContext(ctx) {
        if(Object.keys(ctx).indexOf( 'activeDate' ) != -1){
          this.form.start.date = ctx.activeYMD
          console.log(`ctx.activeYMD ${ctx.activeYMD}` )

        } else if (Object.keys(ctx).indexOf( 'formatted' ) != -1){
          this.form.start.time = ctx.value
          console.log(`ctx.formatted ${ctx.value}` )

        }else{
          throw TypeError
        }
        const dtStr = this.form.start.date + ' ' + this.form.start.time 
        this.form.event.datetimeStart = new Date(dtStr)
        console.log(this.form.event.datetimeStart)
      },
      onEndContext(ctx) {
        if(Object.keys(ctx).indexOf( 'activeDate' ) != -1){
          this.form.end.date = ctx.activeYMD
          console.log(`ctx.activeYMD ${ctx.activeYMD}` )

        } else if (Object.keys(ctx).indexOf( 'formatted' ) != -1){
          this.form.end.time = ctx.value
          console.log(`ctx.formatted ${ctx.value}` )

        }else{
          throw TypeError
        }
        const dtStr = this.form.end.date + ' ' + this.form.end.time 
        this.form.event.datetimeEnd = new Date(dtStr)
        console.log(this.form.event.datetimeEnd)
      },
      initializeFormValues(){
        this.eventsOriginal = null
        this.form.error = null
        this.form.start.date = null
        this.form.start.time = null
        this.form.end.date = null
        this.form.end.time = null
        this.form.event.participants = null
        this.form.event.projects = null
        this.form.event.datetimeStart = null
        this.form.event.datetimeEnd = null
        this.form.event.addressFeedback = null
        this.form.event.stepCompleted = null
        this.form.event.comments = null
      },
      addItem(event){
        this.eventsOriginal = event
        this.form.event.participants = event.Particpants.map(item => item.Fullname).join(', ')
        this.form.event.projects = event.Project.map(item => item.Project.Name).join(', ');
        this.form.event.datetimeStart = new Date( Date.parse(event.StartDate));
        this.form.event.datetimeEnd = new Date( Date.parse(event.EndDate));
        this.form.event.type = event.Type;
        this.form.event.addressFeedback = event.AddressFeedback;
        this.form.event.stepCompleted = event.StepCompleted;
        this.form.event.comments = event.Comments;
      },
      addEvent(){
          //basic case of participants chosen from users
          //TODO:useAccount when the Event is a task performed by the user
            const selectedProject = useDisplayStore.projectSelection
            const participantNames = this.form.event.participants.split(',').map(item => item.trim())
            const participantIds = usePerson
                                  .withAll()
                                  .where('Fullname', participantNames)
                                  .get().map(item => item.id)
            const personProjectIds = usePersonProject
                                    .where('PersonId', participantIds)
                                    .where('ProjectId', selectedProject.id)
                                    .get().map(item => ( 
                                      {id: item.id} 
                                      ))
            if(!this.eventsOriginal){
              useEvent.save({
                PersonProject: personProjectIds,
                Type: this.form.event.type,
                StartDatetime: new Date(Date.parse(this.form.event.datetimeStart)),
                EndDatetime: new Date(Date.parse(this.form.event.datetimeEnd)),
                AddressFeedback: this.form.event.addressFeedback,
                StepCompleted: this.form.event.stepCompleted,
                Comments: this.form.event.comments,
              })
            }else{
              useEvent.save({
                id: this.eventsOriginal.id,
                PersonProject: personProjectIds,
                Type: this.form.event.type,
                StartDatetime: new Date(Date.parse(this.form.event.datetimeStart)),
                EndDatetime: new Date(Date.parse(this.form.event.datetimeEnd)),
                AddressFeedback: this.form.event.addressFeedback,
                StepCompleted: this.form.event.stepCompleted,
                Comments: this.form.event.comments,
              })
            }
            this.initializeFormValues();
            this.$bvModal.hide('event-modal');
          }
    }
}


</script>