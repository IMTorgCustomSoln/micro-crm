import { Model } from 'pinia-orm';
import { DateCast } from 'pinia-orm/casts';

import {Person} from '@/stores/Person';
import {Project} from '@/stores/Project'
import {Event} from '@/stores/Event';
import {PersonProjectStatusEvent} from '@/stores/Event';
import {Feedback} from '@/stores/Feedback.js';
import { LifecycleStep } from './Lifecycle';


export class PersonProjectStatus extends Model {
  static entity = 'PersonProjectStatus'
  //static primaryKey = ['StatusId', 'Person', 'Project']
  static fields(){
      return{
          id: this.uid(),
          StatusId: this.attr(null),
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