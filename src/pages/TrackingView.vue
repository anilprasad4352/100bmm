<template>
  <div>
    <feedback-component module="tracking"></feedback-component>
    <v-container fluid style="padding-top: 60px;" :style="{backgroundColor: styles.general.background_color}">
      <v-layout row wrap style="margin-bottom: 30px;" class="mx-5">
        <v-flex xs12 class="ml-4 mt-2">
          <h2 style="color:#4a4a4a;font-size:29px;font-weight:bolder;text-justify:auto;" class="page-header">{{ pages.tracking.header }}</h2>
        </v-flex>

        <v-flex xs12 style="color:#4a4a4a;font-size:18px;font-weight:400;margin:0px;" class="ml-4 page-header">
          <div style="margin-top:-10px;padding-top:0px;">
            <p style="text-justify:auto;line-height:22px;">
              {{ pages.tracking.sub_text }}
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
            <v-tab href="#tab-1" class="mx-2">
              <div style="text-transform:capitalize;font-size:16px;" >
                <v-icon medium>alarm_add</v-icon>
                Opportunities ({{ opportunities.length }})
              </div>
            </v-tab>
            <v-tab-item id="tab-1">
              <v-card-text>
                <v-layout column wrap style="height:100%;">
                  <v-flex v-if="opportunities.length > 0" sm12 md12>
                    <kendo-table :kendo-schema="opportunitiesSchema" @view="moreInfo" ref="kendoTable" @loaded="itemsLoaded" :url="opportunitiesUrl" @totalRecords="totalRecords" @change="selectRow"></kendo-table>
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
      <opportunities-modal persistent :trigger="dialog" :item="item" :tracked="tracked"/>
    </div>
  </div>
</template>

<script>
  import FeedbackComponent from '../components/FeedbackComponent.vue'
  import KendoTable from "../components/KendoTable"
  import Vue from 'vue'
  import axios from "axios"
  import SiteFooter from "../components/SiteFooter.vue"
  import OpportunitiesModal from "../components/modal/info/opportunitiesViewModal.vue";
  import "font-awesome/css/font-awesome.min.css"
  import MoonLoader from "vue-spinner/src/PulseLoader.vue"
  import Spinner from "vue-simple-spinner"

  let db = Vue.prototype.$firebase.database()

  export default {
    components: {
      FeedbackComponent,
      KendoTable,
      OpportunitiesModal,
      SiteFooter
    },
    data() {
      return {
        favoritedItems: [],
        link: "https://fed-exchange-api.herokuapp.com/api/v2.0/",
        dialog: false,
        recordsCount: 0,
        totalItems: 0,
        selectedRow: "",
        item: null,
        count: 0,
        opportunities: [],
        loading: true,
        opportunitiesSchema: [
          {
            field: "posteddate",
            title: "Posted Date",
            editable: false,
            format: "{0:MM/dd/yyyy}"
          },
          {
            field: "solicitationname",
            title: "Title",
            editable: false
          },
          { field: "agency",
            title: "Agency",
            editable: false
          },
          {
            field: "noticetype",
            title: "Notice Type",
            editable: false
          },
          {
            field: "naicscodedescription",
            title: "NAICS Code Description"
          },
          {
            field: "classificationcodedescription",
            title: "Classification Code Description"
          },
        ],
        tracked: true,
        opportunitiesUrl: '',
      }
    },
    firebase() {
      return {
        opportunities: db.ref('tracking/opportunities'),
      }
    },
    computed: {
      pages() {
        return this.$store.getters.getPages;
      },
      styles() {
        return this.$store.getters.getStyles;
      },
      state() {
        if (this.$store.getters.getCompanyDetails)
          return this.$store.getters.getCompanyDetails.state;
      }
    },
    mounted() {
      const payload = {
        meta: {
          'h1': 'Tracking',
          'title': 'Tracking',
          'description': 'Tracked Items Page',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)

      let userId = this.$store.getters.getUserDetails.uid
      let self = this
      this.$firebaseRefs.opportunities.child(`/${userId}`).once('value', function(result) {
        if (result.val()) {
          self.loading = false
          self.opportunities = Object.keys(result.val())
          self.opportunitiesUrl = self.link + `solicitationfilter?id=${self.opportunities.join('.')}`
        } else {
          self.loading = false;
        }
      })

      this.$on("cancel", () => {
        self.dialog = false;
        this.$refs.kendoTable.deselectRow(self.selectedRow);
      });
    },
    methods: {
      selectRow(e) {
        this.selectedRow = e;
      },
      totalRecords(val) {
        this.recordsCount = val;
      },
      moreInfo(val) {
        let userId = this.$store.getters.getUserDetails.uid
        this.dialog = true;
        this.item = val;
        const self = this
        this.$firebaseRefs.opportunities.child(`/${userId}/${this.item.id}`).on('value', function(result) {
          if (result.val()) {
            self.tracked = true
          } else {
            self.tracked = false
          }
        })
      },
      itemsLoaded(val) {
        // this.removeMarkers();
        this.items = val;
        // this.loadMarkers();
      },
    }
  }
</script>

<style>
</style>
