import { Model } from 'pinia-orm'
import { StringCast } from 'pinia-orm/casts'
import { PersonProject } from '@/stores/PersonProject'

import { isEmpty } from '@/assets/utils'
import {
  useDisplayStore, 
  useLifecycleStep, 
  usePerson, 
  usePersonProject, 
  useEvent, 
  useFeedback
} from '@/main';


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
      PersonProject: this.hasMany(PersonProject, 'PersonId'),   //insert with ReferredBy for selected Project
      // collect with repos
      ReferencesGiven: this.hasMany(PersonProject , 'RefId'),
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
  }
  get personLimited(){
    const person = {
      id: this.id,
      Fullname: this.Fullname,
      Title: this.Title,
      Email: this.Email,
      Number: this.Number,
      Office: this.Office
    }
    return person
  }
  get referredBy(){
    let prjGroups = []
    //project selected => Name
    if(!isEmpty(useDisplayStore.projectSelection)){
      prjGroups = usePersonProject.withAll()
                          .where('PersonId', this.id)
                          .where('ProjectId', useDisplayStore.projectSelection.id)
                          .get()
      if(prjGroups.length==1){
        return prjGroups[0].ReferredBy
      }else{
        return null
      }
    //no project selected => count
    }else{
      prjGroups = usePersonProject.withAll()
                          .where('PersonId', this.id)
                          .get()
      if(prjGroups){
        return prjGroups.map(item => item.RefId).length
      }else{
        return null
      }
    }
  }
  get personWithSelectedProject(){
    //record
    const person = {
      id: this.id,
      Fullname: this.Fullname,
      Title: this.Title,
      Email: this.Email,
      Number: this.Number,
      Office: this.Office,
      Firm: this.Firm,
      //PersonProjectStatus: null,
      ReferredBy: this.referredBy,
      Statuses: null,
      Projects: null,
      ProjectCnt: null,
      ReferencesGiven: null,
      Events: null,
      Feedback: null,
    }
    //checks
    const isEmptyProject = isEmpty(useDisplayStore.projectSelection)
    const prjGroups = usePersonProject.withAll()
                        .where('PersonId', this.id)
                        .where('ProjectId', useDisplayStore.projectSelection.id)
                        .get()
    const isOneProjectGroup = prjGroups.length != 1
    if(isEmptyProject){
      return;
    }
    if(isOneProjectGroup){
      return;
    }
    person['Projects'] =  prjGroups
    //references given
    const peopleIdsReferredByThisPerson = usePersonProject.withAll()
                                            .where('ProjectId', useDisplayStore.projectSelection.id)
                                            .where('RefId', person.id)
                                            .get().map(item => item.PersonId)
    const names = usePerson.where('id', peopleIdsReferredByThisPerson).get().map(item => item.Fullname)
    person['ReferencesGiven'] = names.length
    //current status
    const mxDate = new Date(Math.max(...prjGroups[0].StepStatus.map(e => new Date(e.CompletionDate) )))
    const currentStatus = prjGroups[0].StepStatus.filter(e => +new Date(e.CompletionDate) == +mxDate)[0]
    const lcStepName = useLifecycleStep.find(currentStatus.LifecycleStepId).Name
    person['Statuses'] =lcStepName
    person['Events'] = prjGroups.map(function (item) { return this.acc += item.Events.length; }, { acc: 0 })[prjGroups.length - 1]
    person['Feedback'] = prjGroups.map(function (item) { return this.acc += item.Feedback.length; }, { acc: 0 })[prjGroups.length - 1]
    return person
  }
  get personWithProjectFull(){
    //record
    const person = {
      id: this.id,
      Fullname: this.Fullname,
      Title: this.Title,
      Email: this.Email,
      Number: this.Number,
      Office: this.Office,
      Firm: this.Firm,

      //PersonProjectStatus: null,
      ReferredBy: this.referredBy,
      Statuses: null,

      Projects: null,
      ProjectCnt: null,
      ReferencesGiven: this.ReferencesGiven.length,
      Events: null,
      Feedback: null,
    }
    //all projects associated with person
    const prjGroups = usePersonProject.withAll().where('PersonId', this.id).get()
    if(!isEmpty(prjGroups)){
      person['Projects'] = prjGroups
      person['ProjectCnt'] = prjGroups.length
      person['Events'] = prjGroups.map(function (item) { return this.acc += item.Events.length; }, { acc: 0 })[prjGroups.length - 1]
      person['Feedback'] = prjGroups.map(function (item) { return this.acc += item.Feedback.length; }, { acc: 0 })[prjGroups.length - 1]
    }
    return person
  }
}