<template>
  <v-container fluid class="" style="margin-top:-15px;">
    <v-card>
      <v-layout class="info-bg darken-2" justify-center></v-layout>
      <v-layout class="info-profile-img" justify-center>
        <img :alt="company && company.companylogo ? company.companylogo : 'default-avatar.gif'" :src="company && company.companylogo ? company.companylogo : '../static/images/yourlogo.png'" style="max-width:100%;max-height:150px;">
      </v-layout>
      <v-layout class="mt-5" justify-center :style="{color: styles.general.theme_color_dark}" style="font-weight:900;font-size:18px;">
        {{ user.firstname }} {{ user.lastname }}
      </v-layout>
      <v-layout justify-center style="font-weight:900;font-size:14px;text-transform:capitalize;color:#666666">
        {{ user.jobtitle }} | {{ company.companylegalname }}
      </v-layout>
      <br>
      <v-layout class="px-3">
        <v-divider></v-divider>
      </v-layout>
      <v-layout style="font-size:20px;font-weight:900;" class="mt-2" justify-center :style="{color: styles.general.theme_color_dark}">
        Contract Award History
      </v-layout>
      <v-card-text>
        <v-layout class="px-3 mt-1" style="padding-top:0px;margin-top:-20px;">
          <p class="subheading secondary--text">Contract Award Amount by Year</p>
        </v-layout>

        <v-layout class="px-3">
          <vue-highcharts :options="chartOptions1" ref="chart1ref" style="margin-top:-15px" />
        </v-layout>

        <v-layout class="px-3">
          <p class="subheading secondary--text">Contract Award Volume by Year</p>
        </v-layout>

        <v-layout class="px-3">
          <vue-highcharts :options="chartOptions2" ref="chart2ref" style="margin-top:-15px" />
        </v-layout>
        <v-layout row wrap>
         <!-- <v-flex xs12>
            <v-btn flat :style="{color: styles.general.theme_color_dark}" class="userinfo-menu" @click.prevent="goTo('/groups')">
              <v-icon medium>fa-users</v-icon>
              <header class="mx-1">Groups</header>
            </v-btn>
          </v-flex>-->

        <v-flex xs12>
          <v-btn flat :style="{color: styles.general.theme_color_dark}" class="userinfo-menu" @click.prevent="goTo('/events')">
            <v-icon medium>date_range</v-icon>
            <header class="mx-1">Events</header>
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-btn flat :style="{color: styles.general.theme_color_dark}" class="userinfo-menu" @click.prevent="goTo('/tracking')">
            <v-icon medium>add_alarm</v-icon>
            <header class="mx-1">Tracked Opportunities</header>
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-btn flat :style="{color: styles.general.theme_color_dark}" class="userinfo-menu" @click.prevent="goTo('/favorites')">
            <v-icon medium>favorite</v-icon>
            <header class="mx-1">Favorites</header>
          </v-btn>
        </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>




<script>
import VueHighcharts from 'vue2-highcharts'

