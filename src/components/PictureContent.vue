 <template>
    <div>
          <center><button className="btn btn-primary" :disabled="BackButtonDeActived" @click="BackLoadit(this)" >{{BackButtonText}}</button></center>
            
          <div id='picCont'></div>
          <center v-if="ShowDir" id="cDir"><h2>Directories</h2></center>
          <table id="tFolder"  ref="tFolder" width="100%" cellSpacing="0" border="0">
          <tbody>
              <tr>
                  <td><div v-for="(fld, index) in displayfolders" 
                        style="float:left;minWidth:180px;"
                          :key="fld.id"
                        ><a href="#" @click.prevent="Loadit($event, index)">{{fld.Name}}</a></div></td>
              </tr>
            </tbody>
          </table>
          <center v-if="ShowPic" id="cPics"><h2>Pictures</h2></center>
          <table id="tPics" name="tPics" width="100%" cellSpacing="0" border="0">
            <tbody>
              <tr>
                  <td><div v-for="(fld, index) in displaypictures" 
                        style="float:left;minWidth:180px;"
                          :key="fld.id"
                        ><a href="#" @click.prevent="FullPic($event, fld.Path)"><img id="imgPic" :src="fld.Path"   /></a></div>
                </td>
              </tr>
            </tbody>
          </table>

          <center v-if="ShowMov" id="cMovies"><h2>Movies</h2></center>
          <table id="tMovies" name="tMovies" width="100%" cellSpacing="0" border="0">
              <tbody>
              <tr>
                  <td><div v-for="(fld, index) in movies" 
                        style="float:left;minWidth:180px;"
                          :key="fld.id"
                        ><a href="#" @click.prevent="ChangeMovie($event, fld.Path)">{{fld.Name}}</a></div>
                </td>
              </tr>
            </tbody>
          </table>

          
            <video v-if="ShowMov" ref="videoplayer" width="640" height="360" src=""  controls>
                      Your browser does not support the <code>video</code> element. 
            </video>

          
        </div>
</template>

<script>
import Vue from 'vue'

