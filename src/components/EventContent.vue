 <template>
 <div>
    <h2>{{sectionTitle}}</h2>
     <grid ref="pgrid"
        :griddata="gridData"
        :totalrows="TotalRows"
        :page="currentPage"
        :pagesize="currentPageSize"
        :columns="gridColumns"
        :filter-key="searchQuery"
        :formatcolumns="handleColumn"
        @onChangePage="onChangePage($event)"
        @onSelectedItem="onSelectedItem($event)"
        @onSelectedItem="onSelectedItem($event)"
      >
      
         <div slot="header">
            <h4 class="modal-title">User Edit</h4>
          <button class="close" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div slot="body">
            <form id="edit-book-form" action="/SSSCal/Person/HandlePopForm" class="container-fluid"> 
                <div class="row"> 
                        <div class="col-xs-6 col-sm-4">
                            <label class="label2">Name</label>
                        </div>
                        <div class="col-xs-6 col-lg-8">
                                <input class="form-control" type="text" name="Name" id="Name" :placeholder="selectedItem.userName" /> 
                        </div>
                    <input type="hidden" id="id" name="id" /> 
                    <input type="hidden" id="Address_ID" name="Address_ID" /> 
                </div> 

                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">TopicF</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="text" name="Home_Phone" id="Home_Phone" :placeholder="selectedTopicTitle"  /> 
                    </div>
                </div>  
                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">Topic</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="text" name="E_Mail"  :placeholder="selectedItem.topic" /> 
                    </div>
                </div>  
                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">Date</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="date" :value="selectedDate" /> 
                    </div>
                </div>  
                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">Description</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="text" :value="selectedItem.description" /> 
                    </div>
                </div>  

            </form>
        </div>

        <div slot="footer">
            <button type="button" className="btn btn-outline-dark" @click="save" >Save</button>
            <button type="button" className="btn btn-outline-dark" @click="close" >Close</button>
        </div>
      
      
      </grid>

 </div>
</template>

<script>
import Grid from './Grid.vue'
import bus from '../main'

//Vue.forceUpdate();



export default {
  components: {'grid': Grid},
    data(){

        return {
            sectionTitle:'Event',
          searchQuery: "",
          gridColumns: ["topicf", "topic", "description","date","userName"],
          gridData: [],
          TotalRows:0,
          currentPage:1,
          currentPageSize:10,
          sortKey:"userName", 
          sortDirection:"asc",
          selectedItem:{},
          handleColumn:{
                    'topicf': function(item) {
                          return item==null?'N/A':item.topicTitle;
                      },
                    'date': function(item){
                          if (item==null || (item!=null && item=='0001-01-01T00:00:00')) return 'N/A';
                          var pos = item.indexOf('T');
                          if (pos>=0) {
                            return item.substr(0,pos);
                          }
                          return item;
                        }
                  }
        }
    },
		created(){
      bus.$on('onChangePage',(page) => {
        console.log('onchangepage', page);
        this.currentPage=page;
  			this.search(this.currentPage,this.currentPageSize,this.sortKey, this.sortDirection);
      });
      bus.$on('onSelectedItem',(itm) => {
        this.selectedItem=itm;
      });
      bus.$on('onSorting',(sortKey, sortDirection) => {
        console.log('onSorting sortkey', sortKey);
        console.log('sortOrder', sortDirection);
        this.sortKey=sortKey;
        this.sortDirection=sortDirection==1?"asc":"desc";
  			this.search(this.currentPage,this.currentPageSize,this.sortKey, this.sortDirection);
      });



			this.search(this.currentPage,this.currentPageSize,this.sortKey, this.sortDirection);
    },
    computed: {
      selectedTopicTitle() {
            if (this.selectedItem!=null && this.selectedItem.topicf!=null && this.selectedItem.topicf.topicTitle!=null)
              return this.selectedItem.topicf.topicTitle;
            else return 'N/A';
      },
      selectedDate: {
          get(){
            var dateOfBirth = new Date(this.selectedItem.date);
            console.log('seldob dateOfBirth string', this.selectedItem.date);
            console.log('seldob dateOfBirth date', dateOfBirth);
            var mnt=`${dateOfBirth.getMonth()+1}`;
            if (mnt.length==1) mnt='0'+mnt;
            var dy=`${dateOfBirth.getDate()}`;
            if (dy.length==1) dy='0'+dy;
            console.log('seldob', `${dateOfBirth.getFullYear()}-${mnt}-${dy}`);
            return `${dateOfBirth.getFullYear()}-${mnt}-${dy}`;
          }
        }
   
    },
		methods: {
			search: function (currentPage, pageSize, sortKey, sortDirection) {
//requests = "?page=1&pageSize=20&sort[0][field]=Date&sort[0][dir]=asc&filter[logic]=and&filter[filters][0][field]=Date&filter[filters][0][operator]=gte&filter[filters][0][value]=2019-06-30";
//			  fetch(`http://n50.schuebelsoftware.com/api/users`)

            // requests = "?page=1&pageSize=20&sort[0][field]=Date&sort[0][dir]=asc&filter[logic]=and&filter[filters][0][field]=Date&filter[filters][0][operator]=gte&filter[filters][0][value]=2019-06-30";
//            string odcall = string.Format("api/person?page={0}&pageSize={1}&sort[0][field]=Name&sort[0][dir]=asc", Start, itemCount);
//                    var hdr = response.Headers.GetValues("Paging-TotalRecords").FirstOrDefault();


    //  var filterQuery=`&filter[logic]=and&filter[filters][0][field]=${this.filterField}&filter[filters][0][operator]=${filterOp}&filter[filters][0][value]=${this.filterValue}`;
    //var filterParams = `page=${this.currentPage}&pageSize=${this.pageSize}&sort[0][field]=${this.sortColumn}&sort[0][dir]=${this.sortDirection}${filterQuery}`;
    var filterParams = `page=${currentPage}&pageSize=${pageSize}&sort[0][field]=${sortKey}&sort[0][dir]=${sortDirection}`;

//			  fetch(`http://localhost:5010/api/event?&${filterParams}`)
			  fetch(`http://www.schuebelsoftware.com/SSSCalCoreApi/api/event?${filterParams}`)
				.then(response => {
          this.TotalRows = parseInt(response.headers.get('Paging-TotalRecords'));
        console.log('fetch TotalRows', this.TotalRows);
          return response.json()})
				.then(json => {
          this.gridData = json;
          //this.$forceUpdate(); 

			  });
      },
      save(){
          if (confirm("Save " + this.selectedItem.name))
            this.$refs.pgrid.showModal = false;
      },
      close(){
            this.$refs.pgrid.showModal = false;
      }
      
    }
}
</script>

<style scoped>
h2 {
   color: green;
}

.modal-title{
display: inline-flex;
}
#tst{ border:red solid 1px;}
.close {
  float: right;
}
</style>