<template>
    
    <h1>Feedback</h1>
    <div>
      <b-table
        striped hover small
        :items="feedbackList"
        :fields="fields"

        primary-key='id'
        responsive="sm" sticky-header="1000px"
        bordered
        thead-class="tableHead bg-dark text-white"
      >
      <template #cell(actions)="row">
        <span>
          <b-btn size="sm" @click="editFeedback(row)">Edit</b-btn>
          <b-btn size="sm" @click="deleteFeedback(row)">Delete</b-btn>
        </span>
      </template>
      </b-table>
      <ModalFeedback :feedback="form.feedback"/>
    </div>

</template>


<script>
import { useFeedback, usePerson } from '@/main';
import ModalFeedback from '../modals/ModalFeedback.vue';

export default{
    name: 'TableFeedback',
    components:{
      ModalFeedback
    },
    data(){
        return{
          fields: tableFields,
          form:{
            feedback:{}
          }
        }
    },
    computed:{
        feedbackList(){
          return useFeedback.withAllRecursive().get().map(item => item.feedbackFull)
        }
    },
    methods:{
      editFeedback(row){
        const feedback = JSON.parse(JSON.stringify(row)).item
        Object.assign(this.form.feedback, feedback)
        this.$bvModal.show('feedback-modal')
        console.log(row)
      },
      deleteFeedback(row){
        const feedback = JSON.parse(JSON.stringify(row)).item
        useFeedback.where('id', feedback.id).delete()
      },
      getDateString(date){
        return (new Date(date)).toDateString()
      },
      getProjects(personProject){
        //TODO:assuming that there is ONLY one project - is that true?
        const project = personProject.Project.Name
        return project
      },
      getSource(personProject){
        //TODO:assuming that there is ONLY one project - is that true?
        return personProject.Person.Fullname
      }
    }
}


const tableFields = [{
        key: 'Date',
        label: 'Date',
        sortable: true,
        formatter: "getDateString"
    }, {
        key: 'Type',
        label: 'Type',
        sortable: true
    }, {
        key: 'PainPoint',
        label: 'Pain Point',
        sortable: true
    }, {
        key: 'Project',
        label: 'Project',
        sortable: true,
        formatter: "getProjects"
    }, {
        key: 'Role',
        label: 'Role',
        sortable: true
    }, {
        key: 'Use',
        label: 'Use',
        sortable: true
      }, {
        key: 'Source',
        label: 'Source',
        sortable: true,
        formatter: "getSource"
    }, {
        key: 'actions',
        label: 'Actions'
    }
]


</script>