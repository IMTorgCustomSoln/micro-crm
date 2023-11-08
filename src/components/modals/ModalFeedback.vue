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
                  <b-form-input id="nested-street" v-model="form.feedback.type"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Role:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.feedback.role"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Use"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.feedback.use"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Pain Point"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.feedback.painpoint"></b-form-input>
                </b-form-group>

            </b-card>
          </b-form>
          </div>

          <template #modal-footer>
            <b-button @click="addFeedback" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update</b-button>
        </template>
    </b-modal>

</template>

<script>
import {toRaw} from 'vue';
import {useEvent} from '@/main';
import {useDisplayStore, usePersonProject} from '@/main';

export default {
    name: 'ModalEvent',
    props:{
        label: String, 
        contacts: Array
    },
    watch:{
      contact:{
        handler: function(newItem, oldVal) {
            const contactRecords = toRaw(this.contacts)
            /*TODO
            const prjLifecycle = toRaw(useDisplayStore.projectSelection)['Lifecycle']
            const steps = useLifecycle.where('Name', prjLifecycle).get()[0]['LifecycleStep']
            const orderedStatus = []
            contactRecords.map(rec => {
                const tmp = steps.filter(step => step['Name']==rec['Status'])[0]['Order']
                orderedStatus.push({'Order': tmp, 'Status': rec['Status']})
            })
            const lowest = Math.min(...orderedStatus.map(item => item['Order']))
            const lowestStatus = orderedStatus.filter(item => item['Order']==lowest)[0]['Status']

            if(contactRecords.length > 0){
                this.form.interaction.participants.length = 0
                console.log(contactRecords)
                this.form.interaction.lifecycleStep = lowestStatus
                const names = contactRecords.map(item => item.Fullname)
                Object.assign(this.form.interaction.participants, names)
            }*/
            
        },
        deep: true,
        immediate: true
      }
    },
    data(){
        return{
            form:{
                error:'',
                feedback: {
                    personProjectId: null,
                    type: null,
                    roll: null,
                    use: null,
                    painpoint: null
                }
            }
        }
    },
    /*
    mounted(){
      this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
        //console.log('Modal is about to be closed', bvEvent, modalId)
        let account = useCollect(useAccount.all()).sortBy('Fullname')[0]
        this.form.account.name = account.Fullname
      })
    },*/
    methods:{
        addFeedback(){
            //basic case of participants chosen from users
            //TODO:useAccount when the Event is a task performed by the user
            const selectedProject = useDisplayStore.projectSelection
            for(const person of this.form.event.participants){
                const personProject = usePersonProject.where('PersonId', person.id).where('ProjectId', selectedProject.id).get()
                useEvent.save({
                    Type: this.form.event.type,
                    PersonProject: personProject.id,
                    Datetime: this.form.event.datetime,
                    Comments: this.form.event.comments,
                })
            }
        }
    }
}


</script>