<template>
<div>
  <v-container style="padding-top: 100px">
    <v-layout row >
      <v-flex>
        <v-card flat class="new-green px-3 pt-3 pb-2">
          <v-layout row wrap>
            <v-flex md3>
              <p class="text-white" style="font-size: 13px;">
                {{ pageData.forecastopportunities.sub_text }}
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

    <v-layout row wrap class="mb-2">
          <v-flex md12 class="pl-1">
            <b>Filters</b>
          </v-flex>
          <v-flex md2 class="pl-1">
            <v-text-field
              class="pt-0 mt-0"
              color="green"
              v-model="filters.values.naics"
              light
              hide-details
              single-line
              placeholder="Naics"
            >
            </v-text-field>
          </v-flex>
          <v-flex md2 class="pl-1">
            <v-text-field
              class="pt-0 mt-0"
              color="green"
              v-model="filters.values.psc"
              light
              hide-details
              single-line
              placeholder="PSC"
            >
            </v-text-field>
          </v-flex>
          <v-flex md2 class="pl-1 pb-0">
            <v-text-field class="pt-0 mb-0 mt-0" v-model="filters.values.search" hide-details single-line placeholder="Search"></v-text-field>
          </v-flex>
          
          
      

          <v-flex md2>
            <!-- <v-btn class="mt-3" @click.prevent="saveFilters">Save filters</v-btn> -->
            <v-btn style="margin-top: -8px !important;" class="mt-3" @click.prevent="clearFilters">Clear filters</v-btn>
          </v-flex>
    </v-layout>


    <v-layout row wrap class="mt-3">
      <v-flex md12>
        <div class="bg-white px-2 pt-2 pb-2">
        <v-card>

          
          


          <v-layout row>
            <v-flex md12>
              <kendo-table :kendo-schema="kendoSchema" @view="moreInfo" :url="url"></kendo-table>
            </v-flex>
          </v-layout>
        </v-card>
      </div>
      </v-flex>
    </v-layout>
    <!-- <sidebox-chat /> -->
    <full-view-chat />
    <forecast-opportunities-modal :dialog="dialog" :item="selectedItem"/>
  </v-container>
  <site-footer></site-footer>
</div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import SideboxChat from '@/components/chat/sideboxChat.vue'
  import FullViewChat from '@/components/chat/fullviewChat.vue'
  import ForecastOpportunitiesModal from '../components/modal/info/forecastOpportunitiesViewModal.vue'
  import moment from 'moment'
  import Vue from 'vue'
  import KendoTable from '../components/KendoTable'
  import SiteFooter from '@/components/SiteFooter.vue'
  Vue.filter('formatDateTime', function (value) {
    if (value) {
      return moment(String(value)).format('MM/DD/YYYY')
    }
  })
  export default {
    components: {
      ForecastOpportunitiesModal,
      SideboxChat,
      FullViewChat,
      KendoTable,
      SiteFooter
    },
    data: () => {
      return {
        search: '',
        dialog: false,
        startmenu: false,
        endmenu: false,
        totalItems: null,
        selectedItem: null,
        loading: true,
        pagination: {
          rowsPerPage: 15
        },
        kendoSchema: [
          { title: 'Date Created', width: '150px', field: 'created', template: (d) => {if(d.created != 'N/A') return `${d.created.split(' ')[0]}`; else return d.created;}},
          { title: 'Award Status', field: 'award_status' },
          { title: 'Estimated Fiscal Year', width: '100px', field: 'estimated_fiscal_year' },
          { title: 'Title', field: 'title', width: '300px', align: 'left'},
          { title: 'Agency', field: 'agency',width: '300px', align: 'left' },
          { title: 'Requirement',width: '250px', field: 'new_requirement'},
          { title: 'Set Aside',width: '200px', field: 'awardee_type' },
          { title: 'NAICS',width: '200px', field: 'naics' },
          { title: 'Minimum Dollar field',width: '200px', field: 'dollar_field_min' },
          { title: 'Point of contact Name',width: '200px', field: 'point_of_contact_name'}

        ],
        url: 'https://fed-exchange-api.herokuapp.com/api/v2.0/forecastfilter?',
        count: 0,
        filters: {
          values: {
            psc: '',
            naics: '',
            search: '',
          }
        }
      }
    },
    watch: {
      pagination (val) {
        let skip = 0
        this.loading = false
        if (val.page > 1) {
          skip = this.count * val.page
        }
        this.$store.dispatch('getForecastOpportunities', { type: 'active', skip, limit: val.rowsPerPage }).then(res => {
          this.totalItems = res.data.total
          this.count = res.data.data.length
          this.loading = false
          return res
        })
      },
      filters: {
        handler (val) {
          
          let query = ''
          var payload = val.values
          let forecastAPI = `https://fed-exchange-api.herokuapp.com/api/v2.0/forecastfilter?`
          if (payload && payload.psc) {
            query += `&psc=${payload.psc}`
          }
          if (payload && payload.naics) {
            query += `&naics=${payload.naics}`
          }
          if (payload && payload.search) {
            query += `&keywords=${payload.search}`
          }

          forecastAPI += query
          this.url = forecastAPI 
          
          var hash = val.values

          this.$store.dispatch('setUrlHash', {base: 'forecastfilter', values: hash})

        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getForecastOpportunities'
      ]),
      saveFilters () {
      },
      moreInfo (item) {
        this.dialog = true
        this.selectedItem = item
      },
      clearFilters () {
        this.filters.values = {
          psc: '',
          naics: '',
          search: '',
        }
      }
    },
    mounted () {
      const payload = {
        meta: {
          'h1': this.$store.getters.getPages.forecastopportunities.header,
          'title': this.$store.getters.getPages.forecastopportunities.header,
          'description': 'Defense Forecast Opportunities',
          'keywords': 'forecast, defense opportunities, department of defense, defense',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
      const self = this
      this.$on('cancel', () => {
        self.dialog = false
      })

    },
    computed: {
      ...mapGetters([
        'getForecastOpportunitiesState'
      ]),
      items () {
        const data = this.getForecastOpportunitiesState.data
        return data
      },
      pages () {
        return this.pagination.rowsPerPage ? Math.ceil(this.items.length / this.pagination.rowsPerPage) : 0
      },
      pageData () {
        return this.$store.getters.getPages
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
</style>

