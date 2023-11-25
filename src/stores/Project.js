import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore, useProject, usePersonProject } from '@/main';
import { Lifecycle } from './Lifecycle';


export class Project extends Model {
  static entity = 'Project'
  //static primaryKey = ['id', 'Name']
  static fields(){
    return {
      id: this.uid(),
      Name: this.string(''),
      Status: this.string(useDisplayStore.project.availableStatus[0]),    //different from PersonProjectStatus
      Category: this.string(""),
      StartDate: this.attr(null),
      EndDate: this.attr(null),
      LifecycleId: this.attr(null),
      Lifecycle: this.belongsTo(Lifecycle, 'LifecycleId'),
      Repos: this.string("")
    }
  }
  static casts(){
    return {
      Status: StringCast,
      Category: StringCast,
      StartDate: DateCast,
      EndDate: DateCast
    }
  }
  get projectList () {
    const project = {
      id: this.id,
      Name: this.Name,
      Status: this.Status,
      Category: this.Category,
      StartDate: this.StartDate,
      EndDate: this.EndDate,
      Lifecycle: this.Lifecycle,
      Repos: this.Repos
    }
    const peoplePerProject = usePersonProject.withAll().groupBy('ProjectId').get()
    project.Contacts = peoplePerProject[project.id]
    project.ContactCount = project.Contacts ? project.Contacts.length : 0
    project.StartDate = new Date(project.StartDate)
    project.EndDate = new Date(project.EndDate)
    return project
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