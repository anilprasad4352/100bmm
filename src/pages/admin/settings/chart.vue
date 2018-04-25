<template>
  <v-card>
    <v-toolbar class="homepage-tool elevation-0 white--text theme--dark " :style="{backgroundColor: styles.general.theme_color_light}" >
      <v-layout row wrap class="mt-4">
        <v-flex>
          <h5 style="text-transform:uppercase; padding-left: 20px;">Exchange web analytics</h5>
        </v-flex>
        <v-flex xs12 sm12 class="center">
          <v-btn
            v-for="(item, i) in menuItems"
            v-bind:key="i"
            
            @click.stop="changeMetrics(item.value)"
            :class="currentMetric === item.value ? ' active' : 'no-active'"
            :style="{backgroundColor: styles.general.theme_color_light}"
          >{{ item.title }}
          </v-btn>
        </v-flex>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </v-layout>
    </v-toolbar>
    <v-container v-if="loading" fill-height>
      <v-layout row wrap align-center>
        <v-flex class="text-xs-center">
          <v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
    <v-layout v-if="!loading" row wrap align-center>
      <v-flex xs12 sm12 class="ml-4 mt-3">
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
            class="datepic"
            readonly
          ></v-text-field>
          <v-date-picker v-model="endDate" no-title scrollable autosave>
          </v-date-picker>
        </v-menu>
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
            class="datepic"
            readonly
          ></v-text-field>
          <v-date-picker v-model="startDate" no-title scrollable autosave>
          </v-date-picker>
        </v-menu>
		 
			  <v-select
          v-bind:items="selectItems"
          item-text="title"
          item-value="value"
          v-model="graphtype"			  
          label="Select"
          @change="changeMetricsx"
          class="datepic select_pic"
          single-line
          bottom
        >
			  </v-select>
      </v-flex>
      <v-flex xs12 class="mt-3">
        <v-card flat>
          <vue-highcharts :options="chart" ref="area"/>
        </v-card>
      </v-flex>
	    <v-layout row wrap>
        <v-flex xs6 sm6 mt-2  style="padding-right:5px;">
          <p class="page_head center" :style="{color: styles.general.theme_color_light}"><b>Page Views by Location</b></p>
				  <div id="map" style="height:350px; border:0; width: 100%"></div>
        </v-flex>
        <v-flex xs6 sm6 mt-2 style="padding-left:5px;" >
          <p class="page_head center" :style="{color: styles.general.theme_color_light}"><b>Page Views by Page</b></p>
				  <table class="table">
						<tr v-for="(item, index) in toppages" :key="index">
						  <td class="tab1">{{ item[0] }}</td>
						  <td>
						    <Progressd :value="item[2]" class="mb-2"></Progressd>
						    <span> &nbsp;&nbsp;{{ item[1] | formatNumber }}({{ item[2] }}%)</span>
              </td>			
						</tr>
          </table>
				</v-flex>
      </v-layout>
    </v-layout>
  </v-card> 
