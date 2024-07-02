import { Model } from 'pinia-orm';
import { StringCast, DateCast } from 'pinia-orm/casts';
import { useDisplayStore, usePersonProject, usePerson } from '@/main';
import { Lifecycle } from './Lifecycle';
import { PersonProject } from './PersonProject';


export class Project extends Model {
  static entity = 'Project'
  //static primaryKey = ['id', 'Name']
  static fields(){
    return {
      id: this.uid(),
      Name: this.string(''),
      Status: this.string(useDisplayStore.project.availableStatus[0]),    //different from PersonProject
      Category: this.string(""),
      StartDate: this.attr(null),
      EndDate: this.attr(null),
      LifecycleId: this.attr(null),
      Lifecycle: this.belongsTo(Lifecycle, 'LifecycleId'),      
      PersonProjectStatus: this.hasMany(PersonProject, 'ProjectId'),
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
  static saved (model) {
    /*Initialize non-contact Person, such as 'user-account' for: 
        - Events without contacts
        - ReferredBy the user, only
        - ...
    */
    const personList = usePerson.all().filter(item => item.IsContact==false)
    if(personList.length==1){
      const newProject = {
        ProjectId: model.id,
        StepStatus:[]
      }
      const person = JSON.parse(JSON.stringify( personList[0] ))
      person.PersonProject = []
      person.PersonProject.push( newProject )
      usePerson.save(person)
    } else if(personList.length==0){
      usePerson.save({
        id: 'user-account',
        Fullname: 'USER ACCOUNT',
        IsContact: false,
        PersonProject: [{
          ProjectId: model.id,
          StepStatus:[]
        }]
      })
    } else {
      throw new Error("personList with id: 'user-account'is greater than 1")
    }
  }
  get projectFull () {
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
    const contacts = usePerson.all()
                      .map(item => item.contactLimited)
                      .filter(item => item!=null)
                      .map(item => item.id)
    const peoplePerProject = usePersonProject
                              .where('PersonId', contacts)
                              .withAll()
                              .groupBy('ProjectId')
                              .get()
    //const peoplePerProject = usePersonProject.withAll().groupBy('ProjectId').get()
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