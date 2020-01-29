import Vue from 'vue'
import Router from 'vue-router'
import ToDo from '@/components/ToDo'
import Projects from '@/components/Projects'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ToDo',
      component: ToDo
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects
    }
  ]
})
