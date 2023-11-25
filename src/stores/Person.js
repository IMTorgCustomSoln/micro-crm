import { Model } from 'pinia-orm'
import { StringCast } from 'pinia-orm/casts'
import { PersonProjectStatus } from '@/stores/PersonProjectStatus'
import { usePersonProject } from '@/main'
import { isEmpty } from '@/assets/utils'


export class Person extends Model {
  static entity = 'Person'
  static fields () {
    return {
      id: this.uid(),
      Fullname: this.string(""),
      Title: this.string(""),
      Email: this.string(""),
      Number: this.string(""),
      Office: this.string(""),
      Firm: this.string(""),
      //Projects: this.attr([""]),
      PersonProjectStatus: this.hasMany(PersonProjectStatus, 'StatusId'),   //insert with ReferredBy for selected Project
      // collect with repos
      //ReferencesGiven: this.hasMany(PersonProjectStatus , 'RefId'),
      //Events: this.hasMany(Event, 'ParticipantsId'),    
      //UseCases: this.hasMany(Interaction, 'ParticipantsId'),        
    }
  }
  static casts(){
    return {
      Fullname: StringCast,
      Title: StringCast,
      Email: StringCast,
      Number: StringCast,
      Office: StringCast,
      Firm: StringCast
    }
  }/*
  get personList(){
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
    const prjGroups = JSON.parse( JSON.stringify( usePersonProject.withAll().where('StatusId', this.id).get() ))
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
            const peopleIdsReferredByThisPerson = usePersonProject.withAll().where('RefId', item.StatusId).get().map(item => item.StatusId)
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
                const peopleIdsReferredByThisPerson = usePersonProject.withAll().where('ProjectId', item.ProjectId).where('RefId', item.StatusId).get().map(item => item.StatusId)
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
                statuses.push(rec)//
                statuses = lcStepName
              }
              //projects
              /*const rec = {}
              rec['id'] = item.Project.id
              rec['Name'] = item.Project.Name//
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
      }
    }
    return contacts
    
  }*/
}