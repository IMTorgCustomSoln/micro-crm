// Post Model
import { Model } from 'pinia-orm'
import User from './User'

export default class Post extends Model {
  static entity = 'posts'

  // `this.belongsTo(...)` declares this post belongs to a user. The first
  // argument is the `User` model class. The second is the field name for
  // the foreign key `userId`.
  static fields () {
    return {
      id: this.uid(),
      userId: this.attr(null),
      title: this.string(''),
      body: this.string(''),
      published: this.boolean(false),
      author: this.belongsTo(User, 'userId')
    }
  }
}