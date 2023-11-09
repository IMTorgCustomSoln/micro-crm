import { defineStore } from 'pinia'


const statuses = ['Active', 'Stand By', 'Delayed', 'Testing-Alpha', 'Testing-Beta', 'Review', 'Complete']

const DisplayStore = defineStore('display',{
    state: () => {
        return {
            //Global
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
                {value: '4', text: 'Event Summary', path:'EventReport'}

              ],
            projectSelection: {},

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
                event: ['Meeting', 'Building',],
                feedback: ['Feature', 'UseCase', 'Issue']
            }
        }
    }
})

export default DisplayStore