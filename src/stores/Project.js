import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore } from '@/main';

export default class Project extends Model {
  static entity = 'Project'
  static primaryKey = ['id', 'Name']
  static fields(){
    return {
      id: this.uid(),
      Name: this.string("<name>"),
      Status: this.string(useDisplayStore.project.availableStatus[0]),
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
          if(useDisplayStore.project.availableStatus.includes(value)){
            return value
          }
        }
      }
    }
  }
}