

// Lifecycle and Steps

let step_Initialize = {
    Name:'initialize',
    DurationBizDays: 0,
    Order:0,
    Placeholder:[], 
    EmailForm: ``
}

let step_Prospect = {
    Name:'prospect',
    DurationBizDays: 3,
    Order:1,
    Placeholder:[], 
    EmailForm: ``
}

let step_Lead = {
    Name:'lead',
    DurationBizDays: 7, 
    Order:2, 
    Placeholder: [`<CONTACT_FULLNAME>`, `<CONTACT_REFERREDBY>`, `<PRODUCT_NAME>`, `<ACCOUNT_FULLNAME>`],
    EmailForm: `
<CONTACT_FULLNAME>,

You were referred to me by <CONTACT_REFERREDBY>, and I'd like to schedule you for a demo of the <PRODUCT_NAME> app.

Please let me know what time works best for you.

Respectfully,
<ACCOUNT_FULLNAME>
`}

let step_Onboarded =  {
    Name:'onboarded',
    DurationBizDays: 14, 
    Order:3, 
    Placeholder: [`<CONTACT_FULLNAME>`,`<PRODUCT_NAME>`, `<ACCOUNT_FULLNAME>`],
    EmailForm: `
<CONTACT_FULLNAME>,

Thanks again for taking the time to try <PRODUCT_NAME>!  

If there is any problem or functionality that is unclear, please let me know.  I try to be
responsive to your needs.  Typically, we can have updates and fixes completed in a week.

Respectfully,
<ACCOUNT_FULLNAME>
`}

let step_Followup = {
    Name: 'followup',
    DurationBizDays: 7,
    Order: 4, 
    Placeholder: [`<CONTACT_FULLNAME>`,`<PRODUCT_NAME>`, `<ACCOUNT_FULLNAME>`],
    EmailForm:`
<CONTACT_FULLNAME>,

Hi, I was wondering if you had a chance to try the <PRODUCT_NAME> tool and had an initial feelings?

Also, if you could provide the names of two other people who might be interested, please let me know
so that others can try it out.

Respectfully,
<ACCOUNT_FULLNAME>
`}

let step_Intention = {
    Name: 'intention',
    DurationBizDays: 14,
    Order: 5, 
    Placeholder: [`<CONTACT_FULLNAME>`,`<PRODUCT_NAME>`, `<ACCOUNT_FULLNAME>`],
    EmailForm:`
<CONTACT_FULLNAME>,

Thanks for taking the time to try <PRODUCT_NAME>.  I'm hoping to get your feedback and your intention to using 
the product, in the future.

Respectfully,
<ACCOUNT_FULLNAME>
`}

export const defaultSteps = [
  step_Initialize,
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