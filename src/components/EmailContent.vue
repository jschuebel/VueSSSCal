<template>
  <div>
          <center id="cDir"><h2>Email</h2></center>
        <div class="container" style="border: 3px solid blue;">
        <div class="row justify-content-md-center">
                <select v-model="selectedEvent" @change="onChange($event)">
                    <option v-for="evt in eventData" :value="evt" style="font-family: monospace, monospace;" v-html="evt.DisplayOnly" >{{evt.DisplayOnly}}</option>
                </select>
        </div>
        <div class="row">
                &nbsp;
        </div>
        <div class="row justify-content-md-center">
                <div class="col col-md-auto">People</div>
                <div class="col col-md-2"></div>
                <div class="col col-md-auto">Selected People</div>
         </div>
        <div class="row justify-content-md-center">
            <div class="col col-md-auto">
                <select ref="selectElRef" multiple  size="15"   >
                        <option v-for="p of UnSelectedEmailList" :value="p.id" > {{p.name}} </option>
                </select>                            
            </div>
          <div class="col col-md-2">
                <div class="row justify-content-md-center">
                                <button @click="Move2SELPople()" :disabled="!isLoggedIn" class="btn btn-primary btn-sm"><font-awesome-icon icon="angle-right" /></button>
                </div>
                <div class="row justify-content-md-center">
                        &nbsp;
                </div>
                <div class="row justify-content-md-center">
                                <button @click="Move2Pople()" :disabled="!isLoggedIn" class="btn btn-primary btn-sm"><font-awesome-icon icon="angle-left" /></button>
                </div>
                <div class="row justify-content-md-center">
                        &nbsp;
                </div>
                <div class="row justify-content-md-center">
                    <button :disabled="SelectedEmailIDList.length == 0" v-if="isLoggedIn"  @click="Save()" class="btn btn-primary btn-sm">Save</button>
                </div>
           </div>
           <div class="col col-md-auto">
                <select ref="selectSELElRef" multiple  size="15"   >
                        <option v-for="s of SelectedEmailList" :value="s.id" > {{s.name}} </option>
                </select>                            
           </div>
    


        </div><!-- temp for end-->
 </div>
</template>

