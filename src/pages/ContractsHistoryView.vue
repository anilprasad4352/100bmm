<template>
  <v-container fluid :style="{backgroundColor: styles.general.background_color}">
    <div>
      <feedback-component module="history"></feedback-component>
      <v-container fluid style="padding-top: 60px;">
        <v-layout row wrap class="ml-5 my-4">
          <v-flex xs12 class="ml-4 mt-2">
            <p style="color:#4a4a4a;font-size:29px;font-weight:bolder;text-justify:auto;" class="page-header">
              Contract History</p>
          </v-flex>

          <v-flex xs12 style="color:#4a4a4a;font-size:18px;font-weight:400;margin:0px;" class="ml-4 page-header">
            <div style="margin-top:-10px;padding-top:0px;">
              <p style="text-justify:auto;">
                {{ pageData.history.sub_text }}
              </p>
            </div>
          </v-flex>

          <v-flex xs12>
            <v-toolbar flat dense style="padding-bottom:10px" height="30px" color="transparent">
              <v-toolbar-items class="hidden-sm-and-down">
                <multiple-filter :all="true" icon="account_balance" :list='agencyList' id='majagencycat' @apply='applyFilter' label="Agency" :input="filters.values.majagencycat" />
                <multiple-filter :list='naicsCodes' icon='list' id='naics' @apply='applyFilter' label="NAICS" :input='filters.values.naics' />
                <multiple-filter icon="art_track" :list='pscCodes' id='psc' @apply='applyFilter' label="PSC" :input="filters.values.psc" />
                <multiple-filter :all="true" single=true icon="play_for_work" :list='subcontractplan' id='subcontractplan' @apply='applyFilter' label="Sub Contract Plan" :input="filters.values.subcontractplan" />
                <multiple-filter :all="true" :list='setAsides' icon='flag' id='setaside' @apply='applyFilter' label="Set Aside" :input="filters.values.setaside" />
                <v-menu offset-x :close-on-content-click="false" v-model="dateMenu" style="padding-right:10px">
                  <v-btn outline :color="filters.values.startdate || filters.values.enddate ? 'indigo':'black'" flat small slot="activator">Dates
                    <v-icon right>date_range</v-icon>
                  </v-btn>

                  <v-card>
                    <v-list>
                      <v-flex xs12 class="px-2">
                        <v-select label='Contract Dates' prepend-icon="date_range" :items="daterange" v-model="filters.values.daterangetype" />
                      </v-flex>
                    </v-list>

                    <v-list>
                      <v-flex xs6 class="ml-2" v-if="filters.values.daterangetype == 'Signed Date' || filters.values.daterangetype =='Completion Date'">
                        <v-menu lazy v-model="startDateMenu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px">
                          <v-layout slot="activator" style="font-weight:400;height:100%;" column>
                            <v-text-field prepend-icon="date_range" name="zip-code" label="Start Date" v-model="startdate"></v-text-field>
                          </v-layout>
                          <v-date-picker v-model="startdate" no-title scrollable>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>

                      <v-flex xs12 class="ml-2" v-if="filters.values.daterangetype == 'Fiscal Year' ">
                        <v-select label='Fiscal Years' prepend-icon="date_range" :items="fiscalList" v-model="fiscalYear" />
                      </v-flex>

                      <v-flex xs6 class="ml-2" v-if="filters.values.daterangetype == 'Signed Date' || filters.values.daterangetype =='Completion Date'">
                        <v-menu lazy v-model="endDateMenu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px">
                          <v-layout slot="activator" style="font-weight:400;height:100%;" column>
                            <v-text-field prepend-icon="date_range" name="zip-code" label="End Date" v-model="enddate"></v-text-field>
                          </v-layout>
                          <v-date-picker v-model="enddate" no-title scrollable></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-list>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="dateMenu = false">Cancel</v-btn>
                      <v-btn color="primary" flat @click="applyDate">Apply</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <v-text-field style="padding-right:10px" single-line prepend-icon="search" label="Search" v-model="filters.values.search"></v-text-field>
                <v-btn class="search-button" @click="clearFilters">
                  Clear Filter
                </v-btn>
                <v-btn :disabled="deactivateSaveButton" class="search-button" @click="openSaveSearchModal">
                  Save Search
                </v-btn>
              </v-toolbar-items>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-flex>

           <v-flex xs12>
            <v-btn class="margin-button" @click="openSavedSearchModal">
              View Saved Searches
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider class="secondary"></v-divider>
        <v-container class="white" fluid>
          <v-card>
            <v-layout row wrap>
              <v-flex md12>
                <div>
                  <kendo-table :kendo-schema="kendoSchema" @view="moreInfo" :url="url" :height="800" ref="kendoTable" @change="selectRow"></kendo-table>
                </div>
              </v-flex>
            </v-layout>
          </v-card>
        </v-container>
        <!-- <sidebox-chat /> -->
        <full-view-chat />
        <div v-if="dialog">
          <history-view-modal :dialog="dialog" @cancel="cancel" :item="selectedItem" :favorited="favorited" />
        </div>
        <div v-if="searchDialog">
          <save-search-modal :dialog.sync="searchDialog" :searchPayload="searchParameters" type="histories" @closeSaveSearchModal="closeSaveSearchModal"></save-search-modal>
        </div>
        <div v-if="savedSearchDialog">
          <saved-searches-modal :dialog.sync="savedSearchDialog" @closeSavedSearchesModal="closeSavedSearchesModal" @performSearch="performSearch" :savedSearches="savedSearches" pageName="Histories"></saved-searches-modal>
        </div>
      </v-container>
      <!-- <site-footer></site-footer> -->
    </div>
  </v-container>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import naicsCodes from './constants/NAICSCode.json'
