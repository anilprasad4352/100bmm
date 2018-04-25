<template>
  <div>
    <v-dialog v-model="toggleDialog" max-width="1050px" persistent :fullscreen="screenWidth<600" transition="scale-transition">
      <v-card>
        <v-layout v-if="item">
          <v-flex xs12 md4 :style="{backgroundColor: styles.general.theme_color_light}" class="modal-bg pb-5">
            <v-layout column>
              <v-flex xs12>
                <v-btn dark @click.prevent="cancel()" icon>
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>

              <v-flex xs12 style="text-align:center">
                <v-avatar class="grey lighten-4" size="94px" style="text-align:center;"><img :src="item.agencylogo || '/static/images/gov-logo.png'" alt="logo"></v-avatar>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:center;" class="mx-2">
                <p class="mt-2" style="font-size:24px;color:#fff;text-align:center;font-weight:700;">{{ item.office || 'N/A'}}</p>
                <p style="margin-top:-10px;padding-top:0px;">{{ item.location }}</p>
                <p>{{ item.officeaddresscity }}
                  <span v-if="item.officeaddressstate">,</span> {{ item.officeaddressstate }}</p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3">
                  <span>
                    <b>Point of Contact:</b>
                  </span>
                  <br>
                  <span>{{ item.primarypointofcontact ||'N/A'}}</span>
                  <a class="email-link" :title="`Send am email to ${item.primarypointofcontactemail}`" v-if="item.primarypointofcontactemail" :href="`mailto:${item.primarypointofcontactemail}`">{{ item.primarypointofcontactemail }}</a>
                  <br>
                  <span>{{ item.primarypointofcontactphonenum }}</span>
                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3">
                  <b>
                    <span>Primary NAICS:</span>
                  </b>
                  <br> {{ item.naicscode || 'N/A' }}
                  <span v-if="item.naicscodedescription">-</span> {{ item.naicscodedescription }}
                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3">
                  <b>
                    <span>Place of Performance:</span>
                  </b>
                  <br> {{ item.placeofperformance || 'N/A'}}
                </p>
              </v-flex>
            </v-layout>

            <v-layout class="mt-5">
              <v-card-actions dark style="position: absolute; bottom: 25px;">
                <v-layout class="mt-1 pt-1">
                  <!-- <v-btn flat><v-icon medium>mdi-heart</v-icon></v-btn> -->
                  <v-flex xs3 class="mx-0 px-0" style="margin-left:-18px;">
                    <v-tooltip top>
                      <v-btn small dark slot="activator" target="_blank" :href="item.solicitationlink" flat style="font-size:10px;height:100%;margin-left:-10px;">
                        <v-layout column align-center justify-center>
                          <v-icon medium style="height:100%;">fa-link </v-icon>
                        </v-layout>
                      </v-btn>
                      <span v-if="item && item.solicitationlink">Link to Solicitation</span>
                      <span v-else>No link</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs3 style="margin-left:-18px;">
                    <v-tooltip top>
                      <v-btn small dark flat slot="activator" @click.native="find" style="margin-left:-9px;height:100%;">
                        <v-layout column align-center justify-center style="font-size:10px;">
                          <v-icon medium style="height:100%;">search</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Find Contractor</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs3 style="margin-left:-15px;">
                    <share-button style="margin-left:-9px;" :link="shareLink"></share-button>
                  </v-flex>

                  <v-flex xs3 style="margin-left:-18px;">
                    <v-tooltip top v-if="!tracked">
                      <v-btn small dark flat slot="activator" @click.prevent="trackItem" style="margin-left:-9px;height:100%;">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium>add_alarm</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Track</span>
                    </v-tooltip>

                    <v-tooltip top v-else>
                      <v-btn small dark flat slot="activator" @click.prevent="untrackItem">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon nedium color="red" medium>add_alarm</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Undo Track</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs2 style="font-size:12px;margin-left:-18px;">
                    <v-tooltip top v-if="item && item.primarypointofcontactemail && item.primarypointofcontactemail.length > 6">
                      <v-btn dark :href="'mailto:' + item.primarypointofcontactemail" flat slot="activator" style="margin-left:-15px;height:100%;">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium>contact_mail</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Contact Contract Officer</span>
                    </v-tooltip>
                    <v-tooltip top v-else>
                      <v-btn dark flat slot="activator" style="margin-left:-15px;height:100%;">
                        <v-layout column align-center style="font-size:10px;">
                          <v-icon medium>contact_mail</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Contract Officer email not available</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-layout>
          </v-flex>
          <v-flex xs12 md8>
            <v-card class="mx-2 my-2">
              <v-tabs class="pd-0" fixed centered v-model="active" color="white" slider-color="primary">
                <v-tab href="#info-1">
                  <span style="text-transform:capitalize;">General Information</span>
                </v-tab>

                <v-tab href="#info-2" style="text-transform:capitalize;">
                  <span style="text-transform:capitalize;">Attachments</span>
                </v-tab>

                <v-tab href="#info-3" style="text-transform:capitalize;" @click="initialChartLoad">
                  <span style="text-transform:capitalize;">Analytics</span>
                </v-tab>
              </v-tabs>
            </v-card>
             <v-tabs-items v-model="active">
              <v-tab-item id="info-1">
                <v-layout row wrap class="px-4">
                  <v-flex xs12 class="text-xs-center secondary--text bold my-4 title">
                    {{item.solicitationname}}
                  </v-flex>                    
                  <v-flex md6 xs12 class="mb-3">
                    <div>
                      <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                        <b>Notice Type:</b>
                        <br>
                      </span>
                      {{item && item.noticetype ? item.noticetype : 'N/A'}}
                    </div>
                  </v-flex>
                  <v-flex md6 xs12 class="mb-3">
                    <div>
                      <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                        <b>NAICS:</b>
                        <br>
                      </span>
                      {{item && item.naicscode ? item.naicscode : 'N/A'}}
                      <span v-if="item.naicscodedescription">-</span> {{ item.naicscodedescription }}
                    </div>
                  </v-flex>

                  <v-flex md6 xs12 class="mb-3">
                    <div>
                      <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                        <b>Set-Aside: </b>
                      </span>
                      <br>{{ item ? item.setaside : 'N/A' }}
                    </div>
                  </v-flex>

                  <v-flex md6 xs12 class="mb-3">
                    <div>
                      <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                        <b>PSC:</b>
                        <br>
                      </span>
                      {{ item && item.psccode && item.psccode.trim(' ')!='' ? item.psccode : 'N/A' }}
                    </div>
                  </v-flex>

                  <v-flex xs12 class="mb-3">
                    <div>
                      <span class="subheading theme" :style="{color: styles.general.theme_color_dark}">
                        <b>Description:</b>
                        <br>
                      </span>
                      <p>
                        {{ item ? item.synopsis : 'N/A' }}
                      </p>
                    </div>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item id="info-2">
                <v-layout row wrap class="px-4">
                  <v-flex xs12 class="text-xs-center secondary--text bold my-4 title">
                    {{item.solicitationname}}
                  </v-flex>   
                  <v-flex md12 xs12>
                    <span :style="{color: styles.general.theme_color_dark}" style="font-size:16px;">
                      <b>Attachments</b>
                    </span>
                    <p v-if="item && item.attachmentslinks" v-for="link in attachmentslinks" :key="link">
                      <v-icon>attach_file</v-icon>
                      <a :style="{color: styles.general.theme_color_dark}" :key="link" target="_blank" :href="link">
                        {{link}}
                      </a>
                    </p>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item id="info-3">
                <v-flex xs12 class="text-xs-center secondary--text bold my-4 title">
                    {{item.solicitationname}}
                </v-flex>   
                <v-layout justify-center row wrap style="margin-top:-20px;">
                  <v-flex md5 class="">
                    <v-select return-object v-model="filter" class="pt-0 mt-0" style="font-size:10px;" :items="[
                        { text: 'Display data by NAICS', value: 'naics' },
                        { text: 'Display data by PSC', value: 'psc' }
                      ]" />
                  </v-flex>
                </v-layout>

                <v-layout style="margin-top:-10px;" row wrap>
                  <v-flex md4>
                    <span style="text-align:center;font-size:16px;">
                      <p>
                        <span :style="{color:styles.general.theme_color_dark}">Avg. Award Amount</span><br/>
                        <b>{{ formatMoney(Math.round(Math.round(averageAwardAmount)/totalNumberOfAwards)) }}</b>
                      </p>
                    </span>
                  </v-flex>

                  <v-flex md4>
                    <span style="text-align:center;font-size:16px;" class="text-xs-center">
                      <p>
                        <span :style="{color:styles.general.theme_color_dark}">Number of Awards</span><br/>
                        <b @click.prevent="renderCharts">{{ totalNumberOfAwards }}</b>
                      </p>
                    </span>
                  </v-flex>

                  <v-flex md4>
                    <span style="text-align:center;font-size:16px;" class="text-xs-center">
                      <p>
                        <span :style="{color:styles.general.theme_color_dark}">Avg. No. of Offerers</span><br/>
                        <b>{{ '-' }}</b>
                      </p>
                    </span>
                  </v-flex>
                </v-layout>
                <v-layout style="padding:16px;margin-top:-25px;" row wrap class="text-xs-center">
                  <v-flex md6>
                    <p :style="{color:styles.general.theme_color_dark}" style="font-size:16px;">Contract Award Amount by Year</p>
                    <vue-highcharts :options="columnChart1" style="margin-top:-15px;" ref="columnChartRef1" />
                  </v-flex>
                  <v-flex md6>
                    <p :style="{color:styles.general.theme_color_dark}" style="font-size:16px;">Contract Award Volume by Year</p>
                    <vue-highcharts style="float: left;margin-top:-15px;" :options="columnChart2" ref="columnChartRef2" />
                  </v-flex>
                </v-layout>
                <v-layout style="padding:16px;margin-top:-50px;" class="text-xs-center" row wrap>
                  <v-flex md6>
                    <p :style="{color:styles.general.theme_color_dark}" style="font-size:16px;">Award Amount by Agency</p>
                    <vue-highcharts :options="pieChart1" style="margin-top:-15px;" ref="pieChartRef1" />
                  </v-flex>
                  <v-flex md6>
                    <p :style="{color:styles.general.theme_color_dark}" style="font-size:16px;">Award Amount by Agency</p>
                    <vue-highcharts style="float: left;margin-top:-15px;" :options="pieChart2" ref="pieChartRef2" />
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    
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
.email-link {
  text-decoration: none;
  color: #ffffff;
}
.email-link:hover {
  color: lightskyblue;
  text-decoration: underline;
}
.tabs__wrapper--scrollable {
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
import { formatCurrency, formatSeriesLabel } from './util'
import VueHighcharts from 'vue2-highcharts'
import 'mdi/css/materialdesignicons.min.css'
import ShareButton from '../../ShareButton.vue'
import FindContractorModal from '../findContractorModal.vue'
export default {
  components: {
    VueHighcharts,
    ShareButton,
    FindContractorModal
  },
  props: ['trigger', 'item', 'tracked'],
  data () {
    return {
      openModal: this.$props.dialog,
      findContractorDialog: false,
      active: 'info-1',
      totalNumberOfAwards: 0,
      averageAwardAmount: 0,
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
          text: 'Description'
        },
        {
          id: 3,
          text: 'Analytics'
        }
      ]
    }
  },
  watch: {
    openModal (val) {
      if (val) {
        this.active = 'info-1'
        this.prevUrl = window.location.href
        history.replaceState(null, null, '#id=' + this.item.id)
      } else {
        history.replaceState(null, null, this.prevUrl)
      }
    },
    filter (val) {
      const columnChartRef1 = this.$refs.columnChartRef1
      const columnChartRef2 = this.$refs.columnChartRef2
      const pieChartRef1 = this.$refs.pieChartRef1
      const pieChartRef2 = this.$refs.pieChartRef2
      columnChartRef1.delegateMethod('showLoading', 'Loading...')
      columnChartRef2.delegateMethod('showLoading', 'Loading...')
      pieChartRef1.delegateMethod('showLoading', 'Loading...')
      pieChartRef2.delegateMethod('showLoading', 'Loading...')
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
    this.$store.dispatch('getOpportunitiesAnalytics')
    var self = this
    this.$on('cancel', () => {
      self.findContractorDialog = false
      self.openModal = true
    })
  },
  methods: {
    formatMoney (val) {
      return formatCurrency(val)
    },
    trackItem () {
      let trackingPayload = {
        [this.item.id]: this.item.id
      }
      this.$firebase
        .database()
        .ref(`tracking/opportunities/${this.userDetails.uid}/${this.item.id}`)
        .set(trackingPayload)
    },
    untrackItem () {
      this.$firebase
        .database()
        .ref(`tracking/opportunities/${this.userDetails.uid}/${this.item.id}`)
        .set(null)
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
      const columnChartRef1 = this.$refs.columnChartRef1
      const columnChartRef2 = this.$refs.columnChartRef2
      const pieChartRef1 = this.$refs.pieChartRef1
      const pieChartRef2 = this.$refs.pieChartRef2
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
      const columnChartRef1 = this.$refs.columnChartRef1
      const columnChartRef2 = this.$refs.columnChartRef2
      // columnChartRef1.delegateMethod('setTitle', { text: `${this.selectedFilter.text} ${this.selectedFilter.value}: Award Amount History` })
      // columnChartRef2.delegateMethod('setTitle', { text: `${this.selectedFilter.text} ${this.selectedFilter.value}: Number of Awards` })
      columnChartRef1.removeSeries()
      columnChartRef2.removeSeries()

      var labels = this.historyAnalytics.amount.month_wise.labels

      var amountApiData = this.historyAnalytics.amount.month_wise.data
      var volumeApiData = this.historyAnalytics.count.month_wise.data

      var startYear = labels[0].split('-')[0] || (new Date()).getFullYear()
      var endYear = labels[labels.length - 1].split('-')[0] || (new Date()).getFullYear()

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
      const pieChartRef1 = this.$refs.pieChartRef1
      const pieChartRef2 = this.$refs.pieChartRef2
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
      history.replaceState(null, ' ', this.prevUrl)
      this.findContractorDialog = false
      this.$parent.$emit('cancel')
    },
    find () {
      this.findContractorDialog = true
    }
  },
  computed: {
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
    },
    attachmentslinks () {
      if (this.item && this.item.attachmentslinks) { return this.item.attachmentslinks.split(',') } else { return [] }
    },
    toggleDialog () {
      this.openModal = this.trigger
      return this.trigger
    }
  }
}
</script>
