 <template>
 <div>
      <table>
        <thead>
          <tr>
            <th v-for="key in columns"
              @click="sortBy(key)"
              :class="{ active: sortKey == key }">
              {{ key | capitalize }}
              <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in griddata"  @click="showPop(entry)">
            <td v-for="key in columns">
              {{formatColumn(key, entry[key])}}
            </td>
          </tr>
        </tbody>
        <tfoot>
        <tr><td colSpan="4">
            <pagination  :totalRows="totalrows" :page="page"  :pagesize="pagesize"/>
        </td></tr>
        </tfoot>
      </table>

     <modal v-if="showModal" @close="showModal = false" >
       <div slot="header">
          <slot name="header" />
       </div>
       <div slot="body">
          <slot name="body" />
       </div>
       <div slot="footer">
          <slot name="footer" />
       </div>
      </modal>

</div>
</template>

<script>
import Pagination from './Pagination.vue'
import modal from './modal.vue'
import bus from '../main'

export default {
    components: {pagination: Pagination, modal:modal},

     props: {
        title: String,
        griddata: Array,
        totalrows:Number,
        page:Number,
        pagesize:Number,
        columns: Array,
        filterKey: String,
        formatcolumns : {},
    },

    data(){
          var sortOrders = {};
          this.columns.forEach(function(key) {
            sortOrders[key] = 1;
          });
          return {
            sectionTitle:'Footer',
            sortKey: "",
            sortOrders: sortOrders,
            showModal: false
          };
    },
    computed: {
        filteredData: function() {
          return grdData;
  /*

        var sortKey = this.sortKey;
        var filterKey = this.filterKey && this.filterKey.toLowerCase();
        var order = this.sortOrders[sortKey] || 1;
        var grdData = this.griddata;
        if (filterKey) {
            grdData = grdData.filter(function(row) {
            return Object.keys(row).some(function(key) {
                return (
                String(row[key])
                    .toLowerCase()
                    .indexOf(filterKey) > -1
                );
            });
            });
        }
        if (sortKey) {
            grdData = grdData.slice().sort(function(a, b) {
            a = a[sortKey];
            b = b[sortKey];
            return (a === b ? 0 : a > b ? 1 : -1) * order;
            });
        }
        return grdData;
*/        
        }
    },
    filters: {
        capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
        }
    },
    methods: {
        formatColumn: function(key, item) {
          //console.log('formatcol', key, item, typeof(item));
          var resp = this.formatcolumns[key];
          if (resp!=null) return resp(item);
          return item;
        },
        sortBy: function(key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
        //console.log('sortkey', this.sortKey);
        //console.log('sortOrder', this.sortOrders[key]);
        bus.$emit('onSorting',this.sortKey, this.sortOrders[key]);
        },
      showPop(itm) {
        bus.$emit('onSelectedItem',itm);
        this.showModal=true;
      }
    }
}
</script>

<style scoped>

body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

tbody tr:hover td {
    background-color: yellow;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

.modal-title {
  display:inline-block;
  background-color:yellow;
}

</style>