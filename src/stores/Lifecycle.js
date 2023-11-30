import { Model } from 'pinia-orm';
import { ArrayCast } from 'pinia-orm/casts';

import { Project } from '@/stores/Project.js';
import { StepStatus } from './PersonProject';


export class Lifecycle extends Model {
  static entity = 'Lifecycle'
  static fields () {
    return {
      id: this.uid(),
      Name: this.string('').notNullable(),
      Projects: this.hasMany(Project, 'LifecycleId'),                  
      LifecycleStep: this.hasMany(LifecycleStep, 'LifecycleId')        
    }
  }
  get lifecycleFull(){
    const lifecycle = {
      id: this.id,
      Name: this.Name,
      Projects: this.Projects,
      LifecycleStep: sortSteps(this.LifecycleStep, 'Order')
    } 
    return lifecycle
  }
}


export class LifecycleStep extends Model {
  static entity = 'LifecycleStep'
  static fields () {
    return {
      id: this.uid(),
      LifecycleId: this.attr(null),              
      Lifecycle: this.belongsTo(Lifecycle, 'LifecycleId'),
      StepStatus: this.hasMany(StepStatus, 'LifecycleStepId'),
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



function sortSteps(arrSteps, key){
  //Sort array of steps by their order
  const newArray = arrSteps.sort((a,b) => a[key]- b[key])
  newArray.forEach((part,idx,arr)=>{
    arr[idx][key] = idx
  })
  return newArray
}