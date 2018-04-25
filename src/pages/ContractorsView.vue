<template>
  <v-container fluid :style="{backgroundColor: styles.general.background_color}">
    <div>
      <feedback-component module="directory"></feedback-component>
      <v-container fluid style="padding-top: 60px;">
        <v-layout row wrap class="ml-5 my-4">
          <v-flex xs12 class="ml-4 mt-2">
            <p style="color:#4a4a4a;font-size:29px;font-weight:bolder;text-justify:auto;" class="page-header">
              Contractor Directory</p>
          </v-flex>

          <v-flex xs12 style="color:#4a4a4a;font-size:18px;font-weight:400;margin:0px;" class="ml-4 page-header">
            <div style="margin-top:-10px;padding-top:0px;">
              <p style="text-justify:auto;line-height:22px;">
                {{ pages.directory.sub_text }}
              </p>
            </div>
          </v-flex>

          <v-flex xs12>
            <v-toolbar flat dense style="padding-bottom:10px" height="30px" color="transparent">
              <v-toolbar-items class="hidden-sm-and-down">
                <v-menu offset-x :close-on-content-click="false" v-model="dateMenu" style="padding-right:10px">
                  <v-btn small :color="filters.values.state || filters.values.zip ? 'indigo' :'black'" outline dark slot="activator">Location
                    <v-icon right>room</v-icon>
                  </v-btn>
                  <v-card>
                    <v-list>

                      <v-container grid-list-xs align-baseline>
                        <v-flex xs12 class="px-2">
                          <v-select label='Location' prepend-icon="room" :items="locationSearch" v-model="location" />
                        </v-flex>

                        <v-flex xs12 v-if="location === 'Zip Code'" class="px-2" align-baseline>
                          <v-text-field prepend-icon="gps_fixed" name="zip-code" label="Zip Code" v-model="zipSearch"></v-text-field>
                        </v-flex>

                        <v-flex xs12 class="px-2" v-if="location=== 'State'">
                          <v-select label='State' prepend-icon="gps_fixed" :items="states" v-model="stateSearch" />
                        </v-flex>
                      </v-container>

                    </v-list>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="dateMenu = false">Cancel</v-btn>
                      <v-btn color="primary" flat @click="applyLocation">Apply</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <multiple-filter icon="list" :list='naicsCodes' id='naics' @apply='applyFilter' label="NAICS" :input="filters.values.naics" />
                <multiple-filter icon="art_track" :list='pscCodes' id='psc' @apply='applyFilter' label="PSC" :input="filters.values.psc" />
                <multiple-filter :all='true' icon="labels" :list='certifications' id='companycertifications' @apply='applyFilter' label="Certifications" :input="filters.values.companycertifications" />
                <v-text-field single-line prepend-icon="search" style="padding-right:10px" label="Search" v-model="filters.values.search"></v-text-field>
                <v-btn class="search-button" @click="clearFilters">
                  Clear Filter
                </v-btn>
                <v-btn :disabled="deactivateSaveButton" class="search-button" @click="openSaveSearchModal">
                  Save Search
                </v-btn>
              </v-toolbar-items>
              <v-spacer></v-spacer>

              <v-btn flat style="text-transform:capitalize;height:100%;" @click.prevent="goTo('/questionnaire')" class="secondary--text">
                <v-icon large>add</v-icon>
                <span style="font-size:19px;">Add Your Company</span>
              </v-btn>
            </v-toolbar>
            <v-flex xs2 class="px-2"></v-flex>

            <v-flex xs2 style="px-2">
            </v-flex>
          </v-flex>

          <v-flex xs12>
            <v-btn class="margin-button" @click="openSavedSearchModal">
              View Saved Searches
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider class="secondary"></v-divider>
        <v-container fluid class="white">
          <v-layout row wrap>
            <v-flex sm12 md6>
              <kendo-table keep-alive :kendo-schema="kendoSchema" @view="moreInfo" ref="kendoTable" @loaded="itemsLoaded" :url="url" @totalRecords="totalRecords" @change="selectRow"></kendo-table>
            </v-flex>

            <v-flex sm12 md6 align-center justify-center column items-center>
              <div id="map" style="height:100%; border:0; width: 100%;position:relative;display:block;">
                <spinner style="position:absolute;top:50%;left:50%;" size="100" :line-size="12"></spinner>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <full-view-chat />
        <div v-if="dialog">
          <contractor-view-modal :dialog.sync="dialog" :item="item" :favorited="favorited"></contractor-view-modal>
        </div>
        <div v-if="searchDialog">
          <save-search-modal :dialog.sync="searchDialog" :searchPayload="searchParameters" type="directory" @closeSaveSearchModal="closeSaveSearchModal"></save-search-modal>
        </div>
        <div v-if="savedSearchDialog">
          <saved-searches-modal :dialog.sync="savedSearchDialog" @closeSavedSearchesModal="closeSavedSearchesModal" @performSearch="performSearch" :savedSearches="savedSearches" pageName="Directory"></saved-searches-modal>
        </div>
      </v-container>
      <!-- <site-footer></site-footer> -->
    </div>
  </v-container>
