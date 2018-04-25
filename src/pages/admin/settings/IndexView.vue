<template >
  <v-container fluid style="height: 100%; padding: 0;"  >
    <v-layout row style="height: 100%">
      <v-flex xs2 :style="{backgroundColor: styles.general.theme_color_light}">
        <AdminSideBarMenu />
      </v-flex>
      <v-flex xs10 class="dashboard-view">
        <v-layout row wrap class="number-metrics">
          <v-flex md3 sm6 xs12>
            <v-card light class="white">
              <v-card-title class="white--text btn_head_title" :style="{backgroundColor: styles.general.theme_color_light}">
                <div class="stat_title ">
                  <h4 class="headline ">Website Traffic</h4>                     
                </div>
              </v-card-title>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Month-to-Date</span></b>
                    <h5> {{wt1 | formatNumber}} </h5>
                    <p id="traffic_percent" :class="p1c">
                      {{p1}}%
                    </p>
                  </v-card>
                </v-flex>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Year-to-Date</span></b>
                    <h5> {{wt2 | formatNumber}} </h5>
                    <p :class="p2c">
                      {{p2}}%
                    </p>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex md3 sm6 xs12>
            <v-card light class="white">
              <v-card-title class="white--text btn_head_title" :style="{backgroundColor: styles.general.theme_color_light}">
                <div class="stat_title">
                  <h4 class="headline">NEW USERS</h4>
                  
                </div>
              </v-card-title>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Month-to-Date</span></b>
                    <h5> {{nt1 | formatNumber}} </h5>
                    <p id="traffic_percent" :class="np1c">
                      {{np1}}%
                    </p>
                  </v-card>
                </v-flex>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Year-to-Date</span></b>
                    <h5> {{nt2 | formatNumber }} </h5>
                    <p :class="np2c">
                      {{np2}}%
                    </p>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex md3 sm6 xs12>
            <v-card light class="white">
              <v-card-title class="white--text btn_head_title" :style="{backgroundColor: styles.general.theme_color_light}">
                <div class="stat_title">
                  <h4 class="headline">AVG TIME-ON-SITE</h4>
                </div>
              </v-card-title>
              
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Month-to-Date</span></b>
                    <h5> {{tt1 | formatNumber}} </h5>
                    <p id="traffic_percent" :class="tp1c">
                      {{tp1}}%
                    </p>
                  </v-card>
                </v-flex>
                
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Year-to-Date</span></b>
                    <h5> {{tt2 | formatNumber}} </h5>
                    <p :class="tp2c">
                      {{tp2}}%
                    </p>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex md3 sm6 xs12>
            <v-card light class="white">
              <v-card-title class="white--text btn_head_title" :style="{backgroundColor: styles.general.theme_color_light}">
                <div class="stat_title">
                  <h4 class="headline">Engagement (MDT)</h4>
                  
                </div>
              </v-card-title>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Post</span></b>
                    <h5> {{pt1 | formatNumber}} </h5>
                    <p id="traffic_percent" :class="pp1c">
                      {{pp1}}%
                    </p>
                  </v-card>
                </v-flex>
                <v-flex xs6>
                  <v-card class="pl-1" light flat>
                    <b><span>Likes</span></b>
                    <h5> {{pt2 | formatNumber}} </h5>
                    <p :class="pp2c">
                      {{pp2}}%
                    </p>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <chart-view></chart-view>
        <v-flex xs12 mt-5>
          <block1 />
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import VueHighcharts from 'vue2-highcharts'
  import MainMenu from '../../../components/main-menu/MainMenuComponent.vue'
  import Block from './Index/block.vue'
  import Block1 from './Index/block.1.vue'
  import UserToolbar from '../../../components/Toolbar.vue'
  import AdminSideBarMenu from './Components/AdminSideBar.vue'
  import ChartView from './chart'
  import 'font-awesome/css/font-awesome.min.css'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    components: {
      MainMenu,
      Block,
      Block1,
      AdminSideBarMenu,
      UserToolbar,
      VueHighcharts,
      ChartView
    },
    filters: {
      formatNumber: function (value) {
        var str = value + ''
        var x = str.split('.')
        var x1 = x[0]
        var x2 = x.length > 1 ? '.' + x[1] : ''
        var rgx = /(\d+)(\d{3})/
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2')
        }
        return x1 + x2
      }
    },
    data: () => ({
      drawer: true,
      loading: false,
      h1: window.title,
      wt1: 0,
      wt2: 0,
      wt3: 0,
      wt4: 0,
      p1: 0,
      p2: 0,
      p1c: 'red--text',
      p2c: 'red--text',
      nt1: 0,
      nt2: 0,
      nt3: 0,
      nt4: 0,
      np1: 0,
      np2: 0,
      np1c: 'red--text',
      np2c: 'red--text',
      tt1: 0,
      tt2: 0,
      tt3: 0,
      tt4: 0,
      tp1: 0,
      tp2: 0,
      tp1c: 'red--text',
      tp2c: 'red--text',
      pt1: 0,
      pt2: 0,
      pt3: 0,
      pt4: 0,
      pp1: 0,
      pp2: 0,
      pp1c: 'red--text',
      pp2c: 'red--text'
    }),

    methods: {
      onDismiss () {
        this.$store.dispatch('setError', null)
        this.$store.dispatch('setProcess', 'null')
      },
      triggerDrawer () {
        this.drawer = !this.drawer
      },
      loadData () {
        let self = this
        var startDate = moment(new Date()).add(-1, 'days').subtract(30, 'days').format('YYYY-MM-DD')
        var endDate = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
        var u = '?metrics=ga:pageviews&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate + '&endDate=' + endDate
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u)
          .then((response) => {
            if (response.data.rows.length !== 0) {
              var count = 0
              response.data.rows.forEach((dateValue) => {
                count = count + parseInt(dateValue[1], 0)
              })
              console.log(count)
              self.wt1 = count
            }
          })
        var startDate1 = moment(new Date()).startOf('year').format('YYYY-MM-DD')
        var u1 = '?metrics=ga:pageviews&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate1 + '&endDate=' + endDate
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u1)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })
            self.wt2 = count
          }
        })
        var startDate2 = moment(new Date()).add(-1, 'months').startOf('month').format('YYYY-MM-DD')
        var endDate2 = moment(new Date()).add(-30, 'days').format('YYYY-MM-DD')
        var u2 = '?metrics=ga:pageviews&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate2 + '&endDate=' + endDate2
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u2)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })
            self.wt3 = count
          }
        })
        var endDate3 = moment(new Date()).add(-1, 'years').format('YYYY-MM-DD')
        var startDate3 = moment(new Date()).add(-1, 'years').startOf('year').format('YYYY-MM-DD')
        var u3 = '?metrics=ga:pageviews&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate3 + '&endDate=' + endDate3
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u3)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })
            self.wt4 = count

            if (self.wt3 === 0) {
              self.p1 = 100
              if (self.p1 >= 0) {
                self.p1c = 'green--text'
              }
            } else {
              self.p1 = ((self.wt1 - self.wt3) / self.wt3)
              self.p1 = parseFloat(parseFloat(self.p1) * 100).toFixed(2)
              if (self.p1 >= 0) {
                self.p1c = 'green--text'
              }
            }
            if (self.wt4 === 0) {
              self.p2 = 100
              if (self.wt2 >= 0) {
                self.p2c = 'green--text'
              }
            } else {
              self.p2 = ((self.wt2 - self.wt4) / self.wt4)
              self.p2 = parseFloat(parseFloat(self.p2) * 100).toFixed(2)
              if (self.p2 >= 0) {
                self.p2c = 'green--text'
              }
            }
          }
        })

        var startDate41 = moment(new Date()).add(-1, 'days').subtract(30, 'days').format('YYYY-MM-DD')
        var endDate41 = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('posts').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') <= endDate41 && moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') >= startDate41) {
              c = c + 1
            }
          })
          self.pt1 = c
        })

        var startDate51 = moment(new Date()).startOf('year').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('posts').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') >= startDate51) {
              c = c + 1
            }
          })
          self.pt2 = c
        })

        var startDate61 = moment(new Date()).add(-1, 'months').startOf('month').format('YYYY-MM-DD')
        var endDate61 = moment(new Date()).add(-30, 'days').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('posts').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') <= endDate61 && moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') >= startDate61) {
              c = c + 1
            }
          })
          self.pt3 = c
        })

        var endDate71 = moment(new Date()).add(-1, 'years').format('YYYY-MM-DD')
        var startDate71 = moment(new Date()).add(-1, 'years').startOf('year').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('posts').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') <= endDate71 && moment.unix(childData.posteddate / 1000).format('YYYY-MM-DD') >= startDate71) {
              c = c + 1
            }
          })
          self.pt4 = c

          if (self.pt3 === 0) {
            self.pp1 = 100
            if (self.pp1 >= 0) {
              self.pp1c = 'green--text'
            }
          } else {
            self.pp1 = ((self.pt1 - self.pt3) / self.pt3)
            self.pp1 = parseFloat(parseFloat(self.pp1) * 100).toFixed(2)
            if (self.pp1 >= 0) {
              self.pp1c = 'green--text'
            }
          }
          if (self.pt4 === 0) {
            self.pp2 = 100
            if (self.pp2 >= 0) {
              self.pp2c = 'green--text'
            }
          } else {
            self.pp2 = ((self.pt2 - self.pt4) / self.pt4)
            self.pp2 = parseFloat(parseFloat(self.pp2) * 100).toFixed(2)
            if (self.pp2 >= 0) {
              self.pp2c = 'green--text'
            }
          }
        })

        var startDate4 = moment(new Date()).add(-1, 'days').subtract(30, 'days').format('YYYY-MM-DD')
        var endDate4 = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('users').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (childData.createdAt <= endDate4 && childData.createdAt >= startDate4) {
              c = c + 1
            }
          })
          self.nt1 = c
        })

        var startDate5 = moment(new Date()).startOf('year').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('users').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (childData.createdAt >= startDate5) {
              c = c + 1
            }
          })
          self.nt2 = c
        })

        var startDate6 = moment(new Date()).add(-1, 'months').startOf('month').format('YYYY-MM-DD')
        var endDate6 = moment(new Date()).add(-30, 'days').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('users').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (childData.createdAt <= endDate6 && childData.createdAt >= startDate6) {
              c = c + 1
            }
          })
          self.nt3 = c
        })

        var endDate7 = moment(new Date()).add(-1, 'years').format('YYYY-MM-DD')
        var startDate7 = moment(new Date()).add(-1, 'years').startOf('year').format('YYYY-MM-DD')
        this.$firebase.database().ref().child('users').once('value', function (snapshot) {
          let c = 0
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()

            if (childData.createdAt <= endDate7 && childData.createdAt >= startDate7) {
              c = c + 1
            }
          })
          self.nt4 = c
          if (self.nt3 === 0) {
            self.np1 = 100
            if (self.np1 >= 0) {
              self.np1c = 'green--text'
            }
          } else {
            self.np1 = ((self.nt1 - self.nt3) / self.nt3)
            self.np1 = parseFloat(parseFloat(self.np1) * 100).toFixed(2)
            if (self.np1 >= 0) {
              self.np1c = 'green--text'
            }
          }
          if (self.nt4 === 0) {
            self.np2 = 100
            if (self.np2 >= 0) {
              self.np2c = 'green--text'
            }
          } else {
            self.np2 = ((self.nt2 - self.nt4) / self.nt4)
            self.np2 = parseFloat(parseFloat(self.np2) * 100).toFixed(2)
            if (self.np2 >= 0) {
              self.np2c = 'green--text'
            }
          }
        })

        var startDate8 = moment(new Date()).add(-1, 'days').subtract(30, 'days').format('YYYY-MM-DD')
        var endDate8 = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
        var u8 = '?metrics=ga:avgTimeOnPage&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate8 + '&endDate=' + endDate8
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u8)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })
            if (count === 0) {
              self.tt1 = 0
            } else {
              self.tt1 = (count / response.data.totalResults).toFixed(2)
            }
          }
        })
        var startDate9 = moment(new Date()).startOf('year').format('YYYY-MM-DD')
        var u9 = '?metrics=ga:avgTimeOnPage&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate9 + '&endDate=' + endDate8
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u9)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })
            if (count === 0) {
              self.tt2 = 0
            } else {
              self.tt2 = (count / response.data.totalResults).toFixed(2)
            }
          }
        })
        var startDate10 = moment(new Date()).add(-1, 'months').startOf('month').format('YYYY-MM-DD')
        var endDate10 = moment(new Date()).add(-30, 'days').format('YYYY-MM-DD')
        var u10 = '?metrics=ga:avgTimeOnPage&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate10 + '&endDate=' + endDate10
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u10)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })
            if (count === 0) {
              self.tt3 = 0
            } else {
              self.tt3 = (count / response.data.totalResults).toFixed(2)
            }
          }
        })
        var endDate11 = moment(new Date()).add(-1, 'years').format('YYYY-MM-DD')
        var startDate11 = moment(new Date()).add(-1, 'years').startOf('year').format('YYYY-MM-DD')
        var u11 = '?metrics=ga:avgTimeOnPage&dimensions=ga:date&sort=ga:date&maxResults=99999999&startDate=' + startDate11 + '&endDate=' + endDate11
        axios.get('https://us-central1-defense-exchange.cloudfunctions.net/getReports' + u11)
        .then((response) => {
          if (response.data.rows.length !== 0) {
            var count = 0
            response.data.rows.forEach((dateValue) => {
              count = count + parseInt(dateValue[1], 0)
            })

            if (count === 0) {
              self.tt4 = 0
            } else {
              self.tt4 = (count / response.data.totalResults).toFixed(2)
            }
          }

          if (self.tt3 === 0) {
            self.tp1 = 100
            if (self.tp1 >= 0) {
              self.tp1c = 'green--text'
            }
          } else {
            self.tp1 = ((self.tt1 - self.tt3) / self.tt3)
            self.tp1 = parseFloat(parseFloat(self.tp1) * 100).toFixed(2)
            if (self.tp1 >= 0) {
              self.np1c = 'green--text'
            }
          }
          if (self.tt4 === 0) {
            self.tp2 = 100
            if (self.tp2 >= 0) {
              self.tp2c = 'green--text'
            }
          } else {
            self.tp2 = ((self.tt2 - self.tt4) / self.tt4)
            self.tp2 = parseFloat(parseFloat(self.tp2) * 100).toFixed(2)
            if (self.tp2 >= 0) {
              self.tp2c = 'green--text'
            }
          }
        })
      }
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      }
    },
    mounted () {
      this.loadData()
      const payload = {
        meta: {
          'h1': 'Admin Settings - Home',
          'title': 'Admin Settings - Home',
          'description': 'Admin Settings',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
    }
  }
</script>
<style lang="scss" scoped>
  .navigation-drawer {
    position: fixed;
  }
  .number-metrics {
    margin-bottom: 20px;
  }
  img.avatar.img-avatar {
    height: 40px;
  }
  td.listx{
    padding: 5px;
    font-size: 12px;
    font-family: sans-serif;
    width:auto;
  }
  .center{
    text-align:center;
  }
  td.listx img.avatar.img-avatar {
    height: 40px;
    width: 40px;
    border-radius: 5px;
    background: #577194;
  }
  td.listx a{
    text-decoration:none;
    color:#2196F3;
  }
  .btn_head_title .headline{
    font-size:1rem !important;
  }
  .toolbar__content h5{
    font-size:18px !important;
  }

  .btn_head_title{
    padding-bottom:5px;
  }
  .stat_title {
    width: 100%;
    text-align: left;
    text-transform:uppercase;
  }
  .card__title.primary{
    padding-bottom:5px;
  }
  .stat_title > h4 {
    line-height: 15px !important;
  }
  .dashboard-view {
    padding: 0 20px;
    margin-top: 80px;
  }
</style>
