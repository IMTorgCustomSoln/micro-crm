import { Model } from 'pinia-orm'
export default class Person extends Model {
  // entity is a required property for all models.
  static entity = 'Person'
  static piniaOptions = {
    persist: true,
  }
  // List of all fields (schema) of the post model. `this.string()` declares
  // a string field type with a default value as the first argument.
  // `this.uid()` declares a unique id if none provided.
  static fields () {
    return {
      id: this.uid(),
      Fullname: this.string(""),
      Title: this.string(""),
      Email: this.string(""),
      Number: this.string(""),
      Office: this.string(""),
      Firm: this.string(""),
      Projects: this.string("")
    }
  }
}