</template> 
<script>
import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import FullViewChat from '../components/chat/fullviewChat.vue'
import SiteFooter from '../components/SiteFooter.vue'
import KendoTable from '../components/KendoTable'
import ContractorViewModal from '../components/modal/info/contractorViewModal.vue'
import statesData from './states_titlecase.json'
import 'font-awesome/css/font-awesome.min.css'
import Spinner from 'vue-simple-spinner'
import naicsCodes from './constants/NAICSCode.json'
import pscCodes from './constants/PSCCode.json'
import FeedbackComponent from '../components/FeedbackComponent.vue'
import MultipleFilter from '../components/filter/multipleFilter.vue'
import SaveSearchModal from '../components/modal/SaveSearchModal.vue'
import SavedSearchesModal from '../components/modal/SavedSearchesModal'

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBCkHJdW4ChFLJ8cqJghc-LlhVU_FAl5G0'
})

let db = Vue.prototype.$firebase.database()

export default {
  components: {
    FullViewChat,
    KendoTable,
    SiteFooter,
    ContractorViewModal,
    Spinner,
    FeedbackComponent,
    MultipleFilter,
    SaveSearchModal,
    SavedSearchesModal
  },
  data: () => {
    return {
      tablePagination: {
        rowsPerPage: 25
      },
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

      locationSearch: ['All', 'State', 'Zip Code'].map(value => ({
        text: value,
        value
      })),
      link:
        'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?userstate=GA',
      search: '',
      dialog: false,
      recordsCount: 0,
      totalItems: 0,
      states: statesData,
      selectedRow: '',
      item: null,
      markers: [],
      num: 0,
      company: '',
      count: 0,
      loading: true,
      mapLocations: [],
      h1: 'Defense Contractors Directory',
      stateSearch: '',
      dateMenu: false,
      zipSearch: '',
      certifications: [
        { text: 'Competitive 8(a)', value: '8A Firm' },
        { text: 'Veteran-Owned Small Business', value: 'Veteran Owned' },
        {
          text: 'Service-Disabled Veteran-Owned Small Business',
          value: 'Service-Related Disabled Veteran Owned'
        },
        { text: 'Woman Owned Small Business', value: 'Woman Owned' },
        {
          text: 'Economically Disadvantaged Woman Owned Small Business',
          value: 'Economically Disadvantaged Woman Owned'
        },
        { text: 'Minority Owned', value: 'Minority Owned' },
        {
          text: 'Small Disadvantaged Business',
          value: 'Small Disadvantaged Business'
        },
        { text: 'HUBZone', value: 'HUBZone' }
      ].map(value => ({ text: '', value })),
      kendoSchema: [
        {
          title: 'Company',
          field: 'companylegalname',
          editable: false,
          template: dataItem =>
            dataItem.stateflag
              ? `<img style="width:25px;" class="px-1" src="${
                  dataItem.stateflag
                }"/>${dataItem.companylegalname}`
              : dataItem.companylegalname
        },
        { title: 'Address', field: 'streetaddress', editable: false },
        {
          title: 'SBA Certifications',
          field: 'companycertifications',
          editable: false
        }
      ],
      map: {},
      filters: {
        values: {
          search: '',
          naics: '',
          psc: '',
          state: '',
          zip: '',
          county: '',
          companycertifications: ''
        }
      },
      location: 'all',
      infoWindow: {},
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
      favorites: db.ref('favorites/directory'),
      savedDirectories: db.ref('saved_searches/directory')
    }
  },
  methods: {
    clearFilters () {
      this.filters = {
        values: {
          search: '',
          naics: [],
          psc: [],
          state: '',
          zip: '',
          county: '',

          companycertifications: ''
        }
      }
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
    applyLocation () {
      this.filters.values.state = this.stateSearch
      this.filters.values.zip = this.zipSearch
      this.dateMenu = false
    },
    applyFilter ({ id, filter }) {
      this.usedSavedSearch = false
      this.filters.values[id] = filter
    },
    fetchCompany (id) {
      var self = this
      let api =
        'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?take=1&id=' +
        id.split('=')[1]
      return axios.get(api).then(res => {
        if (res.data.total > 0) self.moreInfo(res.data.data[0]);
      })
    },
    selectRow (e) {
      this.selectedRow = e
    },
    geocode (address, cb) {
      return googleMapsClient.geocode(
        {
          address
        },
        cb
      )
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
      this.mapLocations = []
    },
    moreInfo (val) {
      let userId = this.$store.getters.getUserDetails.uid
      this.dialog = true
      this.item = val
      const self = this
      this.$firebaseRefs.favorites
        .child(`/${userId}/${this.item._id}`)
        .on('value', function (result) {
          if (result.val()) {
            self.favorited = true
          } else {
            self.favorited = false
          }
        })
    },
    fetchSavedSearches() {
      let userId = this.$store.getters.getUserDetails.uid
      const self = this
      this.$firebaseRefs.savedDirectories
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
    itemsLoaded (val) {
      this.removeMarkers()
      this.items = val
      this.markMap()
    },
    markMap () {
      this.infoWindow = new window.google.maps.InfoWindow()
      var self = this
      var val = this.items
      this.mapLocations = val
      if (val.length === 0) return
      let marker
      if (!this.mapLocations && this.mapLocations.length <= 0) return
      let index
      for (let i = 0; i < this.mapLocations.length; i++) {
        if (this.mapLocations[i].latitude && this.mapLocations[i].longitude) {
          index = i
          break
        }
      }
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: new window.google.maps.LatLng(
          self.mapLocations[index].latitude || 33.748995,
          self.mapLocations[index].longitude || -84.387982
        ),
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      })

      var bounds = new window.google.maps.LatLngBounds()
      for (var i in this.items) {
        var location = this.mapLocations[i]
        marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(
            location.latitude,
            location.longitude
          ),
          map: self.map
        })
        this.markers.push(marker)
        var loc = new window.google.maps.LatLng(
          marker.position.lat(),
          marker.position.lng()
        )
        marker.setMap(self.map)
        bounds.extend(loc)
        self.map.fitBounds(bounds)
        self.map.setCenter(bounds.getCenter())

        window.google.maps.event.addListener(
          marker,
          'click',
          ((marker, i, val) => {
            return () => {
              const desc = `
                <div class="text-xs-center">
                  
                  <img class="grey lighten-4 px-2 py-2 bordered-image" style="border: 2px solid #000;border-radius:10px;border-color:#000;border-style:solid;border-width:2px;" src="${val[i].companylogo ||
                    '/static/images/business-icon.png'}" height="50px"  />
                  <br>
                  <span class="primary--text mx-3"><b>${
                    val[i].companylegalname
                  }</b></span>
                  <p>${val[i].streetaddress}</p>
                </div>
              `
              self.infoWindow.setContent(desc)
              self.infoWindow.open(self.map, marker)
            }
          })(marker, i, val)
        )
      }
    },
    loadMarkers () {
      const self = this
      this.removeMarkers()

      return Promise.all(
        this.items.map(
          (val, i) =>
            new Promise(resolve => {
              if (val && val.streetaddress && val.streetaddress !== '') {
                this.geocode(val.streetaddress, (err, res) => {
                  if (err) {
                    resolve({
                      lat: null,
                      lng: null
                    })
                  } else {
                    try {
                      const location = res.json.results[0].geometry.location
                      resolve(location)
                    } catch (e) {
                      resolve({
                        lat: null,
                        lng: null
                      })
                    }
                  }
                })
              } else {
                resolve({
                  lat: null,
                  lng: null
                })
              }
            })
        )
      ).then(locations => {
        self.mapLocations = locations
        self.markMap()
      })

      // for (i = 0; i < val.length; i++) {

      /*
        var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        */
      // this.markers.push(marker)

      /*
          marker.setMap(self.map)
          bounds.extend(loc);
          self.map.fitBounds(bounds);
          self.map.setCenter(bounds.getCenter());
          map.panToBounds(bounds);
          self.map.setZoom(self.map.getZoom()-1);

          return window.google.maps.event.addListener(marker, 'click', ((marker, num, val) => {
            return () => {
              const desc = `
                <div class="text-xs-center">

                  <img class="grey lighten-4 px-2 py-2 bordered-image" style="border: 2px solid #000;border-radius:10px;border-color:#000;border-style:solid;border-width:2px;" src="${val[num].companylogo || '/static/images/business-icon.png'}" height="50px"  />
                  <br>
                  <span class="primary--text mx-3"><b>${val[num].companylegalname}</b></span>
                  <p>${val[num].streetaddress}</p>
                </div>
              `
              self.infoWindow.setContent(desc)
              self.infoWindow.open(self.map, marker)
            }
          })(marker, num, val))
        });
       }
      */
    }
  },
  watch: {
    location (val) {
      this.filters.values.state = ''
      this.filters.values.zip = ''
    },
    filters: {
      handler (val) {
        let query = ''
        var payload = val.values
        this.items = []
        let contractorsAPI = `https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?userstate=GA`
        if (payload.search.length) {
          const search = payload.search.replace(/ /g, '%20')

          query += `&companylegalname=${search}`
        }
        if (payload && payload.psc && payload.psc.length > 0) {
          query += `&primarypsccode=${payload.psc.join('.')}`
        }
        if (payload && payload.naics && payload.naics.length > 0) {
          query += `&primarynaicscode=${payload.naics.join('.')}`
        }
        if (
          payload &&
          this.location &&
          this.location === 'State' &&
          payload.state &&
          payload.state !== ''
        ) {
          query += `&state=${payload.state}`
        } else if (
          payload &&
          this.location &&
          this.location === 'Zip Code' &&
          payload.zip
        ) {
          query += `&zip=${payload.zip}`
        } else if (
          payload &&
          this.location &&
          this.location === 'county' &&
          payload.zip
        ) {
          query += `&country=${payload.county}`
        } else if (this.location === 'all' && this.state) {
          query += `&state=${this.state}`
        }

        if (
          payload &&
          payload.companycertifications &&
          payload.companycertifications !== ''
        ) {
          query += `&companycertifications=${payload.companycertifications.join(
            '.'
          )}`
        }

        contractorsAPI += query
        this.link = contractorsAPI

        var hash = val.values

        this.$store.dispatch('setUrlHash', {
          base: 'contractors',
          values: hash
        })
      },
      deep: true
    },
    state (val) {
      var query = this.link
      if (val && this.location !== 'state') {
        this.items = []
        this.removeMarkers()
        query += `&userstate=${this.state}`
      }
      this.url = query
    }
  },
  computed: {
    pages () {
      return this.$store.getters.getPages
    },
    styles () {
      return this.$store.getters.getStyles
    },
    user () {
      return this.$store.getters.getUserDetails
    },
    state () {
      if (this.$store.getters.getCompanyDetails) { return this.$store.getters.getCompanyDetails.state }
    },
    url: {
      get () {
        return this.link
      },
      set (newValue) {
        this.link = newValue
      }
    },
    deactivateSaveButton(){
      let emptyFilter = Object.keys(this.filters.values).every((filter) => {
        return this.filters.values[filter] === ''
      })
      return emptyFilter || this.usedSavedSearch
    }
  },
  mounted () {
    var id = window.location.hash.substring(1)
    if (id) {
      this.fetchCompany(id)
    }

    const payload = {
      meta: {
        h1: this.$store.getters.getPages.directory.header,
        title: this.$store.getters.getPages.directory.header,
        description: 'Defense contractors directory',
        keywords:
          'contractors, contractors directory, directory, defense contractors',
        requiresAuth: true
      }
    }

    document.title = payload.meta.title
    var self = this
    this.$router.app.$on('clearFilter', () => {
      this.filters = {
        values: {
          search: '',
          naics: [],
          psc: [],
          state: '',
          zip: '',
          county: '',
          companycertifications: ''
        }
      }
    })
    this.$on('cancel', () => {
      self.dialog = false
      this.$refs.kendoTable.deselectRow(self.selectedRow)
    })
    this.fetchSavedSearches()
  },
  updated () {}
}
</script>
<style scoped>
.k-pager-wrap .k-pager-info {
  display: none;
}
.text-uppercase .input-group__input input {
  text-transform: uppercase !important;
}
.new-green {
  background: #64d085;
}
.input-group__details:before {
  top: 0;

  width: 100%;
  z-index: 0;
}
.input-group__selections__comma {
  color: #fff;
}
#map {
  height: 100%;
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
#kendoGrid {
  max-width: 100%;
}
.bordered-image {
  border: 1px solid black;
}
.filterLabel {
  font-size: 12pt;
  min-height: 20px;
  line-height: 1.471;
  margin-bottom: 0px;
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
.search-button {
  margin: 0 5px;
}
.margin-button {
  margin-left: 16px
}
</style>
 