<template>
    <b-button
        v-b-modal.new-interaction-modal
        size="sm" 
        class="my-2 my-sm-0" 
        type="button"
        @click="$bvModal.show('new-interaction-modal')"
    > Log Interaction
    </b-button>

    <b-modal 
        id="new-interaction-modal"
        >
        <template #modal-title>
            Interaction
        </template>
        
        <div>
          <div v-if="this.form.error">
            <span>{{ this.form.error }}</span>
          </div>
          <b-form>
            <b-card bg-variant="light">
                <b-form-group
                  label="Lifecycle:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.interaction.lifecycleStep"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Participants:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.interaction.participants"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Date:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-datepicker id="project-startdate" v-model="form.interaction.datetime" class="mb-2"></b-form-datepicker>
                </b-form-group>

                <b-form-group
                  label="Comments:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.interaction.comments"></b-form-input>
                </b-form-group>

            </b-card>
          </b-form>
          </div>

          <template #modal-footer>
            <b-button @click="addInteraction" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update</b-button>
        </template>
    </b-modal>

</template>


<script>
import {toRaw} from 'vue';
import {useDisplayStore, usePerson} from '@/main';
import {useInteraction, useLifecycle} from '@/main';


export default {
    name: 'ModalLogInteraction',
    props: ['contacts'],
    watch:{
        contacts:{
            handler: function(newItem, oldVal) {
                const contactRecords = toRaw(this.contacts)

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
                }
            }
        }
    },
    data(){
        return {
            form:{
                error:'',
                interaction:{
                    interactionId: '',
                    lifecycleStep: '',
                    participants: [],
                    datetime: new Date(),
                    comments: '',
                }
            }

        }
    },
    methods:{
        initializeFormValues(){
            this.form.interaction.interactionId = ''
            this.form.interaction.lifecycleStep = ''
            this.form.interaction.participants = []
            this.form.interaction.datetime = ''
            this.form.interaction.comments = ''
        },
        addInteraction(){
            //TODO: does not work with cloned projects
            /*TODO: log with person
            const contactRecordIds = toRaw(this.contacts).map(item => item.id)
            usePerson.with('id', contactRecordIds).save({
                Statuses:[
                    Interactions:{
                        LifecycleStep: this.lifecycleStep,
                        Participants: this.participants,
                        Datetime: this.datetime,
                        Comments: this.comments,
                    }
                ]
            })*/
            useInteraction.save({
                LifecycleStep: this.lifecycleStep,
                Participants: this.participants,
                Datetime: this.datetime,
                Comments: this.comments,
            })
            Object.keys(this.form.interaction).forEach( k => {
                this.form.project[k] = ''
            })
            this.$bvModal.hide('new-interaction-modal');
            this.initializeFormValues();
        }
    }
}

</script>