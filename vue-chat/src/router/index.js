import Vue from 'vue'
import Router from 'vue-router'
import Chatroom from '@/components/chatroom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Chatroom',
      component: Chatroom
    }
  ]
})
