<template>
    <v-container fluid style="padding:0px;">
        <v-layout row wrap>
          <v-flex xs6 sm6 mt-2  style="padding-right:5px;">
                <p class="page_head center" :style="{color: styles.general.theme_color_light}"><b>Page Views by Location</b></p>
				<div id="map" style="height:350px; border:0; width: 100%"></div>
          </v-flex>
          <v-flex xs6 sm6 mt-2 style="padding-left:5px;" >
                <p class="page_head center" :style="{color: styles.general.theme_color_light}"><b>Page Views by Page</b></p>
				<table class="table">
						<tr v-for="item in toppages">
						<td class="tab1">{{ item[0] }}</td>
						<td>
						<Progressd :value="item[2]" class="mb-2"></Progressd>
						<span> &nbsp;&nbsp;{{ item[1] }}</span></td>
											
						</tr>
						</table>
				
          </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Progressd from './progress' 
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBCkHJdW4ChFLJ8cqJghc-LlhVU_FAl5G0'
  })
  export default {
     components:{
	 Progressd
	 },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      }
	  },
    data () {
      return {
	  max: 50,
      value: 10,
       toppages: [],
	   map:{},
	   markers: [],
	   infoWindow: {}
      }
    },
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
      }
    },
	mounted () {
	  var self = this
	  self.toppages = []
	  let tp = []
	  let count =0 
	 //const yesterday = moment(new Date()).add(-1, 'days')
        let startDate = moment(new Date('2017-08-01')).add(-1, 'days').format('YYYY-MM-DD')
        let endDate = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
		let metrics1 = 'ga:pageviews'
        let dimensions1 = 'ga:pagePath'
		var u='?metrics=ga:pageviews&dimensions=ga:pagePath&sort=-ga:pageviews&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
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
		      ctn++
			  if(ctn<=10){
			  tpd = []
              tpd.push(dateValue[0])			  
              tpd.push(dateValue[1])			  
              tpd.push(parseInt(100*parseInt(dateValue[1])/count))
			 // console.log()
              self.toppages.push(tpd)	
				}			  
            })
		  
            })
			var u='?metrics=ga:users&dimensions=ga:city&sort=-ga:users&maxResults=9999999&startDate=' + startDate + '&endDate=' + endDate
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
          zoom: 1,
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
          this.geocode(val[i].streetaddress,
            (err, res) => {
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
  .page_list_li{
  
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
</style>