import pscCodes from './constants/PSCCode.json'
import SideboxChat from '../components/chat/sideboxChat.vue'
import FullViewChat from '../components/chat/fullviewChat.vue'
import SignupComponent from '../components/modal/RegistrationComponent.vue'
import HistoryViewModal from '../components/modal/info/historyViewModal.vue'
import SiteFooter from '../components/SiteFooter.vue'
import agencyList from './constants/Agency.json'
import KendoTable from '../components/KendoTable'
import FeedbackComponent from '../components/FeedbackComponent.vue'
import MultipleFilter from '../components/filter/multipleFilter.vue'
import _ from 'lodash'
import SaveSearchModal from '../components/modal/SaveSearchModal.vue'
import SavedSearchesModal from '../components/modal/SavedSearchesModal'

let db = Vue.prototype.$firebase.database()

export default {
  components: {
    SignupComponent,
    SideboxChat,
    FullViewChat,
    MultipleFilter,
    HistoryViewModal,
    SiteFooter,
    KendoTable,
    FeedbackComponent,
    SaveSearchModal,
    SavedSearchesModal
  },
  data () {
    return {
      search: '',
      dateMenu: false,
      startDateMenu: false,
      startdate: null,
      enddate: null,
      fiscalYear: null,
      setAsides: [
        { value: 'NONE', text: 'No Set Aside' },
        { value: '8(A)', text: 'Competitive 8(a)' },
        { value: 'HBCU', text: 'HBCU' },
        { value: 'HUBZONE', text: 'HUBZONE' },
        { value: 'INDIAN SMALL BUSINESS', text: 'Indian Small Business' },
        { value: 'SMALL BUSINESS SET ASIDE', text: 'Small Business' },
        { value: 'VETERAN', text: 'Veteran Owned' },
        { value: 'WOMEN OWNED', text: 'Women Owned' }
      ].map(value => ({ text: ``, value })),
      endDateMenu: false,
      url: 'https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?',
      dialog: false,
      loading: true,
      selectedDateRange: '',
      selectedRow: '',
      count: 0,
      selectedItem: {},
      fiscalList: [],
      tablePagination: {
        rowsPerPage: 5
      },
      totalItems: null,
      startmenu: false,
      endmenu: false,
      agencyList: agencyList.map(val => ({
        text: ``,
        value: {
          value: val.agency,
          text: val.agency
        }
      })),
      pscCodes: pscCodes.map(val => ({
        text: ``,
        value: {
          value: val.psccode,
          text: `${val.psccode}  ${val.psccodedescription}`
        }
      })),
      naicsCodes: naicsCodes.map(val => ({
        text: ``,
        value: {
          value: val.naicscode,
          text: `${val.naicscode} ${val.naicscodedescription}`
        }
      })),
      heading: 'Department of Defense Contract History',
      kendoSchema: [
        {
          title: 'Signed Date',
          field: 'signeddate',
          editable: false,
          format: '{0:MM-dd-yyyy}',
          width: 150
        },
        {
          title: 'Transaction ID',
          field: 'uniquetransactionid',
          editable: false,
          hidden: true,
          width: 250
        },
        { title: 'Agency', field: 'majagencycat', editable: false, width: 250 },
        {
          title: 'Agency ID',
          field: 'contractingofficeagencyid',
          editable: false,
          width: 250
        },
        {
          title: 'Contract Action Type',
          field: 'contractactiontype',
          editable: false,
          width: 200
        },
        {
          title: 'Fiscal Year',
          field: 'fiscalyear',
          editable: false,
          width: 150
        },
        {
          title: 'NAICS Description',
          field: 'naicsdescription',
          editable: false,
          width: 200
        },
        {
          title: 'PCS Description',
          field: 'pscdescription',
          editable: false,
          width: 200
        },
        {
          title: 'Subcontract Plan',
          field: 'subcontractplan',
          editable: false,
          width: 250
        },
        {
          title: 'Vendor Name',
          field: 'vendorname',
          editable: false,
          width: 250
        },
        {
          title: 'Place of Performance',
          field: 'popcitystate',
          editable: false,
          width: 250
        },

        {
          title: 'Dollars Obligated',
          field: 'dollarsobligated',
          hidden: true,
          editable: false,
          width: 150
        },
        {
          title: 'Total Contract Value',
          field: 'totalcontractvalue',
          editable: false,
          hidden: true,
          width: 250
        },

        {
          title: 'Set-Aside Type',
          field: 'typeofsetaside',
          editable: false,
          hidden: true,
          width: 250
        },

        {
          title: 'Current Completion Date',
          field: 'currentcompletiondate',
          editable: false,
          hidden: true,
          format: '{0:MM-dd-yyyy}',
          width: 250
        },

        {
          title: 'Completion Date',
          field: 'ultimatecompletiondate',
          editable: false,
          hidden: true,
          format: '{0:MM-dd-yyyy}',
          width: 125
        },
        {
          title: 'Program Code',
          field: 'majorprogramcode',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Extent Competed',
          field: 'extentcompeted',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Created At',
          field: 'created_at',
          editable: false,
          hidden: true,
          format: '{0:MM-dd-yyyy}',
          width: 250
        },
        {
          title: 'Contract Duration',
          field: 'contractduration',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Pop County',
          field: 'popcounty',
          editable: false,
          hidden: true,
          width: 250
        },

        {
          title: 'Type of Contract Pricing',
          field: 'typeofcontractpricing',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Program Source Agency',
          field: 'progsourceagency',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Competitive Procedures',
          field: 'competitiveprocedures',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Place of Performance ZIP Code',
          field: 'placeofperformancezipcode',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Prog Source Account',
          field: 'progsourceaccount',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Vendor State',
          field: 'vendorstate',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Contractaction Type',
          field: 'contractactiontype',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Prime Awardee Executive',
          field: 'primeawardeeexecutive',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'DUNS Number',
          field: 'dunsnumber',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'Solicitation Procedures',
          field: 'solicitationprocedures',
          editable: false,
          hidden: true,
          width: 250
        },
        {
          title: 'NAICS Code',
          field: 'naicscode',
          editable: false,
          hidden: true,
          width: 250
        },

        {
          title: 'Total Contract Value',
          field: 'totalcontractvalue',
          editable: false,
          hidden: true,
          template: d => {
            if (d.totalcontractvalue !== 'N/A') { return `$${d.totalcontractvalue}` } else return d.totalcontractvalue
          }
        }
      ],
      subcontractplan: [
        'All',
        'A: PLAN NOT INCLUDED - NO SUBCONTRACTING POSSIBILITIES',
        'B: PLAN NOT REQUIRED',
        'C: PLAN REQUIRED - INCENTIVE NOT INCLUDED',
        'D: PLAN REQUIRED - INCENTIVE INCLUDED',
        'E: PLAN REQUIRED (PRE 2004)',
        'F: INDIVIDUAL SUBCONTRACT PLAN',
        'G: COMMERCIAL SUBCONTRACT PLAN'
      ].map(value => ({ text: value, value })),
      daterange: ['All', 'Signed Date', 'Completion Date', 'Fiscal Year'].map(
        value => ({ value, text: value })
      ),
      showDateRange: false,
      filters: {
        values: {
          subcontractplan: '',
          setaside: '',
          search: '',
          psc: '',
          naics: '',
          startdate: '',
          daterangetype: '',
          enddate: '',
          fiscalYear: '',
          majagencycat: ''
        }
      },
      items () {
        return this.getContractHistoryState.data
      },
      favorited: false,
      searchDialog: false,
      searchParameters: {},
      savedSearchDialog: false,
      savedSearches: [],
      usedSavedSearch: false
    }
  },
  firebase () {
    return {
      history: db.ref('favorites/history'),
      savedHistories: db.ref('saved_searches/histories')
    }
  },
  watch: {
    tablePagination: {
      handler (val) {
        let skip = 0
        this.loading = true
        if (val.page > 1) {
          skip = this.count * val.page
        }
        this.getContractHistory({ skip, limit: val.rowsPerPage }).then(res => {
          this.totalItems = res.data.total
          this.count = res.data.data.length
          this.loading = false
        })
      },
      deep: true
    },
    selectedDateRange (val) {
      if (val) {
        this.showDateRange = true
        this.filters.values.daterangetype = val
      }
      this.getContractHistory()
    },
    filters: {
      handler (val) {
        let query = ''
        var payload = val.values
        let contractHistoryAPI = `https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?`
        if (payload && payload.skip) {
          query += `&skip=${payload.skip}`
        }
        if (payload && payload.psc && payload.psc.length > 0) {
          query += `&psc=${payload.psc.join('.')}`
        }
        if (payload && payload.naics && payload.naics.length > 0) {
          query += `&naics=${payload.naics.join('.')}`
        }
        if (payload && payload.search) {
          query += `&keywords=${payload.search}`
        }
        if (
          payload &&
          payload.subcontractplan &&
          payload.subcontractplan.length &&
          payload.subcontractplan !== 'All'
        ) {
          const subcontractplan = payload.subcontractplan.split(': ')[0]
          query += `&subcontractplan=${subcontractplan}`
        }
        if (
          payload &&
          payload.setaside &&
          payload.setaside !== 'All' &&
          payload.setaside.length > 0
        ) {
          query += '&setaside=' + payload.setaside.join('.')
        }
        if (
          payload &&
          payload.daterangetype &&
          payload.startdate &&
          payload.enddate &&
          payload.daterangetype.length &&
          payload.daterangetype !== 'Fiscal Year'
        ) {
          const daterangetype = payload.daterangetype
            .toLowerCase()
            .split(' ')
            .join('')
          query += `&daterangetype=${daterangetype}&daterange=${
            payload.startdate
          }to${payload.enddate}`
        }
        if (
          payload &&
          payload.daterangetype === 'Fiscal Year' &&
          payload.fiscalYear
        ) {
          query += `&daterangetype=fiscalyear&daterange=${
            payload.fiscalYear
          }to${payload.fiscalYear}`
        }
        if (
          payload &&
          payload.majagencycat &&
          payload.majagencycat !== '' &&
          payload.majagencycat.length > 0
        ) {
          query += '&agency=' + payload.majagencycat.join('.')
        }
        contractHistoryAPI += query
        this.url = contractHistoryAPI

        var hash = val.values

        this.$store.dispatch('setUrlHash', {
          base: 'contract-history',
          values: hash
        })
      },
      deep: true
    }
  },
  methods: {
    applyDate () {
      this.filters.values.startdate = this.startdate
      this.filters.values.enddate = this.enddate
      this.filters.values.fiscalYear = this.fiscalYear
      this.dateMenu = false
    },
    applyFilter ({ id, filter }) {
      this.filters.values[id] = filter
    },
    openSaveSearchModal () {
      this.searchDialog = true
      this.searchParameters = this.filters.values
    },
    closeSaveSearchModal () {
      this.searchDialog = false
    },
    openSavedSearchModal() {
      this.savedSearchDialog = true
    },
    closeSavedSearchesModal () {
      this.savedSearchDialog = false
    },
    performSearch (searchFilters) {
      Object.keys(searchFilters).forEach((filter) => {
        this.filters.values[filter] = searchFilters[filter]
      })
      this.usedSavedSearch = true
    },
    ...mapActions(['getContractHistory']),
    fetchContractHistory (id) {
      var self = this
      console.log(id)
      let api =
        'https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?uniquetransactionid=' +
        id.split('=')[1]
      return axios.get(api).then(res => {
        if (res.data.total > 0) self.moreInfo(res.data.data[0])
      })
    },
    fetchFiscalYears () {
      let api = 'https://fed-exchange-api.herokuapp.com/api/v2.0/fiscal_years'
      return axios.get(api).then(({ data }) => {
        this.fiscalList = data.fiscal_years
      })
    },
    selectRow (e) {
      this.selectedRow = e
    },
    saveFilters () {
      this.$firebase
        .database()
        .ref(
          `filters/contracthistory/${this.$store.getters.getUserDetails.uid}`
        )
        .set(this.filters)
    },
    clearFilters () {
      this.filters.values = {
        subcontractplan: '',
        setaside: [],
        search: '',
        psc: [],
        naics: [],
        startdate: null,
        daterangetype: '',
        enddate: null,
        majagencycat: []
      }
    },
    todayDate () {
      let today = new Date()
      let dd = today.getDate()
      let mm = today.getMonth() + 1

      const yyyy = today.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd
      return today
    },
    moreInfo (item) {
      this.selectedItem = item
      let userId = this.$store.getters.getUserDetails.uid
      this.dialog = true
      const self = this
      this.$firebaseRefs.history
        .child(`/${userId}/${this.selectedItem.uniquetransactionid}`)
        .on('value', function (result) {
          if (result.val()) {
            self.favorited = true
          } else {
            self.favorited = false
          }
        })
    },
    cancel () {
      this.dialog = false
    },
    fetchSavedSearches() {
      let userId = this.$store.getters.getUserDetails.uid
      const self = this
      this.$firebaseRefs.savedHistories
        .child(`/${userId}`)
        .on('value', function (result) {
          if (result.val()) {
            self.savedSearches = Object.keys(result.val()).map((item) => {
              const savedObject = result.val()[item]
              savedObject.id = item
              return savedObject;
            })
            self.savedSearches.sort((item1, item2) => item2.dateCreated - item1.dateCreated)
          } else {
            self.savedSearches = []
          }
        })
    },
  },
  mounted () {
    var id = window.location.hash.substring(1)
    let query = ''
    this.fetchContractHistory(id)
    this.fetchFiscalYears()
    const payload = {
      meta: {
        h1: this.$store.getters.getPages.history.header,
        title: this.$store.getters.getPages.history.header,
        description: 'Defense contracts history',
        keywords: 'contracts, contracts history, history, defense contracts',
        requiresAuth: true
      }
    }
    document.title = payload.meta.title
    this.$router.app.$on('clearFilter', () => {
      this.clearFilters()
      if (
        payload &&
        payload.majagencycat &&
        payload.majagencycat !== '' &&
        payload.majagencycat.length > 0
      ) {
        query += '&agency=' + payload.majagencycat.join('.')
      }
      let contractHistoryAPI
      contractHistoryAPI += query
      this.url = contractHistoryAPI

      var hash = this.filters.values

      this.$store.dispatch('setUrlHash', {
        base: 'contract-history',
        values: hash
      })
    }),
    this.fetchSavedSearches()
  },
  computed: {
    ...mapGetters(['getContractHistoryState']),
    pageData () {
      return this.$store.getters.getSettings.pages
    },
    styles () {
      return this.$store.getters.getStyles
    },
    deactivateSaveButton(){
      let emptyFilter = Object.keys(this.filters.values).every((filter) => {
        if ( filter === 'type') {
          return true
        }
        return this.filters.values[filter] === ''
      })
      return emptyFilter || this.usedSavedSearch
    },

  }
}
</script>
<style scoped>
.text-uppercase {
  text-transform: uppercase;
}
.new-green {
  background: #64d085;
}
.full-width {
  width: 100%;
}
.text-white {
  color: #fff;
}
.bg-white {
  background: #fff;
}
.textLeft {
  padding-left: 10px !important;
}
th.column.text-xs-left {
  padding-left: 0px !important;
  font-size: 12px;
}

.filters {
  width: 100%;
  background: #fff;
  display: inline-block;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 12px 20px;
}

select.arrow {
  background-image: linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, gray 50%, transparent 50%),
    linear-gradient(to right, #ccc, #ccc);
  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
  background-size: 5px 5px, 5px 5px, 1px 1.5em;
  background-repeat: no-repeat;
}

.filterLabel {
  font-size: 12pt;
  min-height: 20px;
  line-height: 1.471;
  margin-bottom: 0px;
}

select.arrow:focus {
  background-image: linear-gradient(45deg, green 50%, transparent 50%),
    linear-gradient(135deg, transparent 50%, green 50%),
    linear-gradient(to right, #ccc, #ccc);
  background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em,
    calc(100% - 2.5em) 0.5em;
  background-size: 5px 5px, 5px 5px, 1px 1.5em;
  background-repeat: no-repeat;

  outline: 0;
}
.search-button {
  margin: 0 5px !important;
}
.margin-button {
  margin-left: 16px
}
</style>
