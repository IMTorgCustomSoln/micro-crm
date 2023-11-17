import { defineStore } from 'pinia'


const statuses = ['Active', 'Stand By', 'Delayed', 'Testing-Alpha', 'Testing-Beta', 'Review', 'Complete']

const DisplayStore = defineStore('display',{
    state: () => {
        return {
            //Global
            enableAdmin: true,
            populateDefault: true,
            populateTestData: true,
            viewCount: 0,
            viewSelection: {value: '1', text: 'Project', path:'ProjectPage'},
            options:[
                //NavbarTop.vue
                {value: '1', text: 'Project', path:'ProjectPage'},
                {value: '2', text: 'Contact', path:'ContactPage'},
                {value: '3', text: 'Lifecycle', path:'LifecyclePage'},

                //Sidebar.vue
                {value: '4', text: 'Event Summary', path:'EventReport'},
                {value: '5', text: 'Next Steps', path:'NextStepsReport'}

              ],

            //User-specified
            projectSelection: {},
            participants: [],

            //Project
            project: {
                initialCategory: 'Software',
                initialStatus: statuses[1],
                initialStartDate: new Date(), 
                initialLifecycle: 'default',
                availableCategory: ['Software', 'Hardware'],
                availableStatus: statuses
            },

            //Defaults
            defaults: {
                event: ['Message Receieved', 'Meeting', 'Developing', 'Planning', 'Presenting', 'TODO', 'Milestone'],
                feedback: ['Feature', 'UseCase', 'Issue']
            }
        }
    }
})

export default DisplayStore