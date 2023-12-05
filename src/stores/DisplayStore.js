import { defineStore } from 'pinia'


const statuses = ['Active', 'Stand By', 'Delayed', 'Testing-Alpha', 'Testing-Beta', 'Review', 'Complete']

const DisplayStore = defineStore('display',{
    state: () => {
        return {
            //Admin
            enableAdmin: true,
            populateDefault: true,
            populateTestData: true,
            exportAppStateFileName: 'WorkSession.gz',
            todaysDate: null,

            //Display
            viewCount: 0,
            viewSelection: {value: '1', text: 'Project', path:'ProjectPage'},
            options:[
                //NavbarTop.vue
                {value: '1', text: 'Project', path:'ProjectPage'},
                {value: '2', text: 'Contact', path:'ContactPage'},
                {value: '3', text: 'Lifecycle', path:'LifecyclePage'},

                //Sidebar.vue / views
                {value: '4', text: 'Events', path:'EventPage'}, 
                {value: '5', text: 'Feedback', path:'FeedbackPage'},

                //Sidebar.vue / reports
                {value: '6', text: 'Event Summary', path:'EventSummaryReport'},
                {value: '7', text: 'Next Steps', path:'NextStepsReport'}

              ],

            //User-specified
            projectSelection: {},
            participants: [],
            isNavOpen: false,

            //Project
            project: {
                initialCategory: 'Software',
                initialStatus: statuses[1],
                initialStartDate: null, 
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
    },
    getters:{
        getTodaysDate: (state) => state.todaysDate
    },
    actions:{
        setIsNavOpen(yesno) {
            this.isNavOpen = yesno;
          },
        toggleNav() {
            this.isNavOpen = !this.isNavOpen;
            console.log('toggled!')
          },
        initialize(){
            this.setDate()
        },
        setDate(datetime=''){
            let dt = new Date()
            if(datetime!=''){
                dt = new Date( Date.parse(datetime) )
            }
            this.todaysDate = dt
            this.project.initialStartDate = dt
        }
    }
})

export default DisplayStore