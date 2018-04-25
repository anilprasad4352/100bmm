<template>
  <div>
    <v-dialog v-model="openDialog" max-width="1050px" persistent :fullscreen="screenWidth<600" transition="scale-transition" style="height:100%;">
      <v-card style="overflow:hidden;display:block;">
        <v-layout v-if="item">
          <v-flex xs12 md4 :style="{backgroundColor: styles.general.theme_color_light}" class="modal-bg pb-5">
            <v-layout column>
              <v-flex xs12>
                <v-btn dark @click.prevent="cancel()" icon>
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>

              <v-flex xs12 style="text-align:center">
                <v-avatar class="grey lighten-4" size="94px" style="text-align:center;"><img :src="item.agencylogo || '/static/images/business-icon.png'" alt="Agency Logo"></v-avatar>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:center;">
                <p class="mt-2" style="font-size:24px;color:#fff;text-align:center;font-weight:700;">{{ item.vendorname }}</p>
                <p style="margin-top:-10px;padding-top:0px;">{{ item.vendoraddress }}</p>
                <p style="margin-top:-20px;">{{ item.vendorzipcode }}
                  <span v-if="item.vendorcity">,</span> {{ item.vendorcity }}
                  <span v-if="item.vendorcity">,</span> {{ item.vendorstate }} </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3">
                  <b>
                    <span>Point of Contact:</span>
                  </b>
                  <br> {{ item.phonenumber }}

                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3">
                  <b>
                    <span>Primary NAICS:</span>
                  </b>
                  <br> {{ item.naicscode }}
                  <span v-if="item.naicsdescription">-</span> {{ item.naicsdescription }}
                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3">
                  <b>
                    <span>Place of Performance:</span>
                  </b>
                  <br> {{ item.popcitystate }}
                </p>
              </v-flex>
            </v-layout>

            <v-layout class="mt-5">
              <v-card-actions dark style="position: absolute; bottom: 25px;left:-25px;">
                <v-layout class="mt-1 pt-1 ml-5 text-xs-center" justify-space-between align-center>
                  <v-flex xs4 class="text-xs-center" style="float:right;">
                    <v-tooltip top v-if="!favorited">
                      <v-btn small dark flat slot="activator" @click.prevent="favoriteItem" style="margin-left:-9px;height:100%;">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium>favorite</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Add Favorite</span>
                    </v-tooltip>

                    <v-tooltip top v-else>
                      <v-btn small dark flat slot="activator" @click.prevent="unfavoriteItem">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium color="red">favorite</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Remove Favorite</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs4 class="text-xs-center">
                    <share-button :link="shareLink"></share-button>
                  </v-flex>

                  <v-flex xs4 style="font-size:12px;" class="text-xs-center">
                    <v-tooltip top v-if="contractorInfo">
                      <v-btn dark flat slot="activator" style="height:100%;" @click.prevent="viewContractor">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium>account_box</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Contractor Profile</span>
                    </v-tooltip>

                    <v-tooltip top v-if="!contractorInfo">
                      <v-btn dark flat slot="activator" style="height:100%;">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium>account_box</v-icon>

                        </v-layout>
                      </v-btn>
                      <span>Contractor Profile Not Available</span>
                    </v-tooltip>
                  </v-flex>

                  <!--
                  <v-flex xs2 >
                  <v-tooltip top>
                    <v-btn small dark flat slot="activator" @click.native="find" style="margin-left:-9px;height:100%;" >
                      <v-layout column align-center justify-center style="font-size:10px;">
                        <v-icon medium style="height:100%;" >search</v-icon>
                        
                      </v-layout>
                    </v-btn>
                    <span>Find Contractor</span>
                  </v-tooltip>
                  </v-flex>
                  -->
                </v-layout>
              </v-card-actions>
            </v-layout>
          </v-flex>
          <v-flex xs12 md8>
            <v-card class="mx-2 my-2">
              <v-tabs class="pd-0" color="white" slider-color="primary" fixed centered v-model="active" grow>
                <v-tab href="#info-1">
                  <span style="text-transform:capitalize;">General Information</span>
                </v-tab>

                <v-tab href="#info-2" style="text-transform:capitalize;" @click="initialChartLoad">
                  <span style="text-transform:capitalize;">Analytics</span>
                </v-tab>
              </v-tabs>
            </v-card>
            <v-tabs-items v-model="active">
              <v-tab-item id="info-1">
                
                  <v-layout row wrap class="mx-1 px-4 py-3">
                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Signed Date:</b>
                          <br>
                        </span>
                        {{item && item.signeddate ? item.signeddate : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Agency:</b>
                          <br>
                        </span>
                        {{item && item.majagencycat ? item.majagencycat : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Dollars Obligated:</b>
                          <br>
                        </span>
                        {{item && item.dollarsobligated ? item.dollarsobligated : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Contracting Agency:</b>
                          <br>
                        </span>
                        {{item && item.contractingofficeagencyid ? item.contractingofficeagencyid : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Fiscal Year:</b>
                          <br>
                        </span>
                        {{item && item.fiscalyear ? item.fiscalyear : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Solicitation Procedures:</b>
                          <br>
                        </span>
                        {{item && item.solicitationprocedures ? item.solicitationprocedures : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Contract Action:</b>
                          <br>
                        </span>
                        {{item && item.contractactiontype ? item.contractactiontype : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Contract Pricing Type:</b>
                          <br>
                        </span>
                        {{item && item.typeofcontractpricing ? item.typeofcontractpricing : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Set-Aside: </b>
                        </span>
                        <br>{{ item ? item.typeofsetaside : 'N/A' }}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>NAICS:</b>
                          <br>
                        </span>
                        {{ item ? item.naicscode : 'N/A' }} {{ item && item.naicsdescription ? '- ' + item.naicsdescription : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Extent Competed:</b>
                          <br>
                        </span>
                        {{ item ? item.extentcompeted : 'N/A' }}
                      </div>
                    </v-flex>

                    <v-flex md6 xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>PSC:</b>
                          <br>
                        </span>
                        {{ item ? item.psccode : 'N/A' }} {{ item && item.pscdescription ? '- ' + item.pscdescription : 'N/A'}}
                      </div>
                    </v-flex>

                    <v-flex xs12 class="mb-3">
                      <div>
                        <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                          <b>Description:</b>
                          <br>
                        </span>
                        <p>
                          {{ item ? item.descriptionofcontractrequirement : 'N/A' }}
                        </p>
                      </div>
                    </v-flex>
                  </v-layout>
              </v-tab-item>

              <v-tab-item id="info-2">
                  <v-layout justify-center row wrap style="margin-top:20px;">
                    <v-flex md4 class="">
                      <v-select return-object v-model="filter" class="pt-0 mt-0" style="font-size:10px;" :items="[
                          { text: 'Display data by NAICS', value: 'naics' },
                          { text: 'Display data by PSC', value: 'psc' }
                        ]" />
                    </v-flex>
                  </v-layout>

                  <v-layout style="padding:16px;margin-top:-10px;" row wrap>
                    <v-flex md4>
                      <span style="text-align:center;font-size:16px;">
                        <p>
                          <span :style="{color:styles.general.theme_color_dark}">Avg. Award Amount</span><br/>
                          <b>{{ formatMoney(Math.round(averageAwardAmount/totalNumberOfAwards)) }}</b>
                        </p>
                      </span>
                    </v-flex>

                    <v-flex md4>
                      <span style="text-align:center;font-size:16px;" class="text-xs-center">
                        <p>
                          <span :style="{color:styles.general.theme_color_dark}">Number of Awards</span><br/>
                          <b>{{ totalNumberOfAwards }}</b>
                        </p>
                      </span>
                    </v-flex>

                    <v-flex md4>
                      <span style="text-align:center;font-size:16px;" class="text-xs-center">
                        <p>
                          <span :style="{color:styles.general.theme_color_dark}">Avg. No. of Offerers</span><br/>
                          <b>{{ 'N/A' }}</b>
                        </p>
                      </span>
                    </v-flex>
                  </v-layout>

                  <v-layout style="padding:16px;margin-top:-25px;" row wrap class="text-xs-center">
                    <v-flex md6>
                      <p class="secondary--text" style="font-size:16px;">Contract Award Amount by Year</p>
                      <vue-highcharts :options="columnChart1" ref="columnChartRef1" style="margin-top:-15px;" />
                    </v-flex>

                    <v-flex md6>
                      <p class="secondary--text" style="font-size:16px;">Contract Award Volume by Year</p>
                      <vue-highcharts style="float: right;margin-top:-15px;" :options="columnChart2" ref="columnChartRef2" />
                    </v-flex>
                  </v-layout>

                  <v-layout style="margin-top:-50px;" row wrap class="text-xs-center">
                    <v-flex md6>
                      <p class="secondary--text" style="font-size:16px;">Award Amount by Agency</p>
                      <vue-highcharts :options="pieChart1" ref="pieChartRef1" style="margin-top:-15px;" />
                    </v-flex>

                    <v-flex md6>
                      <p class="secondary--text" style="font-size:16px;">Award Volume by Agency</p>
                      <vue-highcharts :options="pieChart2" ref="pieChartRef2" style="margin-top:-15px;float:right;" />
                    </v-flex>
                  </v-layout>
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <div v-if="contractorDialog">
      <contractor-view-modal :dialog="contractorDialog" :item="contractorInfo"></contractor-view-modal>
    </div>
    <find-contractor-modal :item="item" :dialog="findContractorDialog"></find-contractor-modal>
  </div>
</template>

<style scoped>
.group {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
.tabs__wrapper {
  overflow: hidden;
}
.vue-highcharts {
  border: none;
  box-shadow:none;
}
.tabs__content {
  height: 500px;
  overflow-x:hidden;
  overflow-y: scroll;
}
</style>


<script>
import VueHighcharts from 'vue2-highcharts'
import 'mdi/css/materialdesignicons.min.css'
import ShareButton from '../../../components/ShareButton.vue'
import axios from 'axios'
import { formatCurrency, formatSeriesLabel } from './util'
import ContractorViewModal from '../info/contractorViewModal.vue'
import FindContractorModal from '../findContractorModal.vue'
// VueHighcharts.methods.prototype.setTitle = function (val) {
//   console.log(val, 'tried setting title')
// }

export default {
  components: {
    VueHighcharts,
    ShareButton,
    ContractorViewModal,
    FindContractorModal
  },
  props: ['dialog', 'item', 'favorited'],
  data () {
    return {
      openModal: false,
      active: 'info-1',
      totalNumberOfAwards: 0,
      averageAwardAmount: 0,
      contractorInfo: '',
      findContractorDialog: false,
      contractorDialog: false,
      prevUrl: '',
      columnChart1: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'column',
          height: 150
        },
        lang: {
          noData: 'No data to display'
        },
        legend: {
          enabled: false
        },
        xAxis: {
          visible: true,
          lineColor: '#7f7f7f',
          tickWidth: 0,
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },
        yAxis: {
          visible: false
        },
        tooltip: {
          formatter: function () {
            return formatSeriesLabel(this.series.name, this.y)
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
                  return formatCurrency(this.y)
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
      columnChart2: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'column',
          height: 150
        },
        legend: {
          enabled: false
        },
        xAxis: {
          visible: true,
          lineColor: '#7f7f7f',
          tickWidth: 0,
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },
        yAxis: {
          visible: false
        },
        tooltip: {
          formatter: function () {
            return formatSeriesLabel(this.series.name, this.y, false)
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
                  return formatCurrency(this.y, false)
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
      pieChart1: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'pie',
          height: 175
        },
        tooltip: {
          formatter: function () {
            return formatSeriesLabel(this.point.name, this.y)
          }
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            innerSize: 90
          }
        },
        title: {
          text: ''
        },
        series: [
          {
            data: [
              ['Firefox', 44.2],
              ['IE7', 26.6],
              ['IE6', 20],
              ['Chrome', 3.1],
              ['Other', 5.4]
            ]
          }
        ]
      },
      pieChart2: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'pie',
          height: 175
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },

            innerSize: 90
          }
        },
        tooltip: {
          formatter: function () {
            return formatSeriesLabel(this.point.name, this.y, false)
          }
        },
        title: {
          text: ''
        },
        series: [
          {
            data: [
              ['Firefox', 44.2],
              ['IE7', 26.6],
              ['IE6', 20],
              ['Chrome', 3.1],
              ['Other', 5.4]
            ]
          }
        ]
      },
      filter: { text: 'Display data by NAICS', value: 'naics' },
      selectedFilter: {},
      items: [
        {
          id: 1,
          text: 'Basic details'
        },
        {
          id: 2,
          text: 'Analytics'
        }
      ]
    }
  },
  watch: {
    openModal (val) {
      //this.openModal = this.dialog
      this.active = 'info-1'
      var self = this
      if (val) {
        this.prevUrl = window.location.href
        history.replaceState(
          null,
          'Defense Exchange',
          '/contract-history#id=' + this.item.uniquetransactionid
        )
        self.contractorInfo = false
        var url =
          'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?dunsnumber=' +
          this.item.dunsnumber
        return axios.get(url).then(res => {
          self.contractorInfo = res.data.data[0]
        })
      }
    },
    filter (val) {
      const {
        columnChartRef1,
        columnChartRef2,
        pieChartRef1,
        pieChartRef2
      } = this.$refs
      columnChartRef1.delegateMethod('showLoading', 'Loading...')
      columnChartRef2.delegateMethod('showLoading', 'Loading...')
      pieChartRef1.delegateMethod('showLoading', 'Loading...')
      pieChartRef2.delegateMethod('showLoading', 'Loading...')
      console.log(pieChartRef1)
      if (val.value === 'naics') {
        this.selectedFilter = {
          text: 'NAICS',
          value: this.item.naicscode
        }
        this.$store
          .dispatch('getContractHistoryAnalytics', {
            naics: this.item.naicscode
          })
          .then(res => {
            columnChartRef1.hideLoading()
            columnChartRef2.hideLoading()
            pieChartRef1.hideLoading()
            pieChartRef2.hideLoading()
            this.renderCharts()
          })
      }
      if (val.value === 'psc') {
        this.selectedFilter = {
          text: 'PSC',
          value: this.item.psccode
        }
        this.$store
          .dispatch('getContractHistoryAnalytics', { psc: this.item.psccode })
          .then(res => {
            columnChartRef1.hideLoading()
            columnChartRef2.hideLoading()
            pieChartRef1.hideLoading()
            pieChartRef2.hideLoading()
            this.renderCharts()
          })
      }
    }
  },
  mounted () {
    this.active = 'info-1'
    this.$store.dispatch('getContractHistoryAnalytics')
    var self = this
  },
  methods: {
    formatMoney(val) {
      return formatCurrency(val)
    },  
    viewContractor () {
      history.replaceState(null,null, this.prevUrl)
      this.contractorDialog = true
    },
    find () {
      this.dialog = false
      this.findContractorDialog = true
    },
    calculateNumberOfAwards () {
      const fiscalYear = new Date().getFullYear()
      const fiscalYearIndex = this.historyAnalytics.count.month_wise.labels.findIndex(
        val => {
          if (val.indexOf(fiscalYear) === 0) {
            return true
          }
          return false
        }
      )
      const total = this.historyAnalytics.count.month_wise.data
        .splice(fiscalYearIndex)
        .reduce((acc, val) => {
          return Number(acc) + Number(val)
        })
      this.totalNumberOfAwards = total
    },
    calculateAverageAwardAmount () {
      const fiscalYear = new Date().getFullYear()
      const fiscalYearIndex = this.historyAnalytics.amount.month_wise.labels.findIndex(
        val => {
          if (val.indexOf(fiscalYear) === 0) {
            return true
          }
          return false
        }
      )
      const average = this.historyAnalytics.amount.month_wise.data
        .splice(fiscalYearIndex)
        .reduce((acc, val) => {
          return Number(acc) + Number(val)
        })
      this.averageAwardAmount = average
    },
    renderCharts () {
      this.columnCharts()
      this.pieCharts()
      this.calculateNumberOfAwards()
      this.calculateAverageAwardAmount()
    },
    initialChartLoad () {
      const {
        columnChartRef1,
        columnChartRef2,
        pieChartRef1,
        pieChartRef2
      } = this.$refs
      columnChartRef1.delegateMethod('showLoading', 'Loading...')
      columnChartRef2.delegateMethod('showLoading', 'Loading...')
      pieChartRef1.delegateMethod('showLoading', 'Loading...')
      pieChartRef2.delegateMethod('showLoading', 'Loading...')
      this.selectedFilter = {
        text: 'NAICS',
        value: this.item.naicscode
      }
      this.$store
        .dispatch('getContractHistoryAnalytics', { naics: this.item.naicscode })
        .then(res => {
          columnChartRef1.hideLoading()
          columnChartRef2.hideLoading()
          pieChartRef1.hideLoading()
          pieChartRef2.hideLoading()
          this.renderCharts()
        })
    },
    columnCharts () {
      const { columnChartRef1, columnChartRef2 } = this.$refs
      // columnChartRef1.delegateMethod('setTitle', { text: `${this.selectedFilter.text} ${this.selectedFilter.value}: Award Amount History` })
      // columnChartRef2.delegateMethod('setTitle', { text: `${this.selectedFilter.text} ${this.selectedFilter.value}: Number of Awards` })
      columnChartRef1.removeSeries()
      columnChartRef2.removeSeries()
      var labels = this.historyAnalytics.amount.month_wise.labels

      var amountApiData = this.historyAnalytics.amount.month_wise.data
      var volumeApiData = this.historyAnalytics.count.month_wise.data

      var startYear = labels[0].split('-')[0]
      var endYear = labels[labels.length - 1].split('-')[0]

      var amountData = { labels: [], data: [] }
      var volumeData = { labels: [], data: [] }
      for (var i = startYear; i <= endYear; i++) {
        amountData.labels.push(i)
        volumeData.labels.push(i)
      }
      var amountSum = {}
      var amountCount = {}
      var volumeSum = {}
      var volumeCount = {}

      for (var j in amountApiData) {
        var year = labels[j].split('-')[0]
        amountSum[year] = amountSum[year]
          ? amountSum[year] + (amountApiData[j] !== '' ? amountApiData[j] : 0)
          : amountApiData[j]
        amountCount[year] = amountCount[year] ? amountCount[year] + 1 : 1

        volumeSum[year] = volumeSum[year]
          ? volumeSum[year] + volumeApiData[j]
          : volumeApiData[j]
        volumeCount[year] = volumeCount[year] ? volumeCount[year] + 1 : 1
      }
      for (var k in amountData.labels) {
        amountData.data[k] = Math.round(amountSum[amountData.labels[k]])
        volumeData.data[k] = Math.round(volumeSum[volumeData.labels[k]])
      }

      columnChartRef1.getChart().xAxis[0].setCategories(amountData.labels)
      columnChartRef2.getChart().xAxis[0].setCategories(volumeData.labels)
      columnChartRef1.addSeries({
        name: 'Award Amount',
        data: amountData.data
      })
      columnChartRef2.addSeries({
        name: 'Award Volume',
        data: volumeData.data
      })
    },
    pieCharts () {
      const { pieChartRef1, pieChartRef2 } = this.$refs
      // pieChartRef1.delegateMethod('setTitle', { text: `${this.selectedFilter.text} ${this.selectedFilter.value}: Award Amount History by Agency` })
      // pieChartRef2.delegateMethod('setTitle', { text: `${this.selectedFilter.text} ${this.selectedFilter.value}: Number of Awards by Agency` })
      pieChartRef1.removeSeries()
      pieChartRef2.removeSeries()
      pieChartRef1.addSeries({
        name: 'Award Amount',
        data: this.historyAnalytics.amount.agency_dsitribution
      })
      pieChartRef2.addSeries({
        name: 'Award Volume',
        data: this.historyAnalytics.count.agency_dsitribution
      })
    },
    cancel () {
      history.replaceState(
        null,
        'Defense Exchange',
        this.prevUrl
      )
      this.$emit('cancel')
    },
    favoriteItem () {
      let favoritePayload = {
        [this.item.uniquetransactionid]: this.item.uniquetransactionid
      }
      this.$firebase
        .database()
        .ref(
          `favorites/history/${this.userDetails.uid}/${
            this.item.uniquetransactionid
          }`
        )
        .set(favoritePayload)
    },
    unfavoriteItem () {
      this.$firebase
        .database()
        .ref(
          `favorites/history/${this.userDetails.uid}/${
            this.item.uniquetransactionid
          }`
        )
        .set(null)
    },
    shareItem () {}
  },
  computed: {
    openDialog () {
      this.openModal = this.dialog
      return this.dialog
    },
    screenWidth () {
      return Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      )
    },
    styles () {
      return this.$store.getters.getStyles
    },
    historyAnalytics () {
      return this.$store.getters.tableAnalytics.history
    },
    userDetails () {
      return this.$store.getters.getUserDetails
    },
    shareLink () {
      return window.location
    }
  }
}
</script>
