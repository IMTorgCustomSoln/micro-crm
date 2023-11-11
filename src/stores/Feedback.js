import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';

import { PersonProjectStatus } from './PersonProjectStatus';


export class Feedback extends Model {
    static entity = 'Feedback'
    static fields(){
        return{
            id: this.uid(),
            PersonProjectId: this.uid(),
            PersonProject: this.belongsTo(PersonProjectStatus, 'PersonProjectId'),
            Type: this.string(""),
            Role: this.string(""),
            Use: this.string(""),
            PainPoint: this.string(""),
            Datetime: this.attr()
        }
    }
    static casts(){
        return {
          Type: StringCast,
          Role: StringCast,
          Use: StringCast,
          PainPoint: StringCast,
          Datetime: DateCast
        }
    }
}