<script>
export default {
    data(){
        return {
            sectionTitle:'test content',
            selectedEvent:{},
            eventData:[],
            UnSelectedEmailList:[],
            SelectedEmailList:[],
            isLoggedIn:false,
            SelectedEmailIDList:[],
            PeopleList:[]

        }
    },
    created(){
            fetch(`http://www.schuebelsoftware.com/SSSCalCoreApi/api/person`)
            .then(response => {
                //this.TotalRows = parseInt(response.headers.get('Paging-TotalRecords'));
                //console.log('fetch TotalRows', this.TotalRows);
                return response.json()})
            .then(json => {
                console.log('People', json);
                this.PeopleList = json;
            });

        let startDate = new Date(`${(new Date()).getMonth()+1}-01-${(new Date()).getFullYear()}`);
        let endDate = new Date(`12-31-${(new Date()).getFullYear()}`)
        console.log(`startDate = ${startDate}`);
        console.log(`endDate = ${endDate}`);

        //currentyearly
    	fetch(`http://www.schuebelsoftware.com/SSSCalCoreApi/api/event/calendarsearch?startDate=${startDate.ToShortDateString()}&endDate=${endDate.ToShortDateString()}`)
		.then(response => {
            //this.TotalRows = parseInt(response.headers.get('Paging-TotalRecords'));
            //console.log('fetch TotalRows', this.TotalRows);
            return response.json()})
		.then(json => {
            console.log('yearlyevents', json);

            json.forEach(item => {
        //        console.log("item.Description", item.Description, "  Date", item.Date);
                var len =0;
                var newstring="";
                if  (item.description==null || (item.description!=null && item.description.trim().length==0)) {
                    newstring=(item.topic==null?"N/A":item.userName + " " + item.topic.replace(/[\n\t]/g,'    ')).trim();
                    len = newstring.length;
                }
                else {
                    newstring=item.description.replace(/[\n\t]/g,'    ').substring(0,25).trim();
                    len = newstring.length;
                }
                len = (len>25)?25:len;
                var padd = new Array(27-len)
                var padds = padd.join("&nbsp;");
                if (item._id!=-1)
                item.DisplayOnly =  newstring.replace(/ /g,'&nbsp;') + padds + (item.date==null?"N/A":this.toJSONLocal(item.date));
                //console.log("item.DisplayOnly", item.DisplayOnly,"len", len);
            });


          this.eventData = json;
          //this.$forceUpdate(); 
		});
 
    },
    methods:{
        toJSONLocal (date) {
            var local = new Date(date);
            //local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        },
        onChange(evnt) {
            //console.log("onchange evnt=",evnt.target.value);
            console.log("onchange SelectedEvent=",this.selectedEvent);

            fetch(`http://www.schuebelsoftware.com/SSSCalCoreApi/api/group/${this.selectedEvent.id}`)
            .then(response => {
                //this.TotalRows = parseInt(response.headers.get('Paging-TotalRecords'));
                //console.log('fetch TotalRows', this.TotalRows);
                return response.json()})
            .then(json => {
                console.log('group', json);
                this.SelectedEmailIDList  = [];
                json.forEach(item => {
                    this.SelectedEmailIDList.push(item.personId);
                });
                //  console.log("onchange SelectedEmailIDList=",this.SelectedEmailIDList);
                this.UpdateLists();
            });



            
        },
        Move2SELPople() {
            console.log("Move2SELPople");
            let options =  this.$refs.selectElRef.options;
            console.log("options.length=", options.length);
            for(let i=0; i < options.length; i++) {
                if (options[i].selected) {
                console.log("REF selectElRef option=", options[i]);
                this.SelectedEmailIDList.push(parseInt(options[i].value));
                }
            }
            console.log("Move2SELPople this.SelectedEmailIDList=", this.SelectedEmailIDList);
            this.UpdateLists();  
        },
        Move2Pople(){
            console.log("Move2Pople");
            let options = this.selectSELElRef.nativeElement.options;
            for(let i=0; i < options.length; i++) {
                if (options[i].selected) {
                console.log("REF selectSELElRef option=", options[i]);
                    _.remove(this.SelectedEmailIDList, function (selVal) {
                    return (parseInt(options[i].value) == selVal);
                });
                }
            }
            console.log("Move2Pople this.SelectedEmailIDList=", this.SelectedEmailIDList);
            this.UpdateLists();  
        },
        Save(){
             console.log("Save ");
            /*
            this._dataService.saveEmails(this.SelectedEvent)
            .subscribe(res => {
                console.log("Save res =",res);
                this.message = res.data.status;
            },
            err => {
                console.log("Error from getUsers", err)
                if (err.status===403)
                this.message = "Event Access: " + err.statusText;
            });
            */
         },
        UpdateLists() {

            console.log("UpdateLists this.SelectedEmailIDList=", this.SelectedEmailIDList);
        
            this.UnSelectedEmailList  = [];
            this.SelectedEmailList  = [];
            if (this.SelectedEmailIDList==null || (this.SelectedEmailIDList!=null && this.SelectedEmailIDList.length==0)) {
                this.UnSelectedEmailList=this.PeopleList;
            }
            else {
                let currList = this.SelectedEmailIDList;
                this.SelectedEmailList = _.reduce(this.PeopleList, function(memo, val, idx) {
                    //console.log("SEL val.id", val._id);
                    //console.log("SEL  this.SelectedEmailIDList=", currList);
                    if (_.includes(currList, val.id)) {
                    //console.log("SEL FOUND val.id", val._id);
                    memo.push(val);
                    }
                    return memo;
                }, []);
                this.UnSelectedEmailList = _.reduce(this.PeopleList, function(memo, val, idx) {
                    //console.log("UNSEL val.id", val._id);
                    if (!_.includes(currList, val.id)) {
                    //console.log("UNSEL FOUND val.id", val._id);
                    memo.push(val);
                    }
                    return memo;
                }, []);
            }
        } 

    }
}
</script>

<style scoped>
h2 {
   color: green;
}

</style>