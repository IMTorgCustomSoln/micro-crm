import { Model } from 'pinia-orm'
export default class Project extends Model {
  static entity = 'Project'
  static fields () {
    return {
      id: this.uid(),
      Name: this.string(""),
      Status: this.string(""),
      Category: this.string(""),
      StartDate: this.string(""),
      EndDate: this.string(""),
      Lifecycle: this.string("")
    }
  }
}