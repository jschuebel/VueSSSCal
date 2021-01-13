import Intro from './components/IntroContent.vue'
import Pictures from './components/PictureContent.vue'
import Person from './components/PersonContent.vue'
import Event from './components/EventContent.vue'
import Email from './components/EmailContent.vue'
import stuff from './components/stuffContent.vue'


export default [
    { path:'*', component:Intro},
    { path:'/picture', component:Pictures},
    { path:'/person', component:Person},
    { path:'/event', component:Event},
    { path: '/email', component: Email },
    { path: '/stuff', component: stuff }
]
