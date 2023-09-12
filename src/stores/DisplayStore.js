import { defineStore } from 'pinia'

export const useDisplayStore = defineStore('display',{
    state: () => {
        return {
            viewCount: 0,
            viewSelection: {value: '1', text: 'Project', path:'ProjectPage'},
            options:[
                {value: '1', text: 'Project', path:'ProjectPage'},
                {value: '2', text: 'Contact', path:'ContactPage'},
                {value: '3', text: 'Lifecycle', path:'LifecyclePage'},
              ],
            projectSelection: {}
        }
    }
})