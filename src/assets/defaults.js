import {faker} from '@faker-js/faker';
import {addDays, randomIntFromInverval} from './utils.js';




// Lifecycle and Steps

let step_Prospect = {
    Name:'prospect',
    Order:0,
    Placeholder:[], 
    EmailForm: ``
}

let step_Lead = {
    Name:'lead', 
    Order:1, 
    Placeholder: [`<CONTACT_NAME>`, `<REFFERAL>`, `<PRODUCT_NAME>`, `<SELLER_NAME>`],
    EmailForm: `
<CONTACT_NAME>,

You were referred to me by <REFFERAL>, and I'd like to schedule you for a demo of the <PRODUCT_NAME> app.

Please let me know what time works best for you.

Respectfully,
<SELLER_NAME>
`}

let step_Onboarded =  {
    Name:'onboarded', 
    Order:2, 
    Placeholder: [`<CONTACT_NAME>`,`<PRODUCT_NAME>`, `<SELLER_NAME>`],
    EmailForm: `
<CONTACT_NAME>,

Thanks again for taking the time to try <PRODUCT_NAME>!  

If there is any problem or functionality that is unclear, please let me know.  I try to be
responsive to your needs.  Typically, we can have updates and fixes completed in a week.

Respectfully,
<SELLER_NAME>
`}

let step_Followup = {
    Name: 'followup',
    Order: 3, 
    Placeholder: [`<CONTACT_NAME>`,`<PRODUCT_NAME>`, `<SELLER_NAME>`],
    EmailForm:`
<CONTACT_NAME>,

Hi, I was wondering if you had a chance to try the <PRODUCT_NAME> tool and had an initial feelings?

Also, if you could provide the names of two other people who might be interested, please let me know
so that others can try it out.

Respectfully,
<SELLER_NAME>
`}

let step_Intention = {
    Name: 'intention',
    Order: 4, 
    Placeholder: [`<CONTACT_NAME>`,`<PRODUCT_NAME>`, `<SELLER_NAME>`],
    EmailForm:`
<CONTACT_NAME>,

Thanks for taking the time to try <PRODUCT_NAME>.  I'm hoping to get your feedback and your intention to using 
the product, in the future.

Respectfully,
<SELLER_NAME>
`}

export const defaultSteps = [
  step_Prospect,
  step_Lead,
  step_Onboarded,
  step_Followup,
  step_Intention
]

export const defaultLifecycle = {
    Name: 'default',
    LifecycleStep: []
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
        Lifecycle: defaultLifecycle.Name
    }
    testProjects.push(project)
    i++
}

// Contacts
export const testContacts = []
i = 0;
while(i < 10){
    const projects = randomIntFromInverval(0, testProjects.length-1) //TODO:add multiple projects
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
    const numberOfInteractions = randomIntFromInverval(1,5)
    const interactions = []
    let j = 0
    while(j < numberOfInteractions){
        const interaction = {
            LifecycleStep: defaultSteps[randomIntFromInverval(0,3)].Name,
            Datetime: new Date(),
            Comments: faker.lorem.paragraph(),
        }
        interactions.push(interaction)
        j++
    }
    const numberOfUseCases = randomIntFromInverval(2,3)
    const usecases = []
    j = 0
    while(j < numberOfUseCases){
        const usecase = {
            Role: faker.person.jobTitle(),
            Use: faker.lorem.sentence(),
            PainPoint: faker.lorem.sentence()
        }
        usecases.push(usecase)
        j++
    }
    const status = {
        Person: contact.Fullname,
        Project: contact.Projects[0],
        ReferredBy: faker.person.fullName(),
        CurrentLifecycleStep: defaultSteps[randomIntFromInverval(3,defaultSteps.length-1)].Name,
        Interactions: interactions,
        UseCases: usecases
    }
    contact.Statuses.push(status)


    testContacts.push(contact)
    i++
}


// Populate
export function populateProjectTestData(useProject){
    // Populate tables with test data
    for(const project of testProjects){
      useProject.save({
          Name: project.Name,
          Status: project.Status,
          Category: project.Category,
          StartDate: project.Startdate,
          EndDate: project.Enddate,
          Lifecycle: project.Lifecycle
        });
    }
}

export function populateContactTestData(usePerson){
    // Populate tables with test data
    for(const contact of testContacts){
      usePerson.save({
            Fullname: contact.Fullname,
            Title: contact.Title,
            Email: contact.Email,
            Number: contact.Number,
            Office: contact.Office,
            Firm: contact.Firm,
            Projects: contact.Projects,
            Statuses: contact.Statuses
      });
    }
  }



