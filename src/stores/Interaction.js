import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore } from '@/main';


export class Interaction extends Model {
    static entity = 'Interaction'
    static fields(){
        return{
            id: this.uid(),
            InteractionId: this.attr(null),
            LifecycleStep: this.string(""),
            Datetime: this.attr(),
            Comments: this.string(""),
        }
    }
    static casts(){
        return {
          Status: StringCast,
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