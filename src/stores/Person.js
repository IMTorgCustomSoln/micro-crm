import { Model } from 'pinia-orm'
import { StringCast } from 'pinia-orm/casts'
import { PersonProjectStatus } from '@/stores/PersonProjectStatus'


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
      PersonProjectStatus: this.hasMany(PersonProjectStatus, 'PersonId'),   //insert with ReferredBy for selected Project
      // collect with repos
      //ReferencesGiven: this.hasMany(PersonProjectStatus , 'RefId'),
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
  get personFull(){
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
}