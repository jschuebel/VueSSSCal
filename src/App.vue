<template>
  <div id="app">
    <app-header :title="title"/>
    <h1>{{ title }}</h1>
    <router-view></router-view>
    <app-footer :title="title"/>
   </div>
</template>

<script>

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  components: {'app-header': Header, 'app-footer': Footer},
  name: 'app',
  data () {
    return {
      title: 'SSS Calendar App'
    }
  }
}
</script>

<style >

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  
}

@media (max-width: 767.98px) {
  .main .top-row:not(.auth) {
      display: none;
  }

  .smallSCR {
      display: none;
  }
}


@media only screen and (max-width: 992px) {
  .medSCR {
      display: none;
  }
}
</style>

<style scoped>
h1, h2 {
  font-weight: normal;
   color: purple;
}
</style>
