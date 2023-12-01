import {faker} from '@faker-js/faker';
import {addDays, randomIntFromInverval} from './utils.js';
import {useDisplayStore, useAccount, useLifecycle, useLifecycleStep, useProject, usePersonProject} from '@/main.js';
import {defaultSteps, defaultLifecycle} from './defaults.js';


// set for repeatable results
faker.seed(123);


// Account
const testAccount = {
    Fullname: faker.person.fullName()
}


// Projects
export const testProjects = []
var i = 0;
while(i < 2){
    const dtBegin = faker.date.betweens({from: '2020-01-01T00:00:00.000Z', to:'2023-01-01T00:00:00.000Z', count:1})[0]
    const dtEnd = addDays(dtBegin, randomIntFromInverval(100, 200, faker))
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
while(i < 5){
    const projects = randomIntFromInverval(0, testProjects.length-1, faker)
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
    const numberOfEvents = randomIntFromInverval(1,5, faker)
    const Events = []
    let j = 0
    while(j < numberOfEvents){
        const Event = {
            LifecycleStep: defaultSteps[randomIntFromInverval(0, 3, faker)].Name,
            Participants: [contact.Fullname],
            Datetime: new Date(),
            Comments: faker.lorem.paragraph(),
        }
        Events.push(Event)
        j++
    }
    const numberOfFeedbacks = randomIntFromInverval(2, 3, faker)
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
        const chooseFromContacts = randomIntFromInverval(0, testContacts.length-1, faker)
        referredBy = testContacts[chooseFromContacts]
    } else {
        referredBy = faker.person.fullName()
    }

    // Statuses
    //   i) ~~earlier steps must be completed, ~~
    //   ii) ~~initialization with step-0, has CompletionDate of begining of project,~~
    //   iii)~CompletionDate of step-1 implies the start date of step-2
    const finalStepIdx = randomIntFromInverval(0, defaultSteps.length-1, faker)
    const arrSteps = Array(finalStepIdx).fill().map((element, index) => index + 1)
    arrSteps.unshift(0)
    const dt = new Date()
    const StepStatuses = []
    for(const idx of arrSteps){
        //const step = defaultSteps[idx]
        const date = addDays(dt, idx*10)
        const rec = {
            LifecycleStepId: '',
            CompletionDate: date
        }
        StepStatuses.push(rec)
    }
    const status = {
        Person: contact.Fullname,
        Project: contact.Projects[0],
        ReferredBy: '',     //TODO:applying referredBy errors
        StepStatus: StepStatuses,
        Events: Events,
        Feedbacks: Feedbacks
    }
    //TODO:get steps earlier in lifecycle
    contact.Statuses.push(status)
    testContacts.push(contact)
    i++
}


// Lifecycle Data (same as demo.js)
export function populateLifecycleTestData(useLifecycle){
    const check1 = useLifecycle.all()[0].Name == "default"
    console.log(`check-1 useLifecycle: ${check1}`)
}

// Populate Data
export function populateAccountTestData(useAccount){
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
        const randInt = randomIntFromInverval(0, projects.length-1, faker)
        const project = projects[randInt]

        //get random person for referredby
        const persons = usePerson.all()
        let refId = null
        if( persons.length > 0){
            const int = randomIntFromInverval(0, persons.length-1, faker)
            refId = persons[int].id
        }
        //get step
        const lc = useLifecycle.withAll().get()
        const selected_lc = lc.filter(item => item.id == project.LifecycleId)[0]
        const selected_step = selected_lc.LifecycleStep[randomIntFromInverval(0, selected_lc.LifecycleStep.length-1, faker)]
        
        //save
        const dt = faker.date.betweens({from: '2020-01-01T00:00:00.000Z', to:'2023-01-01T00:00:00.000Z', count:1})[0]
        const lcSteps = useLifecycleStep.all()
        contact.Statuses[0].StepStatus.map((item,idx) => item.LifecycleStepId = lcSteps[idx].id)
        /*
        usePersonProject.with('StepStatus').get()

        */
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
                StepStatus: contact.Statuses[0].StepStatus,
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
        const int = randomIntFromInverval(0, 2, faker)
        const Type = types[int]
        const Status = usePersonProject.all(int)[0]
        const person = usePerson.find(Status.StatusId)
        const dt = faker.date.betweens({from: '2020-01-01T00:00:00.000Z', to:'2023-01-01T00:00:00.000Z', count:1})[0]
        const datetime = new Date(dt)
        useFeedback.save({
            PersonProjectId: Status.id,    //TODO: this should be personProject.id
            Type: Type,
            Role: person.Title,
            Use: faker.lorem.lines(1,3),
            PainPoint: faker.lorem.lines(1,3),
            Datetime: datetime.toString()
        })
    }
}