export default {
  components: {
    VueHighcharts
  },
  data () {
    return {
      width: 360,
      usercompanyLogo: this.$store.getters.getCompanyDetails.companylogo,
      amountAward: [],
      volumeAward: [],
      awardAmountChart: null,
      companyv: '',
      naics: this.$store.getters.getCompanyDetails.dunsnumber,
      chartdata: [],
      chartdata1: [],
      chartOptions1: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'column',
          height: 100
        },
        lang: {
          noData: 'No data to display'
        },
        legend: {
          enabled: false
        },
        xAxis: {
          lineColor: '#7f7f7f',
          tickWidth: 0,
          categories: ['2014', '2015', '2016', '2017', '2018']
        },
        yAxis: {
          visible: false
        },
        tooltip: {
          formatter: function () {
            return `<b>${this.series.name}: </b>$${parseInt(this.y.toString())
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              .replace('.00', '')}`
          }
        },
        plotOptions: {
          column: {
            className: 'highcharts-fill-color',
            dataLabels: {
              enabled: true,
              crop: false,
              overflow: 'none',
              color: '#7f7f7f',

              formatter: function () {
                if (this.y !== 0) {
                  return `$${parseInt(this.y.toString())
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                    .replace('.00', '')}`
                }
              }
            }
          }
        },
        title: {
          text: ''
        },
        series: []
      },
      chartOptions2: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'column',
          height: 100          
        },
        lang: {
          noData: 'No data to display'
        },
        legend: {
          enabled: false
        },
        xAxis: {
          lineColor: '#7f7f7f',
          tickWidth: 0,
          categories: ['2014', '2015', '2016', '2017', '2018']
        },
        yAxis: {
          visible: false
        },
        tooltip: {
          formatter: function () {
            return `<b>${this.series.name}: </b>${parseInt(this.y.toString())
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              .replace('.00', '')}`
          }
        },
        plotOptions: {
          column: {
            className: 'highcharts-fill-color',
            dataLabels: {
              enabled: true,
              crop: false,
              overflow: 'none',
              color: '#7f7f7f',
              formatter: function () {
                if (this.y !== 0) {
                  return this.y
                }
              }
            }
          }
        },
        title: {
          text: ''
        },
        series: []
      }
    }
  },
  created () {},
  mounted () {
    this.loadData()
  },
  methods: {
    goTo (link) {
      this.menu = false
      this.$router.push(link)
    },
    loadData () {
      const chart1ref = this.$refs.chart1ref
      const chart2ref = this.$refs.chart2ref
      let self = this

      this.$store
        .dispatch('getContractHistoryAnalyticsData', {
          dunsnumber: self.naics,
          type: 'award_amount_history'
        })
        .then(res => {
          chart1ref.hideLoading()
          chart1ref.removeSeries()
          chart1ref
            .getChart()
            .xAxis[0].setCategories(Object.keys(res.data.amount_history))
          chart1ref.addSeries({
            name: 'Award Amount',
            data: Object.values(res.data.amount_history)
          })
        })
      this.$store
        .dispatch('getContractHistoryAnalyticsData', {
          dunsnumber: self.naics,
          type: 'contract_volume_history'
        })
        .then(res => {
          chart2ref.hideLoading()
          chart2ref.removeSeries()
          chart2ref
            .getChart()
            .xAxis[0].setCategories(
              Object.keys(res.data.contract_volume_history)
            )
          chart2ref.addSeries({
            name: 'Award Volume',
            data: Object.values(res.data.contract_volume_history)
          })
        })
    },
    onResize () {
      if (window.innerWidth > 1300) {
        this.width = 350
      }
      if (window.innerWidth > 1900) {
        this.width = 420
      }
    }
  },
  computed: {
    historyAnalytics () {
      return this.$store.getters.tableAnalytics.opportunities
    },
    company () {
      return this.$store.getters.getCompanyDetails
    },
    styles () {
      return this.$store.getters.getStyles
    },
    user () {
      return this.$store.getters.getUserDetails
    },
    items () {
      return [
        {
          title: this.user.companylegalname,
          icon: 'store'
        },
        {
          title: this.user.jobtitle,
          icon: 'assignment_ind'
        },
        {
          title: this.user.department,
          icon: 'work'
        }
      ]
    }
  },
  watch: {
    company (val) {
      if (val.dunsnumber && val.dunsnumber !== this.naics) {
        this.naics = val.dunsnumber
        this.loadData()
      }
    }
  }
}
</script>

<style>
.info-bg {
  background-image: url("/static/images/hangar-jet-aircraft-fighter.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 80px;
}
.highcharts-point .highcharts-color-0 {
  background: #000;
}
.info-profile-img img {
  width: 100px;
  height: 100px;
  top: 20px;
  border-radius: 100%;
  border: 2px solid #31572c;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
}
.userinfo-menu {
  font-weight: 900;
  text-transform: capitalize;
  font-size: 18px;
}
.info-list {
  list-style: none;
}
.info-list li {
  margin-bottom: 10px;
  display: flex;
}
.info-list li div {
  color: #929292;
  font-size: 13px;
}
.vue-highcharts {
  border: none;
  box-shadow:none;
}
</style>

