import { Model } from 'pinia-orm'
import { PersonProjectStatus } from '@/stores/PersonProjectStatus';


export default class Person extends Model {
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
      Projects: this.attr([""]),
      Statuses: this.hasMany(PersonProjectStatus , 'StatusId')
    }
  }
}