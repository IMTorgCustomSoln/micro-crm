import {
    useDisplayStore, 
    useAccount, 
    useLifecycle, 
    useLifecycleStep, 
    useProject, 
    usePersonProject
} from '@/main.js';


import * as dataAccount from '@/tests/data/account'
import * as dataProjects from '@/tests/data/projects'
import * as dataContacts from '@/tests/data/contacts'


export function populateLifecycleTestData(useLifecycle){
    const check1 = useLifecycle.all()[0].Name == "default"
    console.log(`check-1 useLifecycle: ${check1}`)
}

export function populateAccountTestData(useAccount){
    const {account} = dataAccount
    useAccount.save(account)

    const check1 = useAccount.all()[0].Fullname == "John Doe"
    console.log(`check-1 useAcccount: ${check1}`)
}

export function populateProjectTestData(useProject){
    const {projects} = dataProjects
    useProject.save(projects)

    const check1 = useProject.all().length == 2
    console.log(`check-1 useProject: ${check1}`)
}
export function populateContactTestData(usePerson){
    const {contacts} = dataContacts
    usePerson.save(contacts)

    const check1 = usePerson.all().length == 5
    console.log(`check-1 usePerson: ${check1}`)
}
export function populateEventTestData(useEvent, usePersonProject, usePerson){

}
export function populateFeedbackTestData(useFeedback, usePersonProject, usePerson){

}