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




// Contacts
export const testContacts = []
var i = 0;
while(i < 10){
    const contact = {
        Fullname: faker.person.fullName(),
        Title: faker.person.jobTitle(),
        Email: faker.internet.email(),
        Number: faker.phone.number(),
        Office: faker.commerce.department(),
        Firm: faker.company.name(),
        Projects:'',
      }
    testContacts.push(contact)
    i++
}




// Projects
export const testProjects = []
i = 0;
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