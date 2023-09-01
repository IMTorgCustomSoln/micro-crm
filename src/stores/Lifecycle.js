import { Model } from 'pinia-orm'
export class Lifecycle extends Model {
  // entity is a required property for all models.
  static entity = 'Lifecycle'
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
      Steps: this.string("")
    }
  }
}

export class LifecycleStep {
    constructor(Name, Order, EmailForm){
        this.Name = Name;
        this.Order = Order;
        this.EmailForm = EmailForm;
    }
}