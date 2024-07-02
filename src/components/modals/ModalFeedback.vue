<template>

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
                  label="Source (choose one):"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                <!-- TODO: warning - only one person can be selected, and selection options come from same Project
                  <b-form-input id="nested-street" v-model="form.feedback.source"></b-form-input>-->
                  <b-form-select id="nested-street" v-model="form.feedback.source"  :options="sourceList.map(item=>item.Fullname)"/>
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
import { isEmpty } from '@/assets/utils';
import {useFeedback} from '@/main';
import {useDisplayStore, usePersonProject, usePerson} from '@/main';

export default {
    name: 'ModalFeedback',
    props:['feedback','source'],
    data(){
        return{
          feedbackOriginal: null,
            form:{
                error:'',
                feedback: {
                    source: null,
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
        const source = toRaw(this.source)
        const feedback= toRaw(this.feedback)
        if(!isEmpty(source)){
          this.form.feedback.source = this.sourceList.map(item => item.Fullname)[0]
        }else if(!isEmpty(feedback)){
          this.addItem(feedback)
        }
        else{
          console.log('ERROR: ModalFeedback not clicked, but initiated.')
        }
      })
    },
    computed:{
      sourceList: () => {
       const sources = useDisplayStore.participants.length > 0 
                      ? useDisplayStore.participants 
                      : usePersonProject
                          .withAllRecursive()
                          .where('ProjectId', useDisplayStore.projectSelection.id)
                          .get()
                          .map(item => item.Person)
        return sources
      },
      feedbackTypesList: () => {
        return useDisplayStore.defaults.feedback
      }
    },
    methods:{
      initializeFormValues(){
        console.log('TODO: init values')
      },
      addItem(feedback){
        this.feedbackOriginal = feedback
        this.form.feedback.source = feedback.Source.Person.Fullname;
        this.form.feedback.type = feedback.Type;
        this.form.feedback.role = feedback.Role;
        this.form.feedback.use = feedback.Use;
        this.form.feedback.painpoint = feedback.PainPoint;
        this.form.feedback.datetime = new Date(feedback.Date);
      },
      addFeedback(){
          //basic case of participants chosen from users
          const selectedProject = useDisplayStore.projectSelection
          const dt = new Date()
          const sourceNames = this.form.feedback.source
          const sourceIds = usePerson.withAllRecursive().where('Fullname', sourceNames).get().map(item => item.id)
          //for(const person of sources){
              const personProject = usePersonProject
                                      .where('PersonId', sourceIds)
                                      .where('ProjectId', selectedProject.id)
                                      .get()
              //if(personProject.length == 1){      TODO:should this look like events
                if(!this.feedbackOriginal){
                  useFeedback.save({
                    PersonProjectId: personProject[0].id,
                    Type: this.form.feedback.type,
                    Role: this.form.feedback.role,
                    Use: this.form.feedback.use,
                    PainPoint: this.form.feedback.painpoint,
                    Datetime: dt
                  })
                }else{
                  useFeedback.save({
                    id: this.feedbackOriginal.id,
                    PersonProjectId: personProject[0].id,
                    Type: this.form.feedback.type,
                    Role: this.form.feedback.role,
                    Use: this.form.feedback.use,
                    PainPoint: this.form.feedback.painpoint,
                    Datetime: dt
                  })
                }
              /*} else {
                console.log(`ERROR: contact ${person} had ${personProject.length} projects`)
              }*/
          //}
          this.initializeFormValues();
          this.$bvModal.hide('feedback-modal');
      }
    }
}


</script>