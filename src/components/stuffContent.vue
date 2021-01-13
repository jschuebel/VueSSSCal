 <template>
 <div>
    <h2>{{sectionTitle}}</h2>
     <grid ref="pgrid"
        :totalrows="TotalRows"
        :page="currentPage"
        :pagesize="currentPageSize"
        :columns="gridColumns"
        :filter-key="searchQuery"
        :formatcolumns="handleColumn"
        @onChangePage="onChangePage($event)"
        @onSelectedItem="onSelectedItem($event)"
      >
          <tr slot="gridheader">
              <th @click="sortBy('name')" :class="{ active: sortKey == 'name'}">Name<font-awesome-icon :icon="sortOrders['name'].icon" /></th>
              <th @click="sortBy('dateOfBirth')" :class="[{ active: sortKey == 'dateOfBirth'}, 'smallSCR', 'medSCR:true']">Date<font-awesome-icon :icon="sortOrders['dateOfBirth'].icon" /></th>
              <th @click="sortBy('homePhone')" :class="{ active: sortKey == 'homePhone'}">Home Phone<font-awesome-icon :icon="sortOrders['homePhone'].icon" /></th>
              <th @click="sortBy('mobile')" :class="[{ active: sortKey == 'mobile'}, 'smallSCR']">Mobile<font-awesome-icon :icon="sortOrders['mobile'].icon" /></th>
          </tr>

          <tr v-for="entry in gridData"  slot="gridbody"   @click="showPop(entry)">
            <td>{{entry.name}}</td>
            <td :class="['smallSCR', 'medSCR:true']">{{handleColumn.dateOfBirth(entry.dateOfBirth)}}</td>
            <td>{{entry.homePhone}}</td>
            <td :class="'smallSCR'">{{handleColumn.mobile(entry.mobile)}}</td>
          </tr>
      
         <div slot="modalheader">
            <h4 class="modal-title">User Edit</h4>
          <button class="close" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div slot="modalbody">
            <form id="edit-book-form" action="/SSSCal/Person/HandlePopForm" class="container-fluid"> 
                <div class="row"> 
                        <div class="col-xs-6 col-sm-4">
                            <label class="label2">Name</label>
                        </div>
                        <div class="col-xs-6 col-lg-8">
                                <input class="form-control" type="text" name="Name" id="Name" :placeholder="selectedItem.name" /> 
                        </div>
                    <input type="hidden" id="id" name="id" /> 
                    <input type="hidden" id="Address_ID" name="Address_ID" /> 
                </div> 

                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">Home_Phone</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="text" name="Home_Phone" id="Home_Phone" :placeholder="selectedItem.homePhone"  /> 
                    </div>
                </div>  
                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">Email Adress</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="text" name="E_Mail"  :placeholder="selectedItem.eMail" /> 
                    </div>
                </div>  
                <div class="row"> 
                    <div class="col-xs-6 col-sm-4" >
                            <label  class="label2">Date of Birth</label>
                    </div>
                    <div class="col-xs-6 col-lg-8" >
                            <input class="form-control" type="date" :value="selectedDOB" /> 
                    </div>
                </div>  

            </form>
        </div>

        <div slot="modalfooter">
            <button type="button" className="btn btn-outline-dark" @click="save" >Save</button>
            <button type="button" className="btn btn-outline-dark" @click="close" >Close</button>
        </div>
      
      
      </grid>

 </div>

</template>

<script>
import Pagination from './Pagination.vue'
import bus from '../main'
import Grid from './Grid.vue'
//Vue.forceUpdate();



export default {
  components: {pagination: Pagination, 'grid': Grid},
    data(){
          var sortOrders = {};
            sortOrders["name"] = {direction:1, icon:['fas', 'sort-up']};
          ["homePhone", "mobile","dateOfBirth"].forEach(function(key) {
            sortOrders[key] = {direction:1, icon:['fas', 'sort']};
          });

        return {
            sectionTitle:'Person',
          searchQuery: "",
          gridData: [],
          gridColumns: ["name", "homePhone", "mobile","dateOfBirth"],
          sortOrders: sortOrders,
          TotalRows:0,
          currentPage:1,
          currentPageSize:10,
          sortKey:"name", 
          sortDirection:"asc",
          selectedItem:{},
          handleColumn:{
                    'mobile': function(item) {
                          return item==null?'N/A':item;
                      },
                    'dateOfBirth': function(item){
                          if (item=='0001-01-01T00:00:00') return 'N/A';
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
    

			this.search(this.currentPage,this.currentPageSize,this.sortKey, this.sortDirection);
    },
    computed: {
  selectedDOB: {
          get(){
            var dateOfBirth = new Date(this.selectedItem.dateOfBirth);
            var mnt=`${dateOfBirth.getMonth()+1}`;
            if (mnt.length==1) mnt='0'+mnt;
            var dy=`${dateOfBirth.getDate()}`;
            if (dy.length==1) dy='0'+dy;
            console.log('seldob STUFF', `${dateOfBirth.getFullYear()}-${mnt}-${dy}`);
            return `${dateOfBirth.getFullYear()}-${mnt}-${dy}`;
          },
          set(newVal){
            let [y, m, d] = newVal.split('-');
            this.selectedItem.dateOfBirth = {y, m, d};
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

//			  fetch(`http://localhost:5010/api/person?&${filterParams}`)
			  fetch(`http://api.schuebelsoftware.com/api/person?${filterParams}`)
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
      },
      sortBy: function(key) {

        if (this.sortKey!=key) {
          this.sortOrders[this.sortKey].direction = 1;
          this.sortOrders[this.sortKey].icon=['fas', 'sort'];
        }

        this.sortKey=key;
        this.sortOrders[key].direction = this.sortOrders[key].direction * -1;
        console.log('sortkey', this.sortKey);
        console.log('sortOrders[key]', this.sortOrders[key].direction);
        console.log('this.sortDirection', this.sortDirection);

        this.sortDirection=this.sortOrders[key].direction===1?"asc":"desc";
        this.sortOrders[key].icon=this.sortOrders[key].direction===1?['fas', 'sort-up']:['fas', 'sort-down'];
        
  			this.search(this.currentPage,this.currentPageSize,this.sortKey, this.sortDirection);
        },
       showPop(itm) {
        console.log('showpop fired STUFF');
        this.selectedItem=itm;
        this.$refs.pgrid.showModal = true;
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
