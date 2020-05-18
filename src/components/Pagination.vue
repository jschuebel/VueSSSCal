<template>
    <nav>
        <ul class="pagination justify-content-center">
            <li class='page-item'>
                <a class="page-link"  @click="setPage(1)">First</a>
            </li>
            <li class='page-item'>
                <a class="page-link" @click="setPage(pager.currentPage - 1)">Previous</a>
            </li>

            <li v-for="(cpage, index) in pager.pages" :key="cpage.id" v-bind:class="{'page-item':true, active:cpage===page}">
                <a class="page-link"  @click="setPage(cpage)">{{cpage}}</a>
            </li>
            <li class='page-item'>
                <a class="page-link" @click="setPage(pager.currentPage + 1)">Next</a>
            </li>
            <li class='page-item'>
                <a class="page-link" @click="setPage(pager.totalPages)">Last</a>
            </li>
        </ul>
    </nav>
</template>
</template>
<script>
import bus from '../main'

export default {
    props: {
        totalRows : { type:Number, default:1 },
        page : { type:Number, default:1 },
        pagesize : { type:Number, default:10 }
    },
    watch: {
        totalRows: function (updatedRowCount) {
            console.log('The totalRows has changed!');
           this.pager = this.getPager(this.totalRows, this.page, this.pagesize);
           this.setPage(this.page);
        }
    },
   data(){
        return {
            pager:{}
        }
    },
    computed: {
    },
    mounted(){
       console.log('mounted page', this.page, 'pagesize', this.pagesize, 'totalrows', this.totalRows);
        //this.setPage(this.initialPage);
    },
    methods:{
        setPage(page) {
            console.log('pagination setpage page', page, 'pagesize', this.pagesize, 'pager totalpages',this.pager.totalPages, 'totalrows', this.totalRows);
            if (page < 1 || page > this.pager.totalPages) {
                return;
            }
            // get new pager object for specified page
            this.pager = this.getPager(this.totalRows, page, this.pagesize);
        
            // call change page function in parent component
            if (this.page!==page)
                bus.$emit('onChangePage',page);
            
        },
        getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
 
        // default page size is 10
        pageSize = pageSize || 10;
 
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
 
        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
 
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }


    }
            

}
</script>

