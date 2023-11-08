import { defineStore } from 'pinia'

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
                initialStatus: 'Active',
                initialStartDate: new Date(), 
                initialLifecycle: 'default',
                availableCategory: ['Software', 'Hardware'],
                availableStatus: ['Active', 'Delayed', 'Complete']
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