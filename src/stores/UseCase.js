import { Model } from 'pinia-orm';
import { StringCast } from 'pinia-orm/casts';


export class UseCase extends Model {
    static entity = 'UseCase'
    static fields(){
        return{
            id: this.uid(),
            Role: this.attr(),
            Use: this.attr(),
            PainPoint: this.attr()
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