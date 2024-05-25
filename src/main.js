import './assets/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter,createMemoryHistory } from 'vue-router'
import AddList from './components/AddList.vue'
import TodoList from './components/TodoList.vue'
const routes =[
    {
    path: '/',
    name:'Home',
    component: TodoList
},
    {
    path: '/add' ,
    name:'Add',
    component: AddList
}
]
const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
const app = createApp(App)
app.use(router);
app.mount('#app')
