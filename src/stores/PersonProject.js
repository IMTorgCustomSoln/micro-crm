import { Model } from 'pinia-orm';
import { DateCast } from 'pinia-orm/casts';

import {Person} from '@/stores/Person';
import {Project} from '@/stores/Project'
import {Event, PersonProjectEvent} from '@/stores/Event';
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


export class PersonProject extends Model {
  static entity = 'PersonProject'
  //static primaryKey = ['PersonId', 'Person', 'Project']
  static fields(){
      return{
          id: this.uid(),
          PersonId: this.attr(null),
          Person: this.belongsTo(Person, 'PersonId'),
          ProjectId: this.attr(null),
          Project: this.belongsTo(Project, 'ProjectId'),
          RefId: this.attr(null),
          ReferredBy: this.belongsTo(Person, 'RefId'),
          //CurrentLifecycleStep: this.string(""),
          //LifecycleStepIds: this.attr([]),
          StepStatus: this.hasMany(StepStatus, 'PersonProjectId'),
          // collections
          //Events: this.hasMany(Event, 'EventId'),
          //Events: this.hasMany(PersonProjectEvent, 'PersonProjectId'),
          Events: this.belongsToMany(Event, PersonProjectEvent, 'PersonProjectId', 'EventId'),
          Feedback: this.hasMany(Feedback, 'PersonProjectId'),
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
  get contactProjectFull(){
    if(this.Person.IsContact==false){
      return null
    }
    return this
  }
}


export class StepStatus extends Model {
static entity = 'StepStatus'
static fields () {
  return {
    id: this.uid(),
    PersonProjectId: this.attr(null),
    Project: this.belongsTo(PersonProject, 'PersonProjectId'),
    LifecycleStepId: this.attr(),
    LifecycleStep: this.belongsTo(LifecycleStep, 'LifecycleStepId'),
    CompletionDate: this.attr(),
  }
}
static casts(){
  return {
    CompletionDate: DateCast
  }
}
}