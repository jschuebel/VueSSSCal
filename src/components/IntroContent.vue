 <template>
 <div>

<div class="month">
    <ul>
        <li class="prev" @click="PrevMonth">&#10094;</li>
        <li class="next" @click="NextMonth">&#10095;</li>
        <li>{{currDateMonth}}<br><span style="font-size:18px">{{currDateYear}}</span></li>
    </ul>
</div>

<ul class="weekdays">
    <li>Sun</li>
    <li>Mon</li>
    <li>Tue</li>
    <li>Wed</li>
    <li>Thu</li>
    <li>Fri</li>
    <li>Sat</li>
</ul>

<div class="days">
        <div  v-for="dy in calDays"  v-bind:class="{ daycont: true, active: dy.pageNo==(new Date().getDate())}">
            <div class='daypg'>{{dy.pageNo}}</div>
            <div class='daylbl' v-for="dyl in dy.events" @click="ShowPop(dyl.description)">{{dyl.label}}</div>
        </div>
</div>

    <h2>{{sectionTitle}}</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>

 </div>
</template>

<script>


Date.prototype.ToShortDateString = function () { 
    return `${this.getMonth()+1}-${this.getDate()}-${this.getFullYear()}`; 
};
Date.prototype.isLeapYear = function () { 
    return (((this.getFullYear() % 4 === 0) && (this.getFullYear() % 100 !== 0)) || (this.getFullYear() % 400 === 0)); 
};

