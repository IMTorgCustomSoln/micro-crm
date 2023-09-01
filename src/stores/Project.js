import { Model } from 'pinia-orm'
export default class Project extends Model {
  // entity is a required property for all models.
  static entity = 'Project'
  static piniaOptions = {
    persist: true,
  }
  // List of all fields (schema) of the post model. `this.string()` declares
  // a string field type with a default value as the first argument.
  // `this.uid()` declares a unique id if none provided.
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