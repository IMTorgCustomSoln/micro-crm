<template>
    <b-button
        v-b-modal.event-modal
        size="sm" 
        class="my-2 my-sm-0" 
        type="button"
        @click="$bvModal.show('event-modal')"
    > {{ label }}
    </b-button>

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
import {useDisplayStore, usePersonProject} from '@/main';

export default {
    name: 'ModalEvent',
    props:{
        label: String
    },
    data(){
        return{
            form:{
                error:'',
                event: {
                  participants: null,
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
        this.form.event.participants = this.sourceList.map(item => item.Fullname).join(', ')
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
        addEvent(){
            //basic case of participants chosen from users
            //TODO:useAccount when the Event is a task performed by the user
            const selectedProject = useDisplayStore.projectSelection
            for(const person of this.form.event.participants){
                const personProject = usePersonProject.where('StatusId', person.id).where('ProjectId', selectedProject.id).get()
                if(personProject.length == 1){
                  useEvent.save({
                      Type: this.form.event.type,
                      PersonProject: personProject.id,
                      Datetime: this.form.event.datetime,
                      Comments: this.form.event.comments,
                  })
                } else {
                  console.log(`ERROR: contact ${person} had ${personProject.length} projects`)
                }
            }
        }
    }
}


</script>