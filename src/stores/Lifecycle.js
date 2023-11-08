import { Model } from 'pinia-orm';
import { ArrayCast } from 'pinia-orm/casts';

import { Project } from '@/stores/Project.js';


export class Lifecycle extends Model {
  static entity = 'Lifecycle'
  static fields () {
    return {
      id: this.uid(),
      Name: this.string('').notNullable(),
      Projects: this.hasMany(Project, 'id'),
      LifecycleStep: this.hasMany(LifecycleStep, 'StepId')
    }
  }
}

export class LifecycleStep extends Model {
  static entity = 'LifecycleStep'
  static fields () {
    return {
      id: this.uid(),
      StepId: this.attr(null),
      Name: this.string('').notNullable(),
      DurationBizDays: this.number(),
      Order: this.number(),
      Placeholder: this.attr([]),
      EmailForm: this.string('')
    }
  }
  static casts () {
    return {
        Placeholder: ArrayCast
    }
  }
  get parsePlaceholder(){
    const ph = JSON.parse(this.Placeholder)
    return {
      id: this.id, 
      Name: this.Name,
      DurationBizDays: this.DurationBizDays,
      Order: this.Order, 
      Placeholder: ph, 
      EmailForm: this.EmailForm
    }
  }
}