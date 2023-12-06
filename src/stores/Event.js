import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore, usePerson } from '@/main';
import { PersonProject } from '@/stores/PersonProject';
import { isEmpty, totalTimeBetweenDates } from '@/assets/utils';


export class Event extends Model {
  static entity = 'Event'
  static fields(){
      return{
          id: this.uid(),
          PersonProject: this.belongsToMany(PersonProject, PersonProjectEvent, 'EventId', 'PersonProjectId'),    //user account initialized with Project, but with IsContact identifier so that it is only included in appropriate reports
          StartDatetime: this.attr(""),
          EndDatetime: this.attr(""),
          Type: this.string(""),    // Meeting, Building, ...
          AddressFeedback: this.attr(null),
          StepCompleted: this.attr(null),    //TODO:connect to Step??? most-current step, or specific step in lifecycle?
          Comments: this.string(""),
      }
  }
  static casts(){
      return {
        StartDatetime: DateCast,
        EndDatetime: DateCast,
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
      const persons = this.PersonProject.map(item => usePerson.find( item.PersonId ) )
      const startDatetime = new Date( Date.parse(this.StartDatetime) )
      const endDatetime = new Date( Date.parse(this.EndDatetime) )
      const timeLength = totalTimeBetweenDates('days', startDatetime, endDatetime)
      const event = {
        id: this.id,
        StartDatetime: startDatetime,
        EndDatetime: endDatetime,
        TimeLength: timeLength,
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

export class PersonProjectEvent extends Model {
  static entity = 'PersonProjectEvent'
  static primaryKey = ['PersonProjectId','EventId']
  static fields(){
    return {
      PersonProjectId: this.attr(null),
      EventId: this.attr(null)
    }
  }
}