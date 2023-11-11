<template>
    <b-button
        v-b-modal.feedback-modal
        size="sm" 
        class="my-2 my-sm-0" 
        type="button"
        @click="$bvModal.show('feedback-modal')"
    > {{ label }}
    </b-button>

    <b-modal 
        id="feedback-modal"
        >
        <template #modal-title>
            Feedback
        </template>
        
        <div>
          <div v-if="this.form.error">
            <span>{{ this.form.error }}</span>
          </div>
          <b-form>
            <b-card bg-variant="light">

              <b-form-group
                  label="Source:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.feedback.source"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Type:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-select id="nested-street" v-model="form.feedback.type" :options="feedbackTypesList"/>
                  <!--
                  <b-form-input id="nested-street" v-model="form.feedback.type" list="feedback-types"></b-form-input>
                  <datalist id="feedback-types">
                    <option v-for="typeObj in feedbackTypesList" :key="typeObj.id" >{{ typeObj }}</option>
                  </datalist>-->
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
import {useFeedback} from '@/main';
import {useDisplayStore, usePersonProject} from '@/main';

export default {
    name: 'ModalFeedback',
    props:{
        label: String
    },
    data(){
        return{
            form:{
                error:'',
                feedback: {
                    source: '',
                    type: null,
                    role: null,
                    use: null,
                    painpoint: null
                }
            }
        }
    },
    mounted(){
      this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
        //console.log('Modal is about to be closed', bvEvent, modalId)
        /*
        let account = useCollect(useAccount.all()).sortBy('Fullname')[0]
        this.form.account.name = account.Fullname*/
        this.form.feedback.source = this.sourceList.map(item => item.Fullname).join(', ')
      })
    },
    computed:{
      sourceList: () => {
       return useDisplayStore.participants
      },
      feedbackTypesList: () => {
        return useDisplayStore.defaults.feedback
      }
    },
    methods:{
        addFeedback(){
            //basic case of participants chosen from users
            const selectedProject = useDisplayStore.projectSelection
            const dt = new Date()
            const dtStr = dt.toString()
            for(const person of this.sourceList){
                const personProject = usePersonProject.where('StatusId', person.id).where('ProjectId', selectedProject.id).get()
                if(personProject.length == 1){
                  useFeedback.save({
                    PersonProjectId: personProject[0].id,
                    Type: this.form.feedback.type,
                    Role: this.form.feedback.role,
                    Use: this.form.feedback.use,
                    PainPoint: this.form.feedback.painpoint,
                    Datetime: dtStr
                  })
                } else {
                  console.log(`ERROR: contact ${person} had ${personProject.length} projects`)
                }
            }
        }
    }
}


</script>