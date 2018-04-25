<template>
  <div>
    <feedback-component module="opportunities"></feedback-component>
    <v-container fluid style="padding-top: 60px;" :style="{backgroundColor: styles.general.background_color}">
      <v-layout row wrap class="ml-5 my-4">
        <v-flex xs12 class="ml-4 mt-2">
          <p style="color:#4a4a4a;font-size:29px;font-weight:bolder;text-justify:auto;" class="page-header">
            Contract Opportunities</p>
        </v-flex>
        <v-flex xs12 style="color:#4a4a4a;font-size:18px;font-weight:400;margin:0px;" class="ml-4 page-header">
          <div style="margin-top:-10px;padding-top:0px;">
            <p style="text-justify:auto;">
              {{ pageData.opportunities.sub_text }}
            </p>
          </div>
        </v-flex>

        <v-flex xs12>
          <v-toolbar flat dense style="padding-bottom:10px" height="30px" color="transparent">
            <v-toolbar-items class="hidden-sm-and-down">
              <multiple-filter :all="true" icon="account_balance" :list='agencyList' id='agency' @apply='applyFilter' label="Agency" :input="filters.values.agency" />
              <multiple-filter icon="list" :list='naicsCodes' id='naics' @apply='applyFilter' label="NAICS" :input="filters.values.naics" />
              <multiple-filter icon="art_track" :list='pscCodes' id='psc' @apply='applyFilter' label="PSC" :input="filters.values.psc" />

              <v-menu offset-x :close-on-content-click="false" v-model="dateMenu" style="padding-right:10px">
                <v-btn small :color="filters.values.startdate || filters.values.enddate ? 'indigo':'black'" outline dark slot="activator">Dates
                  <v-icon right>date_range</v-icon>

                </v-btn>
                <v-card>
                  <v-list>
                    <v-list-tile>
                      <v-menu lazy v-model="startDateMenu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px">
                        <v-layout slot="activator" style="font-weight:400;height:100%;" column>
                          <v-text-field prepend-icon="date_range" name="zip-code" label="Start Date" v-model="start"></v-text-field>
                        </v-layout>
                        <v-date-picker v-model="start" no-title scrollable>
                        </v-date-picker>
                      </v-menu>
                    </v-list-tile>
                    <v-list-tile>
                      <v-menu lazy v-model="endDateMenu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px">
                        <v-layout slot="activator" style="font-weight:400;" column>
                          <v-text-field prepend-icon="date_range" name="zip-code" label="End Date" v-model="end"></v-text-field>
                        </v-layout>
                        <v-date-picker v-model="end" no-title scrollable>
                        </v-date-picker>
                      </v-menu>
                    </v-list-tile>
                  </v-list>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dateMenu = false">Cancel</v-btn>
                    <v-btn color="primary" flat @click="applyDate">Apply</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>

              <multiple-filter :all="true" icon="class" :list='noticetypes' id='noticetype' @apply='applyFilter' label="Notice Type" :input="filters.values.noticetype" />
              <multiple-filter :all="true" icon="flag" :list='setAsides' id='setaside' @apply='applyFilter' label="Set Aside" :input="filters.values.setaside" />
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

      <v-container fluid class="white">
        <v-card>
          <v-layout row>
            <v-flex md12>
              <kendo-table :kendo-schema="kendoSchema" ref="kendoTable" @change="selectRow" @view="moreInfo" :url="url"></kendo-table>
            </v-flex>
          </v-layout>
        </v-card>
      </v-container>
      <!-- <sidebox-chat /> -->
      <full-view-chat />
      <div v-if="dialog">
        <opportunities-modal persistent :trigger.sync="dialog" :item="selectedItem" :tracked="tracked" />
      </div>
      <div v-if="searchDialog">
        <save-search-modal :dialog.sync="searchDialog" :searchPayload="searchParameters" type="opportunities" @closeSaveSearchModal="closeSaveSearchModal"></save-search-modal>
      </div>
      <div v-if="savedSearchDialog">
        <saved-searches-modal :dialog.sync="savedSearchDialog" @closeSavedSearchesModal="closeSavedSearchesModal" @performSearch="performSearch" :savedSearches="savedSearches" pageName="Opportunities"></saved-searches-modal>
      </div>
    </v-container>
    <!-- <site-footer></site-footer> -->
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import agencyList from "./constants/AgencyOpp.json";
import naicsCodes from "./constants/NAICSCode.json";
import { mapActions, mapGetters } from "vuex";
import SideboxChat from "../components/chat/sideboxChat.vue";
import FullViewChat from "../components/chat/fullviewChat.vue";
import _ from "lodash";
import MultipleFilter from "../components/filter/multipleFilter.vue";
import OpportunitiesModal from "../components/modal/info/opportunitiesViewModal.vue";
import KendoTable from "../components/KendoTable.vue";
import SiteFooter from "../components/SiteFooter.vue";
import FindContractorsModal from "../components/modal/findContractorModal.vue";
import pscCodes from "./constants/PSCCode.json";
import FeedbackComponent from "../components/FeedbackComponent.vue";
import SaveSearchModal from '../components/modal/SaveSearchModal.vue'
import SavedSearchesModal from '../components/modal/SavedSearchesModal'

