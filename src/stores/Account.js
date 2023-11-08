import { Model } from 'pinia-orm'

export class Account extends Model {
  static entity = 'Account'
  static fields () {
    return {
      id: this.uid(),
      Fullname: this.string("")
    }
  }
}