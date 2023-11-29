import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore, usePerson } from '@/main';
import { PersonProjectStatus } from '@/stores/PersonProjectStatus';
import { isEmpty } from '@/assets/utils';


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
    get eventFull(){
      if(isEmpty(this.PersonProject)){
        throw `ERROR: must query using 'useEvent.all()' to 
                ensure all fields are populated`
    }
      const persons = this.PersonProject.map(item => usePerson.find( item.StatusId ) )
      const event = {
        id: this.id,
        Date: new Date(this.Datetime),
        Type: this.Type,
        Project: this.PersonProject,
        Particpants: persons,
        StepCompleted: this.StepCompleted,
        AddressFeedback: this.AddressFeedback,
        Comments: this.Comments
      }
      return event
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