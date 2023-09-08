import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
//import About from '@/views/About.vue';


const routes = [
    {path:'/', name:'Home', component:Home},
    {path:'/about', name:'About', component: ()=>import('@/views/About.vue') } //lazy-loading will not affect single file build config
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router