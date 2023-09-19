import { Model } from 'pinia-orm';
import { Interaction } from '@/stores/Interaction';
import { UseCase } from '@/stores/UseCase.js';


export class PersonProjectStatus extends Model {
    static entity = 'Status'
    //static primaryKey = ['StatusId', 'Person', 'Project']
    static fields(){
        return{
            id: this.uid(),
            StatusId: this.attr(null),
            Person: this.string("<name>"),
            Project: this.string("<name>"),
            ReferredBy: this.string(""),
            CurrentLifecycleStep: this.string(""),
            Interactions: this.hasMany(Interaction, 'InteractionId'),
            UseCases: this.hasMany(UseCase, 'UseCaseId'),
        }
    }
}