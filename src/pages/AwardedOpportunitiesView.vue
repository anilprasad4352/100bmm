<template>
  <div style="padding-top: 100px">
    <v-container :style="{backgroundColor: styles.general.background_color}">
      <v-layout row >
        <v-flex>
          <v-card flat class="new-green px-3 pt-3 pb-2">
            <v-layout row wrap>
              <v-flex md3>
                <p class="text-white" style="font-size: 13px;">
                  {{ pageData.awardedopportunities.sub_text }}
                </p>
              </v-flex>
              <v-flex md3>
              </v-flex>
              <v-flex md3>
              </v-flex>
              <v-flex md3>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-3">
        <v-flex md12>
          <div class="bg-white px-2 pt-2 pb-2">
            <v-layout row wrap class="mb-2">
              <v-flex md12 class="pl-1">
                <b>Filters</b>
              </v-flex>
              <v-flex md2 class="pl-1">
                <v-text-field
                  class="pt-0 mt-0"
                  v-model="filters.values.naics"
                  single-line
                  placeholder="NAICS"
                >
                </v-text-field>
              </v-flex>
              <v-flex md2 class="pl-1">
                <v-text-field
                  class="pt-0 mt-0"
                  light
                  v-model="filters.values.psc"
                  hide-details
                  single-line
                  placeholder="PSC"
                >
                </v-text-field>
              </v-flex>
              <v-flex md2 class="pl-1">
                <v-text-field
                  class="pt-0 mt-0"
                  v-model="filters.values.search"
                  light
                  hide-details
                  single-line
                  placeholder="Search"
                >
                </v-text-field>
              </v-flex>
              <v-flex md2 class="pl-1">
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="startmenu"
                  transition="scale-transition"
                  offset-y
                  class="mt-0"
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    class="pt-0"
                    slot="activator"
                    placeholder="Start Date"
                    v-model="filters.values.startdate"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="filters.values.startdate" no-title scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex md2 class="pl-1">
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="endmenu"
                  transition="scale-transition"
                  offset-y
                  class="mt-0"
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    class="pt-0"
                    slot="activator"
                    placeholder="End Date"
                    v-model="filters.values.enddate"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="filters.values.enddate" no-title scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex md2>
                <!-- <v-btn class="mt-3" @click.prevent="saveFilters">Save filters</v-btn> -->
                <v-btn class="mt-3" style="margin-top: -8px !important;" @click.prevent="clearFilters">Clear filters</v-btn>
              </v-flex>
            </v-layout>
            <kendo-table :kendo-schema="kendoSchema" @view="moreInfo" :url="url"></kendo-table>
          </div>
        </v-flex>
      </v-layout>
        <!-- <sidebox-chat /> -->
      <full-view-chat />
      <opportunities-modal :dialog="dialog" :item="selectedItem"/>
    </v-container>
    <site-footer></site-footer>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import SideboxChat from '@/components/chat/sideboxChat.vue'
  import FullViewChat from '@/components/chat/fullviewChat.vue'
  import OpportunitiesModal from '../components/modal/info/opportunitiesViewModal.vue'
  import SiteFooter from '../components/SiteFooter.vue'
  import KendoTable from '../components/KendoTable.vue'

  export default {
    components: {
      OpportunitiesModal,
      SideboxChat,
      FullViewChat,
      SiteFooter,
      KendoTable
    },
    data: () => {
      return {
        search: '',
        url: 'https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?',
        dialog: false,
        startmenu: false,
        endmenu: false,
        totalItems: null,
        selectedItem: null,
        loading: true,
        pagination: {
          rowsPerPage: 25
        },
        heading: 'Department of Defense Contract History',
        noticetypes: [
          'All Notices',
          'A'
        ],
        kendoSchema : [
          {field: "posteddate", title: "Date",editable: false, format:"{0:MM-dd-yyyy}"},
          {field: "solicitationname", title: "Title", editable:false},
          {field: "agency", title:"Agency", editable: false},
          {field: "noticetype", title: "Notice Type", editable:false},
          {field: "naicscode", title: "NAICS Code", editable: false, type: "number", hidden: true},
          {field: "setaside", title: "Set-Aside", editable:false},
          {field: "primarypointofcontact", title:" Point of Contact", hidden: true}
        ],
        count: 0,
        filters: {
          values: {
            startdate: null,
            enddate: null,
            psc: '',
            naics: '',
            search: '',
            type: 'award'
          }
        }
      }
    },
    watch: {
      pagination (val) {
        let skip = 0
        this.loading = true
        if (val.page > 1) {
          skip = this.count * val.page
        }
        this.$store.dispatch('getOpportunities', { type: 'award', skip, limit: val.rowsPerPage }).then(res => {
          this.totalItems = res.data.total
          this.count = res.data.data.length
          this.loading = false
          return res
        })
      },
      filters: {
        handler (val) {
         
          var query = 'https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?'
          var payload = val.values
          if (payload && payload.type) {
            query += `&type=${payload.type}`
          }
          if (payload && payload.psc) {
            query += `&psc=${payload.psc}`
          }
          if (payload && payload.naics) {
            query += `&naics=${payload.naics}`
          }
          if (payload && payload.startdate && payload.enddate) {
            query += `&daterange=${payload.startdate}to${payload.enddate}`
          }
          if (payload && payload.search) {
            query += `&keywords=${payload.search}`
          }
          this.url = query
          console.log(this.url)
          this.$store.dispatch('setUrlHash', {base: 'awarded', values: val.values})
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getOpportunities'
      ]),
      saveFilters () {
        this.$firebase.database().ref(`filters/awardedopportunities/${this.$store.getters.getUserDetails.uid}`).set(this.filters)
      },
      moreInfo (item) {
        this.dialog = true
        this.selectedItem = item
      },
      clearFilters () {
        this.filters.values = {
          startdate: null,
          enddate: null,
          psc: '',
          naics: '',
          search: '',
          type: 'award'
        }
      }
    },
    mounted () {
      const payload = {
        meta: {
          'h1': this.$store.getters.getPages.awardedopportunities.header,
          'title': this.$store.getters.getPages.awardedopportunities.header,
          'description': 'Search active Department of Defense solicitations by utilizing the Active Contract Opportunities Module. Use the functionality n this module to stratergize, connect, and colaborate with other contractors to pursue specefic contract opportunities',
          'keywords': 'opportunities, defense opportunities, department of defense, defense',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
      const self = this
      this.$on('cancel', () => {
        self.dialog = false
      })
      this.clearFilters()
      console.log(this.filters)
      this.getOpportunities({ type: 'award' }).then((res) => {
        this.totalItems = res.data.total
        this.count = res.data.data.length
        this.loading = false
        return res
      })
      // this.$firebase.database().ref(`filters/awardedopportunities/${this.$store.getters.getUserDetails.uid}`).once('value')
      //   .then(snapshot => {
      //     const filter = snapshot.val()
      //     if (filter.values) {
      //       this.filters = filter
      //     }
      //   })
    },
    computed: {
      ...mapGetters([
        'getOpportunitiesState'
      ]),
      items () {
        const data = this.getOpportunitiesState.data
        return data
      },
      pages () {
        return this.pagination.rowsPerPage ? Math.ceil(this.items.length / this.pagination.rowsPerPage) : 0
      },
      pageData () {
        return this.$store.getters.getPages
      },
	  styles () {
        return this.$store.getters.getStyles
      }
    }
  }

</script>
<style>
  .postdate-width {
    width: 120px !important
  }
  .text-uppercase {
    text-transform: uppercase !important;
  }
  .new-green {
    background: #64d085 !important;
  }
  .full-width {
    width: 100% !important;
  }
  .text-white {
    color: #fff !important;
  }
  .bg-white {
    background: #fff !important;
  }
  .textLeft{
    padding-left: 10px !important;
  }
  th.column.text-xs-center {
    text-align: left !important;
    padding-left: 0px !important;
    font-size: 12px;
  }
</style>
