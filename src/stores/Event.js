import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore } from '@/main';
import { PersonProjectStatus } from '@/stores/PersonProjectStatus';


export class Event extends Model {
  static entity = 'Event'
  static fields(){
      return{
          id: this.uid(),
          PersonProject: this.belongsToMany(PersonProjectStatus, PersonProjectStatusEvent, 'EventId', 'PersonProjectStatusId'),
          Datetime: this.attr(),
          Type: this.string(""),    // Meeting, Building, ...
          AddressFeedback: this.attr(),
          StepCompleted: this.attr(),
          Comments: this.string(""),
      }
  }
  static casts(){
      return {
        Datetime: DateCast,
        Comments: StringCast
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

export class PersonProjectStatusEvent extends Model {
static entity = 'PersonProjectStatusEvent'
static primaryKey = ['PersonProjectStatusId','EventId']
static fields(){
  return {
    PersonProjectStatusId: this.attr(null),
    EventId: this.attr(null)
  }
}
}