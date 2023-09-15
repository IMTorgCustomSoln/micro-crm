import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore } from '@/main';
import { UseCase } from '@/stores/UseCase.js';


export class PersonProjectStatus extends Model {
    static entity = 'Status'
    static primaryKey = ['id', 'Person', 'Project']
    static fields(){
        return{
            id: this.uid(),
            Person: this.string("<name>"),
            Project: this.string("<name>"),
            ReferredBy: this.string(""),
            CurrentLifecycleStep: this.string(""),
            Interactions: this.hasMany(Interaction, 'InteractionId'),
            UseCases: this.hasMany(UseCase, 'UseCaseId'),
        }
    }
}


export class Interaction extends Model {
    static entity = 'Interaction'
    static fields(){
        return{
            id: this.uid(),
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