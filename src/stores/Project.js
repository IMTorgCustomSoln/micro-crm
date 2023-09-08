import { Model } from 'pinia-orm'
import { StringCast, DateCast } from 'pinia-orm/casts'

export default class Project extends Model {
  static entity = 'Project'
  static fields(){
    return {
      id: this.uid(),
      Name: this.string(""),
      Status: this.string(availableStatus[0]),
      Category: this.string(""),
      StartDate: this.attr(),
      EndDate: this.attr(),
      Lifecycle: this.string("")
    }
  }
  static casts(){
    return {
      Status: StringCast,
      Category: StringCast,

      StartDate: DateCast,
      EndDate: DateCast
    }
  }
  static mutators(){
    return {
      Status:{
        set: (value) => {
          if(availableStatus.includes(value)){
            return value
          }
        }
      }
    }
  }
}

// Constraints
export const availableStatus = ['Active', 'Delayed', 'Complete']
//const availableLifecycle = limit to available names