import { createRouter, createWebHistory } from 'vue-router';



const routes = [
    {path:'/', component: ()=>('./App.vue')},
    /*    children: [
    //lazy-loading will not affect single file build config
    {path:'', name:'Home', component: ()=>import('@/views/Home.vue')},
    {path:'/about', name:'About', component: ()=>import('@/views/About.vue') },   
    {path:'/lifecycle', name:'Lifecycle', component: ()=>import('@/views/LifecyclePage.vue') },
    {path:'/project', name:'Project', component: ()=>import('@/views/ProjectPage.vue') },
    {path:'/contact', name:'Contact', component: ()=>import('@/views/ContactPage.vue') }  */
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router