let db = Vue.prototype.$firebase.database();

export default {
  components: {
    OpportunitiesModal,
    SideboxChat,
    MultipleFilter,
    FullViewChat,
    SiteFooter,
    KendoTable,
    FindContractorsModal,
    FeedbackComponent,
    SaveSearchModal,
    SavedSearchesModal
  },
  created() {},
  data: () => {
    return {
      search: "",
      url:
        "https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?type=active",
      dialog: false,
      findDialog: false,
      selectedRow: "",
      listDialog: false,
      startmenu: false,
      endmenu: false,
      totalItems: null,
      selectedItem: null,
      startDateMenu: false,
      endDateMenu: false,
      loading: true,
      agencyList: agencyList.map(val => ({
        text: ``,
        value: {
          value: val.agency,
          text: val.agency
        }
      })),
      setAsides: [
        "Total Small Business",
        "Competitive 8(a)",
        "Veteran-Owned Small Business",
        "Woman Owned Small Business",
        "Economically Disadvantaged Woman Owned Small Business",
        "Indian Small Business Economic Enterprises",
        "Indian Economic Enterprises",
        "Emerging Small Business",
        "Partial Small Business",
        "Very Small Business"
      ].map(value => ({
        text: value,
        value: {
          value,
          text: value
        }
      })),

      noticetypes: [
        {
          text: "Combined Synopsis/Solicitation",
          value: "combinedsynopsisandsolicitation"
        },
        { value: "presolicitation", text: "Presolicitation" },
        { value: "solicitation", text: "Solicitation" },
        { value: "sourcessought", text: "Sources Sought" }
      ].map(value => ({
        text: "",
        value: {
          text: value.text,
          value: value.value
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
      findContractorItem: "",
      findContractorValue: "",
      pagination: {
        rowsPerPage: 25
      },
      heading: "Department of Defense Contract History",

      kendoSchema: [
        {
          field: "posteddate",
          title: "Posted Date",
          editable: false,
          format: "{0:MM/dd/yyyy}",
          width: 150
        },
        {
          field: "responsedate",
          title: "Response Date",
          width: 250
        },
        {
          field: "solicitationname",
          title: "Title",
          editable: false,
          width: 250
        },
        { field: "agency", title: "Agency", editable: false, width: 250 },
        {
          field: "noticetype",
          title: "Notice Type",
          editable: false,
          width: 250
        },
        {
          field: "naicscodedescription",
          title: "NAICS Code Description",
          width: 250
        },
        {
          field: "classificationcodedescription",
          title: "Classification Code Description",
          width: 250
        },
        { field: "setaside", title: "Set Aside", editable: false, width: 250 },
        {
          field: "primarypointofcontact",
          title: "Point of Contact",
          width: 250
        },
        {
          field: "naicscode",
          title: "NAICS Code",
          editable: false,
          type: "number",
          hidden: true,
          width: 250
        },
        {
          field: "solicitationsource",
          title: "Solicitation Source",
          hidden: true,
          width: 250
        },
        {
          field: "primarypointofcontactemail",
          title: "Primary Point of Contact Email",
          hidden: true,
          width: 250
        },
        { field: "created_at", title: "Created At", hidden: true, width: 250 },
        {
          field: "officeaddressstate",
          title: "Office Address State",
          hidden: true,
          width: 250
        },
        {
          field: "originalresponsedate",
          title: "Original Response Date",
          hidden: true,
          format: "{0:MM-dd-yyyy}",
          width: 250
        },
        { field: "synopsis", title: "Synopsis", hidden: true, width: 250 },
        {
          field: "attachmentslinks",
          title: "Attachments Links",
          hidden: true,
          width: 250
        },
        { field: "location", title: "Location", hidden: true, width: 250 },
        {
          field: "contractingofficeaddress",
          title: "Contracting Office Address",
          hidden: true,
          width: 250
        },
        {
          field: "secondarypointofcontactemail",
          title: "Secondary Point of Contact Email",
          hidden: true,
          width: 250
        },
        {
          field: "solicitationlink",
          title: "Solicitation Link",
          hidden: true,
          width: 250
        },
        {
          field: "psccodedescription",
          title: "PSC Description",
          hidden: true,
          width: 250
        },
        {
          field: "officeaddresszip",
          title: "Office Address Zip",
          hidden: true,
          width: 250
        },

        { field: "agency", title: "Agency", hidden: true, width: 250 },
        {
          field: "fsccodedescription",
          title: "FSC Code Description",
          hidden: true,
          width: 250
        },
        {
          field: "solicitationnumber",
          title: "Solicitation Number",
          hidden: true,
          width: 250
        },
        {
          field: "secondarypointofcontact",
          title: "Secondary Point of Contact",
          hidden: true,
          width: 250
        },
        {
          field: "placeofperformance",
          title: "Place of Performance",
          hidden: true,
          width: 250
        },
        { field: "fsccode", title: "FSC Code", hidden: true, width: 250 },
        { field: "fsccode", title: "ID", hidden: true, width: 250 },
        {
          field: "primarypointofcontactphonenum",
          title: "Primary Point of Contact Phone Number",
          hidden: true,
          width: 300
        },
        {
          field: "pointofcontactname",
          title: "Point of Contact Name",
          hidden: true,
          width: 250
        },
        {
          field: "officeaddresscity",
          title: "Office Address City",
          hidden: true,
          width: 250
        },
        {
          field: "secondarypointofcontactphonenum",
          title: "Secondary Point of Contact Phone Number",
          hidden: true,
          width: 250
        },
        {
          field: "originalposteddate",
          title: "Original Posted Date ID",
          hidden: true,
          width: 250
        },

        { field: "psccode", title: "PSC Code", width: 250, hidden: true }
      ],
      dateMenu: false,
      count: 0,
      start: null,
      end: null,
      filters: {
        values: {
          startdate: "",
          enddate: "",
          psc: "",
          naics: "",
          search: "",
          noticetype: "",
          type: "active",
          agency: "",
          setaside: ""
        }
      },
      tracked: false,
      searchDialog: false,
      searchParameters: {},
      savedSearchDialog: false,
      savedSearches: [],
      usedSavedSearch: false
    };
  },
  firebase() {
    return {
      opportunities: db.ref("tracking/opportunities"),
      savedOpportunities: db.ref('saved_searches/opportunities')
    };
  },
  watch: {
    pagination(val) {
      let skip = 0;
      this.loading = true;
      if (val.page > 1) {
        skip = this.count * val.page;
      }
      this.$store
        .dispatch("getOpportunities", {
          type: "active",
          skip,
          limit: val.rowsPerPage
        })
        .then(res => {
          this.totalItems = res.data.total;
          this.count = res.data.data.length;
          this.loading = false;
          return res;
        });
    },
    filters: {
      handler(val) {
        var query =
          "https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?";
        var payload = val.values;
        if (payload && payload.type) {
          query += `&type=${payload.type}`;
        }
        if (payload && payload.psc && payload.psc.length > 0) {
          query += `&psc=${payload.psc.join(".")}`;
        }
        if (payload && payload.naics && payload.naics.length > 0) {
          query += `&naics=${payload.naics.join(".")}`;
        }
        if (payload && payload.startdate && payload.enddate) {
          query += `&daterange=${payload.startdate}to${payload.enddate}`;
        }
        if (payload && payload.search) {
          query += `&keywords=${payload.search}`;
        }
        if (
          payload &&
          payload.noticetype &&
          payload.noticetype != "" &&
          payload.noticetype.length > 0
        ) {
          query += `&noticetype=${payload.noticetype.join(".")}`;
        }
        if (
          payload &&
          payload.agency &&
          payload.agency != "" &&
          payload.agency.length > 0
        ) {
          query += "&agency=" + payload.agency.join(".");
        }
        if (payload && payload.setaside && payload.setaside != "") {
          query += "&setaside=" + payload.setaside.join(".");
        }
        query = encodeURI(query);
        this.url = query;
        this.$store.dispatch("setUrlHash", {
          base: "opportunities",
          values: val.values
        });
      },
      deep: true
    }
  },
  methods: {
    applyDate() {
      this.filters.values.startdate = this.start;
      this.filters.values.enddate = this.end;
      this.dateMenu = false;
    },
    applyFilter({ id, filter }) {
      this.filters.values[id] = filter;
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
    fetchOpportunity(id) {
      var self = this;
      let api =
        "https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?take=1&id=" +
        id.split("=")[1];
      return axios.get(api).then(res => {
        if (res.data.total > 0) self.moreInfo(res.data.data[0]);
      });
    },
    ...mapActions(["getOpportunities"]),
    selectRow(e) {
      this.selectedRow = e;
    },
    saveFilters() {
      this.$firebase
        .database()
        .ref(
          `filters/activeopportunities/${
            this.$store.getters.getUserDetails.uid
          }`
        )
        .set(this.filters);
    },
    moreInfo(item) {
      this.selectedItem = item;
      let userId = this.$store.getters.getUserDetails.uid;
      this.dialog = true;
      const self = this;
      this.$firebaseRefs.opportunities
        .child(`/${userId}/${this.selectedItem.id}`)
        .on("value", function(result) {
          if (result.val()) {
            self.tracked = true;
          } else {
            self.tracked = false;
          }
        });
    },
    clearFilters() {
      this.filters.values = {
        startdate: null,
        enddate: null,
        psc: [],
        naics: [],
        search: "",
        type: "active",
        noticetype: [],
        agency: [],
        setaside: []
      };
    },
    fetchSavedSearches() {
      let userId = this.$store.getters.getUserDetails.uid
      const self = this
      this.$firebaseRefs.savedOpportunities
        .child(`/${userId}`)
        .on('value', function (result) {
          if (result.val()) {
            self.savedSearches = Object.keys(result.val()).map((item) => {
              const savedObject = result.val()[item]
              savedObject.id = item
              return savedObject;
            })
            self.savedSearches.sort((item1, item2) => item2.dateCreated - item1.dateCreated)
            
            console.log(self.savedSearches, 'Results')
          } else {
            self.savedSearches = []
          }
        })
    },
  },
  mounted() {
    var id = window.location.hash.substring(1);
    if (id) {
      this.fetchOpportunity(id);
    }
    const payload = {
      meta: {
        h1: this.$store.getters.getPages.opportunities.header,
        title: this.$store.getters.getPages.opportunities.header,
        description:
          "Search active Department of Defense solicitations by utilizing the Active Contract Opportunities Module. Use the functionality n this module to stratergize, connect, and colaborate with other contractors to pursue specefic contract opportunities",
        keywords:
          "opportunities, defense opportunities, department of defense, defense",
        requiresAuth: true
      }
    };
    document.title = payload.meta.title;
    this.$store.commit("setHeaderInfo", payload);
    const self = this;
    this.$router.app.$on("clearFilter", () => {
      this.clearFilters();
    });
    this.$on("cancel", () => {
      self.dialog = false;
      self.findDialog = false;
      self.listDialog = false;
      this.$refs.kendoTable.deselectRow(self.selectedRow);
    });

    this.getOpportunities({ type: "active" }).then(res => {
      this.totalItems = res.data.total;
      this.count = res.data.data.length;
      this.loading = false;
      return res;
    });
    // this.$firebase.database().ref(`filters/activeopportunities/${this.$store.getters.getUserDetails.uid}`).once('value')
    //   .then(snapshot => {
    //     const filter = snapshot.val()
    //     if (filter.values) {
    //       this.filters = filter
    //     }
    //   })
    this.fetchSavedSearches()
  },
  computed: {
    ...mapGetters(["getOpportunitiesState"]),
    items() {
      const data = this.getOpportunitiesState.data;
      return data;
    },
    pages() {
      return this.pagination.rowsPerPage
        ? Math.ceil(this.items.length / this.pagination.rowsPerPage)
        : 0;
    },
    styles() {
      return this.$store.getters.getStyles;
    },
    pageData() {
      return this.$store.getters.getPages;
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
};
</script>
<style>
.postdate-width {
  width: 120px !important;
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
.filterLabel {
  font-size: 12pt;
  min-height: 20px;
  line-height: 1.471;
  margin-bottom: 0px;
}
.text-white {
  color: #fff !important;
}
.bg-white {
  background: #fff !important;
}
.textLeft {
  padding-left: 10px !important;
}
th.column.text-xs-center {
  text-align: left !important;
  padding-left: 0px !important;
  font-size: 12px;
}
p .page-header {
  text-align: justify;
  text-justify: inter-word;
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
