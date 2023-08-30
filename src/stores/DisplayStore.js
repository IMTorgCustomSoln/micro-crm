import { defineStore } from 'pinia'

export const useDisplayStore = defineStore('display',{
    state: () => {
        return {
            viewSelection: 'contact',
            viewCount: 0
        }
    }
})