import { arraysEqual, removeItemOnce } from './utils';

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
import * as dataEvents from '@/tests/data/events'
import * as dataFeedbacks from '@/tests/data/feedback'




export function populateLifecycleTestData(useLifecycle){
    const check1 = useLifecycle.all()[0].Name == "default"
    console.log(`check-1 useLifecycle: ${check1}`)
}

export function populateAccountTestData(useAccount){
    const {account} = dataAccount
    useAccount.save(account)

    const check1 = useAccount.all()[0].Fullname == "John Doe"
    const check2 = arraysEqual( Object.keys(useAccount.all()[0]), Object.keys(account) )
    console.log(`check-1 useAcccount: ${check1}`)
    console.log(`check-2 useAcccount: ${check2}`)
}

export function populateProjectTestData(useProject, usePerson){
    const {projects} = dataProjects
    useProject.save(projects)

    const projectList = useProject.withAll().get().map(item => item.projectFull)
    const personList = usePerson.all()
    const check1 = projectList.length == 2
    const check2 = arraysEqual( Object.keys(useProject.all()[0]).sort(), Object.keys(projects[0]).sort() )
    const check3 = personList.length == personList.map(item => item.IsContact==false).length
    console.log(`check-1 useProject: ${check1}`)
    console.log(`check-2 useProject: ${check2}`)
    console.log(`check-3 usePerson: ${check3}`)
}

export function populateContactTestData(usePerson){
    const {contacts} = dataContacts
    usePerson.save(contacts)

    const personList = usePerson.all().map(item => item.contactLimited).filter(item => item!=null)
    const check1 = personList.length == 5
    const conctactKeys = removeItemOnce(Object.keys(usePerson.all()[0]), 'IsContact').sort()
    const check2 = arraysEqual( conctactKeys, 
                                Object.keys(contacts[0]).sort() 
                                )
    const projectList = useProject.withAll().get().map(item => item.projectFull)
    const check3 = projectList[0].ContactCount == 2 && projectList[1].ContactCount == 3
    console.log(`check-1 usePerson: ${check1}`)
    console.log(`check-2 usePerson: ${check2}`)
    console.log(`check-3 useProject: ${check3}`)
}
export function populateEventTestData(useEvent, usePerson){
    const {events} = dataEvents
    //add ids to `user-account` events
    const userAccountPersonProject = usePerson.withAllRecursive().get()
                                        .filter(item => item.id == 'user-account')
                                        .map(item => item.PersonProject)[0]
                                        .filter(item => item.ProjectId == 'IP8fjeI0OXuR66QXq0t4t')[0]
    for(const event of events){
        if(event.PersonProject.length == 0){
            event.PersonProject.push({ id: userAccountPersonProject.id})
        }
    }
    useEvent.save(events)

    
    //TODO: this isn't working, but is that a problem???  const eventList = useEvent.withAllRecursive().get().map(item => item.eventFull)
    const eventList = useEvent.withAll().get().map(item => item.eventFull)
    const eventFields = ['AddressFeedback', 'Comments', 'StartDatetime', 'EndDatetime', 'PersonProject', 'StepCompleted', 'Type', 'id']
    const check1 = eventList.length == 4
    const check2 = arraysEqual( Object.keys(useEvent.all()[0]).sort(), eventFields.sort())
    console.log(`check-1 useEvent: ${check1}`)
    console.log(`check-2 useEvent: ${check2}`)
}
export function populateFeedbackTestData(useFeedback){
    const {feedbacks} = dataFeedbacks
    useFeedback.save(feedbacks)

    
    const feedbackList = useFeedback.withAll().get().map(item => item.feedbackFull)
    const check1 = feedbackList.length == 2
    const check2 = arraysEqual( Object.keys(useFeedback.all()[0]).sort(), Object.keys(feedbacks[0]).sort() )
    console.log(`check-1 useFeedback: ${check1}`)
    console.log(`check-2 useFeedback: ${check2}`)
}
export function populatePersonProject(usePersonProject, usePerson, useDisplayStore){
    const contactProjectList = usePersonProject.withAll().get()
                                .map(item => item.contactProjectFull)
                                .filter(item => item!=null)
    useDisplayStore.projectSelection = contactProjectList[0].Project
    const contactSelectedProjectList = usePerson.withAll().get()
                                        .map(item => item.contactWithSelectedProject)
                                        .filter(item => item != undefined)
    const contactAllProjectList = usePerson.withAll().get()
                                    .map(item => item.contactWithProjectFull)
                                    .filter(item => item!=null)
    
    const check1 = contactProjectList.length == 5
    const check2 = contactSelectedProjectList.length == 2
    const check3 = contactAllProjectList.length == 5
    console.log(`check-1 usePersonProject: ${check1}`)
    console.log(`check-2 usePerson: ${check2}`)
    console.log(`check-3 usePerson: ${check3}`)
}