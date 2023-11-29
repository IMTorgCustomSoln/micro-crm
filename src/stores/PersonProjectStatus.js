import { Model } from 'pinia-orm';
import { DateCast } from 'pinia-orm/casts';

import {Person} from '@/stores/Person';
import {Project} from '@/stores/Project'
import {PersonProjectStatusEvent} from '@/stores/Event';
import {Feedback} from '@/stores/Feedback.js';
import { LifecycleStep } from './Lifecycle';

import { isEmpty } from '@/assets/utils'
import {
  useDisplayStore, 
  useLifecycleStep, 
  usePerson, 
  usePersonProject, 
  useEvent, 
  useFeedback
} from '@/main';


export class PersonProjectStatus extends Model {
  static entity = 'PersonProjectStatus'
  //static primaryKey = ['PersonId', 'Person', 'Project']
  static fields(){
      return{
          id: this.uid(),
          PersonId: this.attr(null),
          //PersonId: this.attr(null),
          //Person: this.belongsTo(Person, 'PersonId'),
          ProjectId: this.attr(null),
          Project: this.belongsTo(Project, 'ProjectId'),
          RefId: this.attr(null),
          ReferredBy: this.belongsTo(Person, 'RefId'),
          //CurrentLifecycleStep: this.string(""),
          //LifecycleStepIds: this.attr([]),
          StepStatus: this.hasMany(StepStatus, 'ProjectId'),
          // collections
          //Events: this.hasMany(Event, 'EventId'),
          Events: this.hasMany(PersonProjectStatusEvent, 'PersonProjectStatusId'),
          Feedback: this.hasMany(Feedback, 'UseCaseId'),
      }
  }
  static mutators(){
    return {
      Step:{
        get: () => {
          //get the most-recent of LifecycleSteps: TODO: how ???
          //if(useDisplayStore.project.availableStatus.includes(value)){
            return value
        }
      }
    }
  }
  get personProjectFull(){
    const contacts = []
    let person = {
      id: this.id,
      Fullname: this.Fullname,
      Title: this.Title,
      Email: this.Email,
      Number: this.Number,
      Office: this.Office,
      Firm: this.Office,
    }
    const prjGroups = JSON.parse( JSON.stringify( usePersonProject.withAll().where('PersonId', this.id).get() ))
    if(!isEmpty(prjGroups)){
      const personPrjId = prjGroups
          let referredBy = null
          const referralGiven = []
          const projects = []
          let statuses = ''
          let prjs_cnt = 0
          let event_cnt = 0
          let feedback_cnt = 0
          for(const item of prjGroups[personPrjId]){
            //references given
            const peopleIdsReferredByThisPerson = usePersonProject.withAll().where('RefId', item.PersonId).get().map(item => item.PersonId)
            const names = usePerson.where('id', peopleIdsReferredByThisPerson).get().map(item => item.Fullname)
            referralGiven.push(...names)

            //checks
            const checkSelection = !isEmpty(useDisplayStore.projectSelection)
            const checkPrj = checkSelection ? item.ProjectId == useDisplayStore.projectSelection.id : true
            if(checkPrj){
              if(checkSelection){
                //referred by
                referredBy = item.ReferredBy

                //references given
                const peopleIdsReferredByThisPerson = usePersonProject.withAll().where('ProjectId', item.ProjectId).where('RefId', item.PersonId).get().map(item => item.PersonId)
                const names = usePerson.where('id', peopleIdsReferredByThisPerson).get().map(item => item.Fullname)
                referralGiven.length = 0
                referralGiven.push(...names)

                //current status
                const mxDate = new Date(Math.max(...item.StepStatus.map(e => new Date(e.CompletionDate) )))
                const currentStatus = item.StepStatus.filter(e => +new Date(e.CompletionDate) == +mxDate)[0]
                const lcStepName = useLifecycleStep.find(currentStatus.LifecycleStepId).Name
                /*use to keep status of all projects
                const prjName = item.Project.Name.toString()
                const rec = {}
                rec[prjName] = lcStepName
                statuses.push(rec)*/
                statuses = lcStepName
              }
              //projects
              /*const rec = {}
              rec['id'] = item.Project.id
              rec['Name'] = item.Project.Name*/
              projects.push(item.Project.Name)

              //attrs
              prjs_cnt = prjs_cnt + 1
              event_cnt = item.pivot ? event_cnt + useEvent.withAll().where('id', item.pivot.EventId).get().length: event_cnt
              feedback_cnt = item ? feedback_cnt + useFeedback.withAll().where('PersonProjectId', item.id).get().length: feedback_cnt
            }
          }
          person['id']
          person['PersonProjectStatus']
          person['ReferredBy'] = referredBy ?  referredBy.Fullname : null
          person['Statuses'] = statuses
          person['Projects'] = projects
          person['ProjectCnt'] = prjs_cnt
          person['References'] = referralGiven.length
          person['Events'] = event_cnt
          person['Feedback'] = feedback_cnt
          if(person['ProjectCnt']>0){
            contacts.push(person)
          }
        }
        return contacts
      }

}


export class StepStatus extends Model {
static entity = 'StepStatus'
static fields () {
  return {
    id: this.uid(),
    ProjectId: this.attr(null),
    LifecycleStepId: this.attr(),
    LifecycleStep: this.belongsTo(LifecycleStep, 'LifecycleStepId'),
    CompletionDate: this.attr(),
  }
}
static casts(){
  return {
    StartDate: DateCast,
    EndDate: DateCast,
  }
}
}