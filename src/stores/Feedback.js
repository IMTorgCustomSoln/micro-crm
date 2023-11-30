import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';

import { PersonProject } from './PersonProject';
import { isEmpty } from '@/assets/utils';


export class Feedback extends Model {
    static entity = 'Feedback'
    static fields(){
        return{
            id: this.uid(),
            PersonProjectId: this.attr(null),
            PersonProject: this.belongsTo(PersonProject, 'PersonProjectId'),
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
    get feedbackFull(){
        if(isEmpty(this.PersonProject)){
            throw `ERROR: must query using 'useFeedback.withAll().get()' to 
                    ensure all fields are populated`
        }
        const feedback = {
            id: this.id,
            Date: this.Datetime,
            Type: this.Type,
            PainPoint: this.PainPoint,
            Project: this.PersonProject,
            Role: this.Role,
            Use: this.Use,
            Source: this.PersonProject
        }
        return feedback
    }
}