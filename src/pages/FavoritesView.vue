<template>
  <v-container style="padding-top: 100px" fluid :style="{backgroundColor: styles.general.background_color}">
    <div>
      <feedback-component module="favorites"></feedback-component>
      <v-container fluid style="padding-top: 60px;">
        <v-layout row wrap style="margin-bottom: 30px;" class="mx-5">
          <v-flex xs12 class="ml-4 mt-2">
            <h2 style="color:#4a4a4a;font-size:29px;font-weight:bolder;text-justify:auto;" class="page-header">{{ pages.favorites.header }}</h2>
          </v-flex>

          <v-flex xs12 style="color:#4a4a4a;font-size:18px;font-weight:400;margin:0px;" class="ml-4 page-header">
            <div style="margin-top:-10px;padding-top:0px;">
              <p style="text-justify:auto;line-height:22px;">
                {{ pages.favorites.sub_text }}
              </p>
            </div>
          </v-flex>
        </v-layout>
        <v-layout class="mx-5">
          <v-divider class=" mx-5 secondary"></v-divider>
        </v-layout>
        <v-layout class="mx-4 mt-3">
          <v-card class="mx-5" style="width:100%;">
            <v-tabs :scrollable="false" fixed >
              <v-tab  light color="white"  href="#tab-1" class="white mx-2" style="height:60px;overflow:none;">
                <div style="text-transform:capitalize;font-size:16px;" >
                  <v-icon medium>assignment_ind</v-icon>
                  Directory ({{ companies.length }})
                </div>
              </v-tab>

              <v-tab light color="white" href="#tab-2" class="mx-2" style="height:60px;overflow:none;">
                <div style="text-transform:capitalize;font-size:16px;">
                  <v-icon medium>history</v-icon>
                  History ({{ contracts.length }})
                </div>
              </v-tab>
              <v-tab-item id="tab-1">
                <v-card-text>
                  <v-layout column wrap style="height:100%;">
                    <v-flex v-if="companies.length > 0" sm12 md12>
                      <kendo-table :kendo-schema="directorySchema" @view="moreInfo" ref="kendoTable" @loaded="itemsLoaded" :url="directoryUrl" @totalRecords="totalRecords" @change="selectRow"></kendo-table>
                    </v-flex>
                    <v-flex v-else>
                      <h6 style="text-align:center;">You do not have any favorite yet</h6>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-tab-item>

              <v-tab-item id="tab-2">
                <v-card-text>
                  <v-layout row wrap style="height:100%;" >
                    <v-flex v-if="contracts.length > 0" sm12 md12>
                      <kendo-table :kendo-schema="historySchema" @view="moreInfoHistory" ref="kendoTable" @loaded="itemsLoaded" :url="historyUrl" @totalRecords="totalRecords" @change="selectRow"></kendo-table>
                    </v-flex>
                    <v-flex v-else>
                      <h6 style="text-align:center;">You do not have any favorite yet</h6>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-layout>
      </v-container>
      <div v-if="dialog">
        <contractor-view-modal :dialog.sync="dialog" :item="item" :favorited="favorited"></contractor-view-modal>
      </div>
      <div v-if="historyDialog">
        <history-view-modal :dialog.sync="historyDialog" @cancel="cancel" :item="selectedHistoryItem" :favorited="favorited" />
      </div>
    </div>
  </v-container>
</template>

<script>
  import FeedbackComponent from '../components/FeedbackComponent.vue'
  import KendoTable from '../components/KendoTable'
  import Vue from 'vue'
  import SiteFooter from '../components/SiteFooter.vue'
  import ContractorViewModal from '../components/modal/info/contractorViewModal.vue'
  import HistoryViewModal from '../components/modal/info/historyViewModal.vue'
  import 'font-awesome/css/font-awesome.min.css'

  let db = Vue.prototype.$firebase.database()

  export default {
    components: {
      FeedbackComponent,
      KendoTable,
      ContractorViewModal,
      SiteFooter,
      HistoryViewModal
    },
    data () {
      return {
        favoritedItems: [],
        link: 'https://fed-exchange-api.herokuapp.com/api/v2.0/',
        dialog: false,
        recordsCount: 0,
        totalItems: 0,
        selectedRow: '',
        item: null,
        count: 0,
        companies: [],
        loading: true,
        directorySchema: [
          { title: 'Company', field: 'companylegalname', editable: false },
          { title: 'Address', field: 'streetaddress', editable: false },
          {
            title: 'SBA Certifications',
            field: 'companycertifications',
            editable: false
          }
        ],
        historySchema: [
          { title: 'Agency',
            field: 'majagencycat',
            editable: false
          },
          {
            title: 'Contract Action Type',
            field: 'contractactiontype',
            editable: false
          },
          {
            title: 'NAICS Description',
            field: 'naicsdescription',
            editable: false
          },
          {
            title: 'PCS Description',
            field: 'pscdescription',
            editable: false
          },
          {
            title: 'Solicitation Procedures',
            field: 'solicitationprocedures',
            editable: false
          }
        ],
        favorited: true,
        directoryUrl: '',
        historyUrl: '',
        contracts: [],
        historyDialog: false,
        seletedHistoryItem: null
      }
    },
    firebase () {
      return {
        directory: db.ref('favorites/directory'),
        history: db.ref('favorites/history')
      }
    },
    computed: {
      pages () {
        return this.$store.getters.getPages
      },
      styles () {
        return this.$store.getters.getStyles
      },
      state () {
        if (this.$store.getters.getCompanyDetails) { return this.$store.getters.getCompanyDetails.state }
      }
    },
    mounted () {
      const payload = {
        meta: {
          'h1': 'Favorites',
          'title': 'Favorites',
          'description': 'Favorites Page',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)

      let userId = this.$store.getters.getUserDetails.uid
      let self = this
      this.$firebaseRefs.directory.child(`/${userId}`).once('value', function (result) {
        if (result.val()) {
          self.loading = false
          self.companies = Object.keys(result.val())
          self.directoryUrl = self.link + `companydirectory?id=${self.companies.join('.')}`
        } else {
          self.loading = false
        }
      })

      this.$firebaseRefs.history.child(`/${userId}`).once('value', function (result) {
        if (result.val()) {
          self.loading = false
          self.contracts = Object.keys(result.val())
          self.historyUrl = self.link + `contractsfilter?uniquetransactionid=${self.contracts.join('.')}`
        } else {
          self.loading = false
        }
      })
      this.$on('cancel', () => {
        self.dialog = false
        this.$refs.kendoTable.deselectRow(self.selectedRow)
      })
    },
    methods: {
      selectRow (e) {
        this.selectedRow = e
      },
      totalRecords (val) {
        this.recordsCount = val
      },
      moreInfo (val) {
        this.dialog = true
        this.item = val
      },
      moreInfoHistory (val) {
        this.historyDialog = true
        this.selectedHistoryItem = val
      },
      itemsLoaded (val) {
        // this.removeMarkers()
        this.items = val
        // this.loadMarkers()
      },
      cancel () {
        this.historyDialog = false
      }
    }
  }
</script>

<style>
</style>
