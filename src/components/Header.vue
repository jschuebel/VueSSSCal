 <template>
 <header>
    <div class="content-wrapper">
        <p class="smallSCR" style='float:left'><img alt="Contact Us" style='height:110px' src="../assets/logo.png" /></p>
    </div>
    <div class="container"> 
          <div class="row">
              <ul id="menu"  class="nav nav-tabs">
              <li class="nav-item"><router-link class='nav-link' active-class="active" to="*">Home</router-link></li>
              <li class="nav-item"><router-link class='nav-link' active-class="active" to="/picture">View Photos</router-link></li>
              <li class="nav-item"><router-link class='nav-link' active-class="active" to="/person">Edit People</router-link></li>
              <li class="nav-item"><router-link class='nav-link' active-class="active" to="/event">Edit Events</router-link></li>
              <li class="nav-item"><router-link class='nav-link' active-class="active" to="/email">Edit Email</router-link></li>
              <li class="nav-item"><router-link class='nav-link' active-class="active" to="/stuff">Samples</router-link></li>
              </ul>
          </div>
      </div>

    <span>{{sectionTitle}}</span>
    <button class="btn-primary" @click="test">Use Prop in header</button>
 </header>
</template>

<script>
export default {

  //adding validation to props
    props:{
        title:{ type:String, required:true}
    },
    data(){
        return {
          fleft :{float:'left'},
          iheight :{height:110},
          sectionTitle:'Header'
        }
    },
    methods:{
      test:function(){
        this.sectionTitle= this.title + ":" + this.sectionTitle;
      }
    }


}
</script>

<style scoped>
h2 {
   color: blue;
}


.nav-tabs > li > a:hover{
  color: blue;
  background-color:white;
}

.nav-tabs > li > a:link {
  color: rgb(214, 209, 209);
}


.nav-tabs > li > a:visited {
  color: rgb(214, 209, 209);
}

.content-wrapper {
  margin: 0 auto;
  max-width: 560px;
float: left; 
height:115px;
}

header {
	background: #1e5799; /* Old browsers */
  background: -moz-linear-gradient(top,  #1e5799 0%, #207cca 30%, #2989d8 50%, #7db9e8 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-stop(30%,#207cca), color-stop(50%,#2989d8), color-stop(100%,#7db9e8)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top,  #1e5799 0%,#207cca 30%,#2989d8 50%,#7db9e8 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top,  #1e5799 0%,#207cca 30%,#2989d8 50%,#7db9e8 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(top,  #1e5799 0%,#207cca 30%,#2989d8 50%,#7db9e8 100%); /* IE10+ */
  background: linear-gradient(to bottom,  #1e5799 0%,#207cca 30%,#2989d8 50%,#7db9e8 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 ); /* IE6-9 */

  height: 115px;
}



</style>