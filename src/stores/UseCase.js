import { Model } from 'pinia-orm';
import { StringCast } from 'pinia-orm/casts';


export class UseCase extends Model {
    static entity = 'UseCase'
    static fields(){
        return{
            id: this.uid(),
            UseCaseId: this.attr(null),
            Role: this.string(""),
            Use: this.string(""),
            PainPoint: this.string("")
        }
    }
    static casts(){
        return {
          Role: StringCast,
          Use: StringCast,
          PainPoint: StringCast
        }
    }
}