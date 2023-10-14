import { Model } from 'pinia-orm'

export default class Account extends Model {
  static entity = 'Account'
  static fields () {
    return {
      id: this.uid(),
      Fullname: this.string("")
    }
  }
}