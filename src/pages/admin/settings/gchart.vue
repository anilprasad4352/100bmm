<template>
  <v-card>
    <v-layout v-if="!loading" row wrap align-center>
	<v-flex xs12 sm12 class="ml-4 mt-3 tabsx" id="tbasprint">
	<v-btn color="primary"
          @click.stop="changeTabs('tab1')"
		  :color="currentTabs === 'tab1' ? 'primary' : 'secondary'"
          class="white--text"
			>Audience </v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab2')"
		  :color="currentTabs === 'tab2' ? 'primary' : 'secondary'"
          class="white--text"
			>Active User </v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab3')"
		  :color="currentTabs === 'tab3' ? 'primary' : 'secondary'"
          class="white--text"
			>Group Pages</v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab4')"
		  :color="currentTabs === 'tab4' ? 'primary' : 'secondary'"
          class="white--text"
			>Demographics</v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab5')"
		  :color="currentTabs === 'tab5' ? 'primary' : 'secondary'"
          class="white--text"
			>User Explore</v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab6')"
		  :color="currentTabs === 'tab6' ? 'primary' : 'secondary'"
          class="white--text"
			>Engagement</v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab7')"
		  :color="currentTabs === 'tab7' ? 'primary' : 'secondary'"
          class="white--text"
			>OS Uses</v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab8')"
		  :color="currentTabs === 'tab8' ? 'primary' : 'secondary'"
          class="white--text"
			>Device Uses</v-btn>
			<v-btn color="primary"
          @click.stop="changeTabs('tab9')"
		  :color="currentTabs === 'tab9' ? 'primary' : 'secondary'"
          class="white--text"
			>Device Brands</v-btn>
	</v-flex>
	 <v-flex xs4 sm4 class="ml-4 mt-3">
	 <v-btn color="primary" @click.stop="exportXLX()">EXCEL</v-btn>
	 <v-btn color="default" @click.click="exportCSV()">CSV</v-btn>
	 <v-btn color="error" @click.click="exportPDF()">PDF</v-btn>
	  </v-flex>
      <v-flex xs7 sm7 class="ml-4 mt-3">
	  
          <v-menu
            lazy
            :close-on-content-click="false"
            v-model="menuStart"
            transition="scale-transition"
            offset-y
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
            >
            <v-text-field
              slot="activator"
              label="Start Date"
              v-model="startDate"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="startDate" no-title scrollable autosave>
            </v-date-picker>
          </v-menu>
          <v-menu 
            lazy
            :close-on-content-click="false"
            v-model="menuEnd"
            transition="scale-transition"
            offset-y
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
            >
            <v-text-field
              slot="activator"
              label="End Date"
              v-model="endDate"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="endDate" no-title scrollable autosave>
            </v-date-picker>
          </v-menu>
		 
        </v-flex>
		<v-flex xs12 class="mt-3" id="tab2">
		<h4>Active User Overview</h4><br>
		<v-card flat>
            <vue-highcharts :options="chart" ref="area"/>
        </v-card>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab3">
		<h4>Group Pages Overview</h4><br>
         <table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>Group Page</th>
		 <th>PageViews</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab3data">
		 <td>{{entry[0]}}</td><td>{{entry[1]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab4">
		<h4>Demographics Overview</h4><br>
		<table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>City</th>
		 <th>Users</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab4data">
		 <td>{{entry[0]}}</td><td>{{entry[1]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab5">
		<h4>User Overview</h4><br>
		 <table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>Username</th>
		 <th>Number of users</th>
		 <th>Session</th>
		 <th>PageViews</th>
		 <th>Exit Rate</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab5data">
		 <td>{{entry[0]}}</td>
		 <td>{{entry[1]}}</td>
		 <td>{{entry[2]}}</td>
		 <td>{{entry[3]}}</td>
		 <td>{{entry[4]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab6">
		<h4>Engagement Overview</h4><br>
		 <table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>Session Duration</th>
		 <th>Sessions</th>
		 <th>PageViews</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab6data">
		 <td>{{entry[0]}}</td>
		 <td>{{entry[1]}}</td>
		 <td>{{entry[2]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab7">
		<h4>OS Uses</h4><br>
		 <table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>OS</th>
		 <th>Number of users</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab7data">
		 <td>{{entry[0]}}</td>
		 <td>{{entry[1]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab8">
		<h4>Device Uses</h4><br>
		 <table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>Device</th>
		 <th>Number of users</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab8data">
		 <td>{{entry[0]}}</td>
		 <td>{{entry[1]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab9">
		<h4>Device Brand overview</h4><br>
		 <table class="table table-stripped table-bordered" id="hidden-table1">
		 <thead>
		 <tr>
		 <th>Device brand</th>
		 <th>Number of users</th>
		 </tr>
		 </thead>
		 <tbody>
		 <tr v-for="entry in tab9data">
		 <td>{{entry[0]}}</td>
		 <td>{{entry[1]}}</td>
		 </tr>
         </tbody>
		 </table>
		</v-flex>
		<v-flex xs12 class="mt-3" id="tab1">
      <v-flex xs12 class="mt-3" id="hidden-table1">
	  <h4>Audience Overview</h4><br>
        <v-card flat>
            <vue-highcharts :options="chart" ref="area"/>
        </v-card>
      </v-flex>
	  <v-flex xs12 xs12 sm12 class="mt-3 float-leftx">
       <v-btn color="primary"
          @click.stop="changeMetrics('traffic')"
		  :color="currentMetric === 'traffic' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn1"
			>Users ({{visitsc1}})</v-btn>
			<v-btn color="primary"
          @click.stop="changeMetrics('sessions')"
		  :color="currentMetric === 'sessions' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn2"
			>Sessions ({{visitsc2}}) </v-btn>
			<v-btn color="primary"
          @click.stop="changeMetrics('pageview')"
		  :color="currentMetric === 'pageview' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn3"
			>PageView ({{visitsc3}})</v-btn>
			<v-btn color="primary"
          @click.stop="changeMetrics('pagesession')"
		  :color="currentMetric === 'pagesession' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn4"
			>Page/Session ({{visitsc4}})</v-btn>
			<v-btn color="primary"
          @click.stop="changeMetrics('avgdur')"
		  :color="currentMetric === 'avgdur' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn5"
			>Avg. Session Duration ({{visitsc5}})</v-btn>
			<v-btn color="primary"
          @click.stop="changeMetrics('bounce')"
		  :color="currentMetric === 'bounce' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn6"
			>Bounce Rate ({{visitsc6}}%)</v-btn>
			<v-btn color="primary"
          @click.stop="changeMetrics('newsession')"
		  :color="currentMetric === 'newsession' ? 'primary' : 'secondary'"
          class="white--text btn-analytics btn7"
			>% New sessions ({{visitsc7}}%)</v-btn>
            <v-btn color="primary"
          @click.stop="changeMetrics('newusersvsret')"
		  :color="currentMetric === 'newusersvsret' ? 'primary' : 'secondary'"
          class="white--text btn-analytics"
			>New Users vs Returning User</v-btn>
       
		 </v-flex>
      </v-flex>
	  <v-flex xs12 xs12 sm12 class="mt-3 hidden-table" id="hidden-table">
	 <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in exportvisits">
        <td>
          {{entry[0]}}
        </td>
		<td>
          {{entry[1]}}
        </td>
      </tr>
    </tbody>
  </table>
  </v-flex>
    </v-layout>
    
    <v-container v-if="loading" fill-height>
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>
  
  </v-card>
</template>
<script>
  import VueHighcharts from 'vue2-highcharts'
  import axios from 'axios'
  import moment from 'moment'

  export default {
    components: {
      VueHighcharts
    },
    computed: {
	styles () {
        return this.$store.getters.getStyles
      },
      chart () {
        const self = this
        return {
          chart: {
            type: self[self.currentMetric].graph
          },
          title: {
            text: self[self.currentMetric].title
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            allowDecimals: false,
            categories: this.categories,
            labels: {
              formatter: function () {
                return this.value // clean, unformatted number for year
              }
            }
          },
          yAxis: {
            title: {
              text: self[self.currentMetric].yAxis.title
            },
            labels: {
              formatter: function () {
                return this.value
              }
            }
          },
          tooltip: {
            pointFormat: self[self.currentMetric].tooltipText
          },
          plotOptions: {
            area: {
              pointStart: 0,
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                  hover: {
                    enabled: true
                  }
                }
              }
            },
			 pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
          },
          series: [{
            name: self[self.currentMetric].seriesName,
            data: this.visits,
            color: this.styles.general.theme_color_light
          }]
        }
      }
    },
    watch: {
      'endDate': function () {
        this.loadChartData()
      },
      'startDate': function () {
        this.loadChartData()
      }
    },
    mounted () {
      this.loadChartData()
    },
    data: () => ({
      menuItems: [
        {
          title: 'User Overview',
          value: 'traffic'
        },
	    {
  	      title: 'Sessions Overview',
          value: 'sessions'
        },
	    {
          title: 'PageView Overview',
          value: 'pageview'
        },
	    {
          title: 'Session per page',
          value: 'pagesession'
        },
	    {
          title: 'Avg Duration',
          value: 'avgdur'
        },
	    {
          title: 'Bounce Rate',
          value: 'bounce'
        },
	    {
          title: '% New sessions',
          value: 'newsession'
        },
	    {
          title: 'New User',
          value: 'newusers'
        },
		{
          title: 'New User vs Returning users',
          value: 'newusersvsret'
        },
		{
          title: 'Group Pages',
          value: 'grouppages'
        },
		{
          title: 'Demographics Report',
          value: 'demograph'
        },
		{
          title: 'Active Users Report',
          value: 'activeusers'
        },
		{
          title: 'Engagement Session Report',
          value: 'engagement'
        },
		{
          title: 'Engagement Pageview Report',
          value: 'engagementpv'
        },
		{
          title: 'OS uses',
          value: 'osuses'
        }
      ],
	  visitsc1 : '',
	  visitsc2 : '',
	  visitsc3 : '',
	  visitsc4 : '',
	  visitsc5 : '',
	  visitsc6 : '',
	  visitsc7 : '', 
	  tab3data: [],
	  tab4data: [],
	  tab5data: [],
	  tab6data: [],
	  tab7data: [],
	  tab8data: [],
	  tab9data: [],
	  exportvisits: [],
      currentMetric: 'traffic',
	  currentTabs: 'tab1',
      currentDimension: 'ga:date',
      traffic: {
        title: '<b>User Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> Users',
        seriesName: 'User Analytics',
        metrics: 'ga:users',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  engagement: {
        title: '<b>Engagement Session Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of Session'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> Session',
        seriesName: 'Engagement Session Analytics',
        metrics: 'ga:sessions',
		dimensions:  'ga:sessionDurationBucket',
		graph:  'areaspline'
      },
	  engagementpv: {
        title: '<b>Engagement PageView Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of PageView'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> PageView',
        seriesName: 'Engagement Session Analytics',
        metrics: 'ga:pageviews',
		dimensions:  'ga:sessionDurationBucket',
		graph:  'areaspline'
      },
	  activeusers: {
        title: '<b>Active User Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> Users',
        seriesName: 'Active User Analytics',
        metrics: 'ga:30dayUsers',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  demograph: {
        title: '<b>Demographics Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> Users',
        seriesName: 'Demographics User Analytics',
        metrics: 'ga:users',
		dimensions:  'ga:city',
		graph:  'areaspline'
      },
	  sessions: {
        title: '<b>Sessions Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of Sessions'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> Sessions',
        seriesName: 'Sessions Analytics',
        metrics: 'ga:sessions',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  pageview: {
        title: '<b>PageView Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of PageView'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> PageView',
        seriesName: 'PageView Analytics',
        metrics: 'ga:pageviews',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  pagesession: {
        title: '<b>Page Per Session Overview</b>',
        subtitle: '',
        yAxis: {
          title: 'Number of Session per page'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> sessions',
        seriesName: 'Page Session',
        metrics: 'ga:pageviewsPerSession',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  avgdur: {
        title: '<b>Avg Duration</b>',
        subtitle: '',
        yAxis: {
          title: 'time'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/> ms',
        seriesName: 'Avg Duration',
        metrics: 'ga:avgSessionDuration',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  bounce: {
        title: '<b>Bounce Rate</b>',
        subtitle: '',
        yAxis: {
          title: 'Bounce Rate'
        },
        tooltipText: '<b>{point.y:,.0f}</b><br/>',
        seriesName: 'Bounce Rate',
        metrics: 'ga:bounceRate',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  newsession: {
        title: '<b>% New sessions</b>',
        subtitle: '',
        yAxis: {
          title: 'New Session in(%)'
        },
        tooltipText: '<b>{point.y:,.0f}</b> %',
        seriesName: 'New sessions',
        metrics: 'ga:percentNewSessions',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  newusers: {
        title: '<b>New Users</b>',
        subtitle: '',
        yAxis: {
          title: 'Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b> users',
        seriesName: 'Dates',
        metrics: 'ga:newUsers',
		dimensions:  'ga:date',
		graph:  'areaspline'
      },
	  newusersvsret: {
        title: '<b>New Users vs Returning User</b>',
        subtitle: '',
        yAxis: {
          title: 'Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b> users',
        seriesName: 'Dates',
        metrics: 'ga:newUsers',
		dimensions:  'ga:date',
		graph:  'pie'
      },
	  grouppages: {
	   title: '<b>Group Pages</b>',
        subtitle: '',
        yAxis: {
          title: 'pageview'
        },
        tooltipText: '<b>{point.y:,.0f}</b> users',
        seriesName: 'Group',
        metrics: 'ga:pageviews',
		dimensions:  'ga:pagePath',
		graph:  'line'
	  },
      startDate: moment(new Date()).add(-1, 'days').subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: moment(new Date()).add(-1, 'days').format('YYYY-MM-DD'),
      menuStart: false,
      menuEnd: false,
      loading: false,
      itemsz: [
        {
          name: 'Events',
          tabId: 'events'
        }
      ],
      categories: [],
      visits: [],
      text: '',
      trafficChart: ''
    }),
    methods: {
      loadChartData () {
        this.loading = true
        var self = this       
		let maxResults = 999999
		let sort1 = '-ga:date'
        const yesterday = moment(new Date()).add(-1, 'days')
        let startDate = self.startDate
        let endDate = self.endDate
		let metrics1 = 'ga:users'
        let dimensions1 = 'ga:date'
		var u='?metrics=' + metrics1 + '&dimensions=' + dimensions1 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
          let categories = []
          if (response.data.rows.length !== 0) {
		     var count=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseInt(dateValue[1],0)              
            })
			self.visitsc1=count			
          }
		 
        })
		.catch(function (error) {
           console.log(error)
        })
		let metrics2 = 'ga:sessions'
        let dimensions2 = 'ga:date'        
		var u='?metrics=' + metrics2 + '&dimensions=' + dimensions2 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)        
        .then((response) => {
          if (response.data.rows.length !== 0) {
		     var count=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseInt(dateValue[1],0)              
            })
			self.visitsc2=count				
          }
		 
            })
		let metrics3 = 'ga:pageviews'
        let dimensions3 = 'ga:date'
        var u='?metrics=' + metrics3 + '&dimensions=' + dimensions3 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
          if (response.data.rows.length !== 0) {
		     var count=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseInt(dateValue[1],0)              
            })
			self.visitsc3=count			
          }
		 
            })
		let metrics4 = 'ga:pageviewsPerSession'
        let dimensions4 = 'ga:date'
        var u='?metrics=' + metrics4 + '&dimensions=' + dimensions4 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
          if (response.data.rows.length !== 0) {
		     var count=0
		     var dcount=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseFloat(dateValue[1],0)
            dcount++  			
            })
			self.visitsc4=parseFloat(count/dcount).toFixed(2)	
          }
		    })
		let metrics5 = 'ga:avgSessionDuration'
        let dimensions5 = 'ga:date'
        var u='?metrics=' + metrics5 + '&dimensions=' + dimensions5 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
          if (response.data.rows.length !== 0) {
		     var count=0
		     var dcount=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseFloat(dateValue[1],0)
            dcount++  			
            })
			var sec=parseFloat(count/dcount).toFixed(2)
			var min=sec/60			
			sec=sec%60
			self.visitsc5='00:' + parseInt(min) + ':' + parseInt(sec)
          }
            })
		let metrics6 = 'ga:bounceRate'
        let dimensions6 = 'ga:date'
        var u='?metrics=' + metrics6 + '&dimensions=' + dimensions6 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
          if (response.data.rows.length !== 0) {
		     var count=0
		     var dcount=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseFloat(dateValue[1],0)
            dcount++  			
            })
			self.visitsc6=parseFloat(count/dcount).toFixed(2)	
          }
            })
		let metrics7 = 'ga:percentNewSessions'
        let dimensions7 = 'ga:date'
        var u='?metrics=' + metrics7 + '&dimensions=' + dimensions7 + '&sort=' + sort1 + '&maxResults=' + maxResults + '&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
          if (response.data.rows.length !== 0) {
		     var count=0
		     var dcount=0
            response.data.rows.forEach((dateValue) => {
			count = count + parseFloat(dateValue[1],0)
            dcount++  			
            })
			self.visitsc7=parseFloat(count/dcount).toFixed(2)	
          }
            })	
        let metrics = self[self.currentMetric].metrics
        let dimensions = self[self.currentMetric].dimensions
		let sort = '-ga:date'
        if(dimensions=='ga:pagePath'){
		sort = 'ga:pageviews'
        }else if(dimensions=='ga:city'){
		sort = 'ga:users'
		}else if(dimensions=='ga:sessionDurationBucket' && metrics=='ga:sessions'){
		sort='-ga:sessions'
		}else if(dimensions=='ga:sessionDurationBucket' && metrics=='ga:pageviews'){
		sort='-ga:pageviews'
		}else{		
        sort = '-ga:date'
		}
        
        const params = {
          metrics,
          dimensions,
          sort,
          maxResults,
          startDate,
          endDate
        }
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports', {
          params
        })
        .then((response) => {
          let categories = []
          let visits = []
          let exportvisits = []
		  exportvisits = response.data.rows
          if (response.data.rows.length !== 0) {
		  
            response.data.rows.forEach((dateValue) => {
			console.log(typeof dateValue[0])
			if(typeof  parseInt(dateValue[0]) !== NaN){
              categories.push(moment(dateValue[0]).format('MM/DD'))
			  }else{
			  categories.push(moment(dateValue[0]))
			  }
              visits.push(parseInt(dateValue[1], 0))
            })
			
          }
		  self.exportvisits=exportvisits.reverse()
		  console.log(self.exportvisits)
          self.categories = categories.reverse()
          self.visits = visits.reverse()		  
		  if(self.currentMetric=="traffic"){		 
		  var total_u=0
		  for(var i=0; i<self.visits.length; i++){
		  total_u=total_u + self.visits[i]
		  }
          window.localStorage.setItem('total_u',total_u)
		  }
		  if(self.currentMetric=='newusersvsret'){
		  var total_u=0
		   for(var i=0; i<self.visits.length; i++){
		  total_u=total_u + self.visits[i]
		  }
		  self.visits=[{name:'New users',y:total_u},{name: 'Returning Users',y:parseInt(window.localStorage.getItem('total_u'))-total_u}]         
		  }
		  this.loading = false
        })
      },
      changeMetrics (value) {
        this.currentMetric = value
        this.loadChartData()
      },
	  changeTabs (value) {
	  let self = this
	  let startDate = self.startDate
      let endDate = self.endDate
	  this.currentTabs = value
	  document.getElementById('tab1').style.display="none"
	  document.getElementById('tab2').style.display="none"
	  document.getElementById('tab3').style.display="none"
	  document.getElementById('tab4').style.display="none"
	  document.getElementById('tab5').style.display="none"
	  document.getElementById('tab6').style.display="none"
	  document.getElementById('tab7').style.display="none"
	  document.getElementById('tab8').style.display="none"
	  document.getElementById('tab9').style.display="none"
	  document.getElementById(value).style.display="block"
	  if(value=='tab1'){
	  self.currentMetric= 'traffic'
	  }
	  if(value=='tab2'){
	  self.currentMetric= 'activeusers'
	  }
	  if(value=='tab3'){
	  var u='?metrics=ga:pageviews&dimensions=ga:pagePath&sort=-ga:pageviews&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab3data= []
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
              if(dateValue[0].search(/\/group\//i)!==-1 || dateValue[0].search(/\/groups\//i)!==-1){	
               console.log('found')			  
			 self.tab3data.push(dateValue)
             self.exportvisits.push(dateValue)			 
			 }
            })			 
          }
            })
	  }
	  if(value=='tab4'){
	  var u='?metrics=ga:users&dimensions=ga:city&sort=-ga:users&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab4data = []
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
             self.tab4data.push(dateValue)
             self.exportvisits.push(dateValue)
            })			 
          }
            })
	  }
	  if(value=='tab5'){
	  var u='?metrics=ga:users,ga:sessions,ga:pageviews,ga:exitRate&dimensions=ga:userDefinedValue&sort=-ga:users&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab5data = []
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
             self.tab5data.push([dateValue[0], dateValue[1], dateValue[2], dateValue[3], parseFloat(dateValue[4]).toFixed(2)])
             self.exportvisits.push(dateValue)
            })			 
          }
            })
	  }
	  if(value=='tab7'){
	  var u='?metrics=ga:users&dimensions=ga:operatingSystem&sort=-ga:users&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab7data = []
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
             self.tab7data.push(dateValue)
             self.exportvisits.push(dateValue)
            })			 
          }
            })
	  }
	  if(value=='tab8'){
	  var u='?metrics=ga:users&dimensions=ga:deviceCategory&sort=-ga:users&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab8data = []
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
             self.tab8data.push(dateValue)
             self.exportvisits.push(dateValue)
            })			 
          }
            })
	  }
	  if(value=='tab9'){
	  var u='?metrics=ga:users&dimensions=ga:mobileDeviceBranding&sort=-ga:users&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab9data = []
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
             self.tab9data.push(dateValue)
             self.exportvisits.push(dateValue)
            })			 
          }
            })
	  }
	  if(value=='tab6'){
	  var u='?metrics=ga:sessionDuration,ga:sessions,ga:pageviews&dimensions=ga:date,ga:sessionCount&sort=-ga:sessionDuration&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
		axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
        .then((response) => {
		  self.exportvisits= []
		  self.tab6data = []
		  var l1=0
		  var l2=0
		  var l3=0
		  var l4=0
		  var l5=0
		  var l6=0
		  var l7=0
		  var m1=0
		  var m2=0
		  var m3=0
		  var m4=0
		  var m5=0
		  var m6=0
		  var m7=0
          if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
             if(dateValue[2]<=1000){
			 l1= l1 + parseInt(dateValue[4])/10
			 m1= m1 + parseInt(dateValue[3])
			 }			 
			 else if(dateValue[2]<=3000){
			 l2= l2 + parseInt(dateValue[4])/10
			 m2= m2 + parseInt(dateValue[3])
			 }
			 else if(dateValue[2]<=6000){
			 l3= l3 + parseInt(dateValue[4])/10
			 m3= m3 + parseInt(dateValue[3])
			 }
			 else if(dateValue[2]<=18000){
			 l4= l4 + parseInt(dateValue[4])/10
			 m4= m4 + parseInt(dateValue[3])
			 }
			 else if(dateValue[2]<=60000){
			 l5= l5 + parseInt(dateValue[4])/10
			 m5= m5 + parseInt(dateValue[3])
			 }
			 if(dateValue[2]<=180000){
			 l6= l6 + parseInt(dateValue[4])/10
			 m6= m6 + parseInt(dateValue[3])
			 }
			 else{
			 l7= l7 + parseInt(dateValue[4])/10
			 m7= m7 + parseInt(dateValue[3])
			 }
            })	
             self.tab6data.push(['0-10 Seconds',parseInt(l1),m1])
             self.tab6data.push(['11-30 Seconds',parseInt(l2),m2])
             self.tab6data.push(['31-60 Seconds',parseInt(l3),m3])
             self.tab6data.push(['61-180 Seconds',parseInt(l4),m4])
             self.tab6data.push(['181-600 Seconds',parseInt(l5),m5])
             self.tab6data.push(['601-1800 Seconds',parseInt(l6),m6])
             self.tab6data.push(['1800 +  Seconds',parseInt(l7),m7])
			 self.exportvisits.push(['0-10 Seconds',parseInt(l1),m1])
             self.exportvisits.push(['11-30 Seconds',parseInt(l2),m2])
             self.exportvisits.push(['31-60 Seconds',parseInt(l3),m3])
             self.exportvisits.push(['61-180 Seconds',parseInt(l4),m4])
             self.exportvisits.push(['181-600 Seconds',parseInt(l5),m5])
             self.exportvisits.push(['601-1800 Seconds',parseInt(l6),m6])
             self.exportvisits.push(['1800 +  Seconds',parseInt(l7),m7])             	
          }
            })
	  }
	  },
	  exportXLX () {
        var blob = new Blob([document.getElementById('hidden-table').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8"
        })
        saveAs(blob, "Report.xls")
      },
	  exportCSV () {
	  var str=''
	  let self = this	  
	  for(var i=0; i<this.exportvisits.length; i++){
	  if(self.currentTabs=='tab5'){
	  str=str + this.exportvisits[i][0] + ',' + this.exportvisits[i][1] + ',' + this.exportvisits[i][2] + ',' + this.exportvisits[i][3] + ',' + this.exportvisits[i][4] + '\n'
	  }else{
	  str=str + this.exportvisits[i][0] + ',' + this.exportvisits[i][1] + '\n'
	  }
	  }
        var blob = new Blob([str], {
            type: "application/csv; charset=utf-8"
        })
        saveAs(blob, "Report.csv")
      },
	  exportPDF () {
	  let self = this
	  var html=document.getElementById('tbasprint').innerHTML + '<h3>All Web Site Data </h3>' + '<br><br><br>' + self.startDate + ' - ' + self.endDate;
console.log(html);   
   }
    }
  }
</script>
<style>
  .navigation-drawer {
    position: fixed; 
  }
   #stats {
    color: #fff; 
    text-align: center; 

  }

  #stats #stat {
    margin-bottom: 26px; 
    margin-top: 70px; 
    margin-right: 20px; 
    max-width: 400px !important; 
  }
  .stat_title {
    width: 100%; 
    text-align: left; 
  }
  .stat_title > h4 {
    line-height: 15px !important; 
  }
</style>
