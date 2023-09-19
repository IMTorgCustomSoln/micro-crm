import { Model } from 'pinia-orm';
import { ArrayCast, StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore } from '@/main';


export class Interaction extends Model {
    static entity = 'Interaction'
    static fields(){
        return{
            id: this.uid(),
            InteractionId: this.attr(null),
            LifecycleStep: this.string(""),
            Participants: this.attr(),
            Datetime: this.attr(),
            Comments: this.string(""),
        }
    }
    static casts(){
        return {
          Participants: ArrayCast,
          Datetime: DateCast,
          Comments: StringCast
        }
    }
    static mutators(){
        return {
          Status:{
            set: (value) => {
              if(useDisplayStore.project.availableStatus.includes(value)){
                return value
              }
            }
          }
        }
      }
}