import {faker} from '@faker-js/faker';
import {addDays, randomIntFromInverval} from './utils.js';
import { useDisplayStore, useAccount, useLifecycle, useProject } from '@/main.js';
import { Feedback } from '@/stores/Feedback.js';
import {defaultSteps, defaultLifecycle} from './defaults.js';


// set for consistent results
faker.seed(123);


// Account
const testAccount = {
    Fullname: faker.person.fullName()
}


// Projects
export const testProjects = []
var i = 0;
while(i < 3){
    const dtBegin = faker.date.betweens({from: '2020-01-01T00:00:00.000Z', to:'2023-01-01T00:00:00.000Z', count:1})[0]
    const dtEnd = addDays(dtBegin, randomIntFromInverval(100,200))
    const project = {
        Name: faker.commerce.productName(),
        Status: 'active',
        Category: faker.commerce.product(),
        Startdate: new Date(dtBegin),
        Enddate: new Date(dtEnd),
        Lifecycle: defaultLifecycle.id,
        Repos: faker.internet.url()
    }
    testProjects.push(project)
    i++
}


// Contacts
export const testContacts = []
i = 0;
while(i < 10){
    const projects = randomIntFromInverval(0, testProjects.length-1)
    const contact = {
        Fullname: faker.person.fullName(),
        Title: faker.person.jobTitle(),
        Email: faker.internet.email(),
        Number: faker.phone.number(),
        Office: faker.commerce.department(),
        Firm: faker.company.name(),
        Projects: [testProjects[projects].Name],
        Statuses: []
    }
    const numberOfEvents = randomIntFromInverval(1,5)
    const Events = []
    let j = 0
    while(j < numberOfEvents){
        const Event = {
            LifecycleStep: defaultSteps[randomIntFromInverval(0,3)].Name,
            Participants: [contact.Fullname],
            Datetime: new Date(),
            Comments: faker.lorem.paragraph(),
        }
        Events.push(Event)
        j++
    }
    const numberOfFeedbacks = randomIntFromInverval(2,3)
    const Feedbacks = []
    j = 0
    while(j < numberOfFeedbacks){
        const Feedback = {
            Role: faker.person.jobTitle(),
            Use: faker.lorem.sentence(),
            PainPoint: faker.lorem.sentence()
        }
        Feedbacks.push(Feedback)
        j++
    }

    let referredBy = ''
    if(testContacts.length > 2){
        const chooseFromContacts = randomIntFromInverval(0,testContacts.length-1)
        referredBy = testContacts[chooseFromContacts]
    } else {
        referredBy = faker.person.fullName()
    }
    const status = {
        Person: contact.Fullname,
        Project: contact.Projects[0],
        ReferredBy: '',     //TODO:applying referredBy errors
        CurrentLifecycleStep: defaultSteps[randomIntFromInverval(3,defaultSteps.length-1)].Name,
        Events: Events,
        Feedbacks: Feedbacks
    }
    contact.Statuses.push(status)
    testContacts.push(contact)
    i++
}




// Populate Data
export function populateAccountTestData(useProject){
    // Populate tables with test data
      useAccount.save({
        Fullname: testAccount.Fullname,
        });
}

export function populateProjectTestData(useProject){
    const lifecycleId = useLifecycle.all()[0].id
    // Populate tables with test data
    for(const project of testProjects){
      useProject.save({
          Name: project.Name,
          Status: project.Status,
          Category: project.Category,
          StartDate: project.Startdate,
          EndDate: project.Enddate,
          LifecycleId: lifecycleId,
          Repos: project.Repos
        });
    }
}

export function populateContactTestData(usePerson, useProject){
    const projects = useProject.all()
    // Populate tables with test data
    for(const contact of testContacts){
        //get random project
        const randInt = randomIntFromInverval(0, projects.length-1)
        const project = projects[randInt]

        //get random person for referredby
        const persons = usePerson.all()
        let refId = null
        if( persons.length > 0){
            const int = randomIntFromInverval(0,persons.length-1)
            refId = persons[int].id
        }
        //get step
        const lc = useLifecycle.withAll().get()
        const selected_lc = lc.filter(item => item.id == project.LifecycleId)[0]
        const selected_step = selected_lc.LifecycleStep[randomIntFromInverval(0, selected_lc.LifecycleStep.length-1)]
        
        //save
        const dt = faker.date.betweens({from: '2020-01-01T00:00:00.000Z', to:'2023-01-01T00:00:00.000Z', count:1})[0]
        usePerson.save({
            Fullname: contact.Fullname,
            Title: contact.Title,
            Email: contact.Email,
            Number: contact.Number,
            Office: contact.Office,
            Firm: contact.Firm,
            PersonProjectStatus: [{
                ProjectId: project.id,
                RefId: refId,
                StepStatus: [{
                    LifecycleStepId: selected_step.id,
                    StatusDate: new Date(dt)
                }],
            }]
            // collect with repos
            //...TODO
      });
    }
  }

  export function populateEventTestData(useEvent, usePersonProjectStatus, usePerson){
    const Project = useProject.all()[0]
    const participants = usePerson.all().slice(0,3)
    const personprojects = []
    for(const person of participants){
        const selectedPersonProject = usePersonProjectStatus.where('StatusId', person.id).where('ProjectId', Project.id).get()
        if(selectedPersonProject.length>1){
            throw new Error('Project should be unique')
        }
        personprojects.push(...selectedPersonProject)
    }
    const dt = faker.date.betweens({from: '2020-01-01T00:00:00.000Z', to:'2023-01-01T00:00:00.000Z', count:1})[0]
    useEvent.save({
        PersonProject: personprojects,
        Datetime: new Date(dt),
        Type: 'Meeting',
        Comments: faker.lorem.lines(1,3),
    })

    return true
}

export function populateFeedbackTestData(useFeedback, usePersonProject, usePerson){
    const Feedbacks = [0,1,2,3]
    for(const idea of Feedbacks){
        const types = useDisplayStore.defaults.feedback
        const int = randomIntFromInverval(0,2)
        const Type = types[int]
        const Status = usePersonProject.all(int)[0]
        const person = usePerson.find(Status.StatusId)
        useFeedback.save({
            PersonProjectId: Status.id,
            Type: Type,
            Role: person.Title,
            Use: faker.lorem.lines(1,3),
            PainPoint: faker.lorem.lines(1,3)
        })
    }
}