export default {
    data(){
        return {
            sectionTitle:'test content',
            MaxCols:Number,
            folders: [],
            pictures:[],
            movies:[],
            hlddir: [],
            BackButtonText:'family',
            BackButtonDeActived:true,
            ShowDir:false,
            ShowPic:false,
            ShowMov:false
            
        }
    },
    computed: {
      displayfolders : function(){
        return this.folders;
      },
      displaypictures : function(){
          var npics=Array();
          this.pictures.forEach(function(datacell, i) 
          {
              npics.push({id:datacell.id, Path:"http://www.schuebelsoftware.com/SSSWebAPI/api/Image?Height=180&Width=180&FilePath=" + datacell.Path});
          });
        return npics;
      }
    },
    methods:{
      initLoad(){
        let self = this
        var data = localStorage.getItem("SSSPics");
        console.log("./initload data", data);
       if (data==null) {
          fetch('Inetpub.txt')
          .then(response => response.text()) //.json())
          .then(data => {
           // localStorage.setItem("SSSPics", data);
           // console.log('rawdata', data)
            self.tabData = JSON.parse(data); //if response is text
            
            console.log("FROM FILE tabData", self.tabData);
            self.hlddir.push(self.tabData);
           console.log("hlddirlen", self.hlddir.length);
           // console.log("this.state.hlddir", this.hlddir);
            var currentNode = this.hlddir[this.hlddir.length - 1];
            self.updateTable(currentNode);
    
          });
        }
        else {
          self.tabData = JSON.parse(data);
          console.log("from cache")
          console.log("FROM CACHE tabData", self.tabData);
            self.hlddir.push(self.tabData);
           console.log("this.state.hlddirlen", self.hlddir.length);
            console.log("this.state.hlddir", self.hlddir);
            var currentNode = this.state.hlddir[self.hlddir.length - 1];
            self.updateTable(currentNode);
        }
      },
      updateTable(currentNode){
          console.log('updateTable  currentNode',currentNode)
          var keys = Object.keys(currentNode.folders);
         // console.log("keys", keys);

          var foldersOnly=[];
          keys.forEach(function(key, i) 
          {
            var datacell = currentNode.folders[key];
            if (datacell.CellType=="Folder") 
              foldersOnly.push(datacell);
          });

          //console.log("updateTable foldersOnly", foldersOnly);
          var MaxRows = Math.floor(foldersOnly.length/this.MaxCols);
          console.log("updateTable MaxRows", MaxRows);
          if ((foldersOnly.length % this.MaxCols) > 0) MaxRows++;
          console.log("updateTable MaxRows", MaxRows);

          let list = [];
          let celPos = 0;
          for (var x=0;x<MaxRows;x++) {
              for (var y=0;y<this.MaxCols;y++) {
                  celPos = x + (y*MaxRows);


                  if (celPos>foldersOnly.length) {
                    //this.folders.push(this.buildDirLink(celPos,1, ''));
                    continue;
                }

                var datacell = foldersOnly[celPos];
                if (datacell!=null) {
                    if (datacell.CellType=="Folder") {
                      datacell.id=(x*this.MaxCols)+y;
                      this.folders.push(datacell); //this.buildDirLink(celPos,0, foldersOnly[celPos].Name));
                    }
                }
              }
          }
          console.log('!!!!!!!!!!!!!!!!!! picture render dirs', this.folders)

          var x=0;
          keys.forEach(function(key, i) 
          {
            var datacell = currentNode.folders[key];
            
            if (datacell.CellType=="File" && datacell.FileType=="Image") {
              datacell.id=x++;
              this.pictures.push(datacell); //this.buildPicLink(i, key, datacell));
            }
            
          }, this);
          
          console.log('!!!!!!!!!!!!!!!!!! picture render pics', this.pictures)
          x=0;
          keys.forEach(function(key, i) 
          {
            var datacell = currentNode.folders[key];
            if (datacell.CellType=="File" && datacell.FileType=="Movie") {
              datacell.id=x++;
              this.movies.push(datacell);//this.buildmOVLink(i, key, datacell));
            }
          },this);
          console.log('!!!!!!!!!!!!!!!!!! picture render movies', this.movies)

          this.ShowDir= this.folders.length>0?true:false;
          this.ShowPic= this.pictures.length>0?true:false;
          this.ShowMov= this.movies.length>0?true:false;

          console.log('showMov', this.movies.length);


      },
      Loadit(event, pos) {
       //  event.preventDefault();
          console.log("loadit pos", pos)

        //this.MoviePath="";
        this.folders=[];
        this.pictures = [];
        this.movies=[];
        var parentNode = this.hlddir[this.hlddir.length - 1];
        var currentNode = parentNode.folders[event.target.innerText];
        this.updateTable(currentNode);

        this.BackButtonText='Back to: ' + parentNode.Name;
        this.BackButtonDeActived=false;
        this.hlddir.push(currentNode);
      },
      BackLoadit(){
            console.log('hit backloadit')

            //this.MoviePath="";
            this.folders=[];
            this.pictures = [];
            this.movies=[];
            this.hlddir.pop();
            var currentNode = this.hlddir[this.hlddir.length - 1];
            this.updateTable(currentNode);

            if (this.hlddir.length>1) {
              this.BackButtonText="Back to: " + this.hlddir[this.hlddir.length - 2].Name;
              this.BackButtonDeActived=false;
          }
          else {
            this.BackButtonText=currentNode.Name;
            this.BackButtonDeActived=true;
          }
         },
          FullPic(event, path){
              console.log("loadit path", path)
            var nwin = window.open("./PicsPage.html");
//            nwin.opener.pth2 = "http://www.schuebelsoftware.com/SSSWebAPI/api/Image?Height=&Width=&FilePath=" + path;
            nwin.opener.pth2 = path;
          },
          ChangeMovie(event, path){
            console.log("ChangeMovie path", path);
            let hldpath = path.replace(/.:\/inetpub\//, "http://www.schuebelsoftware.com/"); //"http://localhost/");
            //f:/inetpub/family/jt/jmallwalkwave.mp4
            //let hldpath  ="http://www.schuebelsoftware.com/family/jt/jmallwalkwave.mp4";
            console.log("ChangeMovie updated hldpath", hldpath);
        
            //this.MoviePath=hldpath;
            this.ShowMainMovie=true;
            this.$refs.videoplayer.src=hldpath;
            this.$refs.videoplayer.play();
          }


    },
    mounted(){
      console.log('pic mounted');
      var wd = this.$refs.tFolder.offsetWidth;
      console.log("updateTable tree width", wd);

      this.MaxCols = Math.floor(wd/180);
      console.log("updateTable MaxCols", this.MaxCols);
      this.initLoad();
  }
}
</script>

<style scoped>
h2 {
   color: green;
}

</style>