Date.prototype.getDaysInMonth = function () {
    return [31, (this.isLeapYear() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()];
};

Date.prototype.addMonths = function (value) {
    //console.log('addmonth', this, ' value', value);
    let ndate=new Date(this); 
    var n = ndate.getDate();
    ndate.setDate(1);
    ndate.setMonth(ndate.getMonth() + value);
    ndate.setDate(Math.min(n, ndate.getDaysInMonth()));
    return ndate;
};

Date.prototype.addDays = function (value) {
    this.setDate(this.getDate() + value);
    return this;
};

import { text } from '@fortawesome/fontawesome-svg-core';
export default {
    data(){
        return {
            sectionTitle:'test content',
            calDays: [],
          TotalRows:0,
          currentPage:1,
          currentPageSize:9999,
          sortKey:"userName", 
          sortDirection:"asc",
            calEvents: [],
            currDateMonth:'',
            currDateYear:'',
            currDate : new Date(`${(new Date()).getMonth()+1}-01-${(new Date()).getFullYear()}`),
            startDate : new Date(),
            endDate : new Date(),
            isActive:true
        }
    },
    created(){
        this.search();
    },
    methods:{
        UpdateCalendar(numWeeks) {
                //console.log('created', this.calDays);

                var cDate = new Date(this.startDate);
                for(var i=0;i<(numWeeks * 7);i++) {
                    let cDay=cDate.getDate();
                    let cMonth=cDate.getMonth();
                    let cYear=cDate.getYear();
                    var dayptr = {pageNo: cDay, events:[]};
                    this.calEvents.forEach(item => {
                        let iDate = new Date(item.date);
                        let iDay=iDate.getDate();   
                        let iMonth=iDate.getMonth();
                        let iYear=iDate.getYear();
                        if ((item.topicId===0 && iMonth===cMonth && iDay===cDay && iYear===cYear) ||
                                (item.topicId===1 && iMonth===cMonth && iDay===cDay))
                             dayptr.events.push({ label : item.topic, description : item.description });
                    });
                    this.calDays.push(dayptr);
                    cDate.addDays(1);

                }
                
                

        },
        PrevMonth(){
            this.currDate = this.currDate.addMonths(-1);
            this.search();
           
        },
        NextMonth(){
           this.currDate = this.currDate.addMonths(1);
           this.search();
        },
    	search: function () {
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                this.calDays=[];
                //console.log('currMonth', this.currDate);
                
                let currMonthfirstDay = this.currDate.getDay();
                //console.log('currMonthfirstDay', currMonthfirstDay);
                let currMonthlastDay = this.currDate.getDaysInMonth();
                //console.log('currMonthlastDay', currMonthlastDay);
                this.currDateMonth=monthNames[this.currDate.getMonth()];
                this.currDateYear=this.currDate.getFullYear();

                let prevMonth = this.currDate.addMonths(-1);
                let prevMonthID=prevMonth.getMonth();
                let prevYearID=prevMonth.getFullYear();
                //console.log('prevMonth', prevMonth);
                let prevMonthLastDay = prevMonth.getDaysInMonth();
                //console.log('prevDaysInMonth', prevMonthLastDay);

                let nextMonth = this.currDate.addMonths(1);
                //console.log('nextMonth date', nextMonth);
                let nextMonthLastDay = nextMonth.getDaysInMonth();
                //console.log('nextDaysInMonth', nextMonthLastDay);
 

                //find days of prior month=number of days i.e may 31 - start day of the week of current month 0=Sun, 1=mond
                if (currMonthfirstDay===0)
                    this.startDate = new Date(`${this.currDate.getMonth()+1}-01-${this.currDateYear}`);
                else
                {
                    let prevMonthDays = prevMonthLastDay - (currMonthfirstDay-1);
                    this.startDate = new Date(`${prevMonthID+1}-${prevMonthDays}-${prevYearID}`);
                }
                //console.log('startdate', this.startDate);

                let currMonthDays = (currMonthfirstDay+currMonthlastDay);
                let numWeeks =  Math.floor(currMonthDays / 7);
                //console.log('numWeeks1', numWeeks);
                if ((currMonthDays % 7.0) > 0.0) numWeeks++;
                //console.log('numWeeks2', numWeeks);
                let nextMonthStartDays = ((numWeeks * 7) - currMonthDays);
                //console.log("nextMonthStartDays", nextMonthStartDays);

                this.endDate = new Date(`${nextMonth.getMonth()+1}-${nextMonthStartDays}-${nextMonth.getFullYear()}`);
                //console.log("endDate1", this.endDate);
                if (nextMonthStartDays == 0)
                        this.endDate = new Date(`${this.currDate.getMonth()+1}-${currMonthlastDay}-${this.currDateYear}`);
                //console.log("endDate2", this.endDate);

            //console.log('startDate.ToShortDateString()', this.startDate.ToShortDateString());
            //console.log('endDate.ToShortDateString()', this.endDate.ToShortDateString());
//http://www.schuebelsoftware.com/SSSCalCoreApi/api/event/calendarsearch?startDate=5-31-2020&endDate=7-4-2020
//		  fetch(`http://localhost:5010/api/event?&${filterParams}`)
		  fetch(`http://api.schuebelsoftware.com/api/event/calendarsearch?startDate=${this.startDate.ToShortDateString()}&endDate=${this.endDate.ToShortDateString()}`)
				.then(response => {
                    this.TotalRows = parseInt(response.headers.get('Paging-TotalRecords'));
                    //console.log('fetch TotalRows', this.TotalRows);
                    return response.json()})
                            .then(json => {
                                  //console.log('fetch calEvents', json);
                                this.calEvents = json;
                                this.UpdateCalendar(numWeeks);
                    });
        },
        ShowPop(description) {
          alert('descrip=' +  description);
        }
     }
}
</script>

<style scoped>

/* Month header */
.month {
    padding: 20px 20px;
    width: 100%;
    background: #1abc9c;
    text-align: center;
}

    /* Month list */
    .month ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

        .month ul li {
            color: white;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

    /* Previous button inside month header */
    .month .prev {
        float: left;
        padding-top: 10px;
        cursor: pointer;
    }

    /* Next button */
    .month .next {
        float: right;
        padding-top: 10px;
        cursor: pointer;
    }

/* Weekdays (Mon-Sun) */
.weekdays {
    margin: 0;
    padding: 10px 0;
    background-color: #ddd;
}

    .weekdays li {
        display: inline-block;
        width: 13.6%;
        color: #666;
        text-align: center;
    }

/* Days (1-31) */
.days {
    padding: 0px 0px 0px 0px;
    margin: 0px 0px 0px 0px;
    width: 100%;
    background:white;
    height: 705px;
   }

    .daycont {
        background: #eee;
        width: 13.6%;
        height:115px;
        padding: 0px 0px 0px 0px;
        margin: 0px 0px 0px 0px;
        border: 1px solid #1abc9c;
        float: left;
        overflow:auto;
    }

    /* Highlight the "current" day */
    .active.daycont{
            padding: 5px;
            background:#1abc9c !important;
        }
.daypg {
    padding: 0px 0px 0px 0px;
    margin: 0px 0px 0px 0px;
    width: 100%;
    display: inline-block;
    text-align: right;
    font-size: 12px;
    color: #777;
    }

.daylbl {
    background: DarkCyan;
    border-radius: 25px;
    padding: 0px 40px 0px 0px;
    margin: 0px 0px 0px 0px;
    width: 100%;
    display: inline-block;
    text-align: left;
    font-size: 12px;
    color: white;
}


</style>