</template>
<script>
  import VueHighcharts from 'vue2-highcharts'
  import axios from 'axios'
  import moment from 'moment'
  import Progressd from './Index/progress' 
  const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBCkHJdW4ChFLJ8cqJghc-LlhVU_FAl5G0'
  })
  export default {
    components: {
      VueHighcharts,
	    Progressd
    },
    filters: {
      formatNumber: function (value) {
        var str = value + ''; 
        var x = str.split('.'); 
        var x1 = x[0]; 
        var x2 = x.length > 1 ? '.' + x[1] : ''; 
        var rgx = /(\d+)(\d{3})/; 
        while (rgx.test(x1)) { 
            x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
        } 
        return x1+x2
      }
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      },
      chart () {
        const self = this
        return {
          chart: {
            type: 'areaspline'
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
            areaspline: {
              pointStart: 0,
              marker: {
                enabled: true,
                symbol: 'circle',
                radius: 0,
                states: {
                  hover: {
                    enabled: true
                  }
                }
              }
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
      graphtype: null,
      max: 50,
      value: 10,
      toppages: [],
      map:{},
      markers: [],
      infoWindow: {},
      menuItems: [
        {
          title: 'Traffic',
          value: 'traffic'
        },
        {
          title: 'New Users',
          value: 'newUsers'
        },
        {
          title: 'Time on Site',
          value: 'timeOnPage'
        },
        {
          title: 'Engagement',
          value: 'sessions'
        }
      ],
      selectItems: [
        {
          title: 'New User',
          value: 'newusers'
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
        }
      ],
      currentMetric: 'traffic',
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
      newusers: {
        title: '<b>New Users</b>',
        subtitle: '',
        yAxis: {
          title: 'Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b> users',
        seriesName: 'New Users',
        metrics: 'ga:newUsers',
        dimensions:  'ga:date',
        graph:  'areaspline'
      },
      traffic: {
        title: 'Exchange Traffic Analytics',
        subtitle: '',
        yAxis: {
          title: 'Numbers of page visits'
        },
        tooltipText: 'Website has <b>{point.y:,.0f}</b><br/>page visits',
        seriesName: 'Page Visit Analytics',
        metrics: 'ga:visits'
      },
      timeOnPage: {
        title: 'Exchange Time-on-site Analytics',
        subtitle: '',
        yAxis: {
          title: 'Time (in seconds)'
        },
        tooltipText: '<b>{point.y:,.0f}</b> seconds',
        seriesName: 'Time (in seconds) users spent on a particular page',
        metrics: 'ga:timeOnPage'
      },
      newUsers: {
        title: 'Exchange New Users Analytics',
        subtitle: '',
        yAxis: {
          title: 'Number of New Users'
        },
        tooltipText: '<b>{point.y:,.0f}</b> users',
        seriesName: 'Number of New Users Visit',
        metrics: 'ga:newUsers'
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
      geocode (address, cb) {
        return googleMapsClient.geocode({
          address
        }, cb)
      },
      goTo (link) {
        this.$router.push(link)
      },
      totalRecords (val) {
        this.recordsCount = val
      },
      removeMarkers () {
        let i
        for (i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null)
        }
        this.markers = []
      },
      moreInfo (val) {
        this.dialog = true
        this.item = val
      },
      loadChartData () {
        this.loading = true
        var self = this
        let metrics = this[this.currentMetric].metrics
        let dimensions = 'ga:date'
        let sort = '-ga:date'
        let maxResults = 30
        const yesterday = moment(new Date()).add(-1, 'days')
        let startDate = self.startDate
        let endDate = self.endDate
        if (this.optionType === 'week') {
          startDate = yesterday.format('YYYY-MM-DD')
          endDate = yesterday.subtract(30, 'days').format('YYYY-MM-DD')
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
          if (response.data.rows.length !== 0) {
            response.data.rows.forEach((dateValue) => {
              categories.push(moment(dateValue[0]).format('MM/DD'))
              visits.push(parseInt(dateValue[1], 0))
            })
          }
          self.categories = categories.reverse()
          self.visits = visits.reverse()
          this.loading = false
        })

        self.toppages = []
        let tp = []
        let count =0 
        //const yesterday = moment(new Date()).add(-1, 'days')
      
        let metrics1 = 'ga:pageviews'
        let dimensions1 = 'ga:pagePath'
        var u='?metrics=ga:pageviews&dimensions=ga:pagePath&sort=-ga:pageviews&maxResults=9999999&startDate=' + self.startDate + '&endDate=' + self.endDate
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
          .then((response) => {
            if (response.data.rows.length !== 0) {	
              response.data.rows.forEach((dateValue) => {
                tp.push(dateValue)
                count = count + parseInt(dateValue[1])
              })			 
            }	
            let tpd=[]		  
            let ctn=0;
            tp.forEach((dateValue) => {
              if(dateValue[0].search("redirect")==-1){
                ctn++
                if(ctn<=10){
                  tpd = []
                  tpd.push(dateValue[0])			  
                  tpd.push(dateValue[1])			  
                  tpd.push(parseInt(100*parseInt(dateValue[1])/count))
                  self.toppages.push(tpd)	
                }	
              }				
            })
          })
          var u='?metrics=ga:users&dimensions=ga:city&sort=-ga:users&maxResults=9999999&startDate=' + self.startDate + '&endDate=' + self.endDate
          axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
            .then((response) => {
              let val = []
              if (response.data.rows.length !== 0) {	
                response.data.rows.forEach((dateValue) => {
                  var psh={streetaddress:dateValue[0],count:dateValue[1]}
                  val.push(psh)
                })	
    
                let i
                let marker
                this.map = new window.google.maps.Map(document.getElementById('map'), {
                  zoom: 6,
                  center: new window.google.maps.LatLng(0, 0),
                  mapTypeId: window.google.maps.MapTypeId.ROADMAP
                })
                this.infoWindow = new window.google.maps.InfoWindow()
                this.removeMarkers()
                var bounds = new window.google.maps.LatLngBounds();
                for (i = 0; i < val.length; i++) {
                  const num = i // eslint-disable-line
                  this.num = i
                  // const self = this
                  this.geocode(val[i].streetaddress, (err, res) => {
                    if (err) {
                      return err
                    }
                    const location = res.json.results[0].geometry.location
            
                    marker = new window.google.maps.Marker({
                      position: new window.google.maps.LatLng(location.lat, location.lng),
                      map: self.map
                    })
                    var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                    this.markers.push(marker)
                    marker.setMap(self.map)
                    bounds.extend(loc);
                    self.map.fitBounds(bounds);
                    self.map.setCenter(bounds.getCenter());
                    //map.panToBounds(bounds);
                    //self.map.setZoom(self.map.getZoom()-1); 

                    
                    return window.google.maps.event.addListener(marker, 'click', ((marker, num, val) => {
                      return () => {
                        const desc = `
                          <div class="text-xs-center">
                            
                            <span class="primary--text mx-3"><b>${val[num].count} Page Views</b></span>
                            <p>${val[num].streetaddress}</p>
                          </div>
                        `
                        self.infoWindow.setContent(desc)
                        self.infoWindow.open(self.map, marker)
                      }
                    })(marker, num, val))
                  })
                }				
              }
            })
      },
      changeMetrics (value) {	  
        this.currentMetric = value
        this.loadChartData()
      },
      changeMetricsx: function(value) {
        let self = this
        self.graphtype = value
        this.currentMetric = value
        this.loadChartData()
      }
    }
  }
</script>
<style>
  #right {
    float: right !important;
  }
  .page_head{
    font-size: 16px;
  }
  .tab1{
    text-align:right;
    width:90px;
    padding-right: 10px;
  }
  .tab2{
    float:left;
    height:20px;
  }
  .application--light .table tr:not(:last-child){
    border-bottom:5px solid transparent !important;
    margin-top:5px;
  }
  .navigation-drawer {
    position: fixed;
  }
  .center {
    flex-direction: row;
    justify-content: center;
  }
  .stat_title {
    width: 100%;
    text-align: left;
  }
  .stat_title > h4 {
    line-height: 15px !important;
  }
  .datepic{
    width: 135px;
    margin-right: 20px;
  }
  .menu{
    float:right;
  }
  .select_pic{
    min-width:135px;
    width: auto !important;
    float: right;
    margin-top: -2px;
  }
  button.btn.btn--raised.tab_btn.active{
    border-bottom:2px solid white;
  }
  .tab_btn{
    background: #577194 !important;
    border: 0px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  .homepage-tool .toolbar__content{
    height:auto !important;
  }
</style>
