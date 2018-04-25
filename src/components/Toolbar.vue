<template>
  <div>
    <v-toolbar v-if="this.$store.getters.getUserDetails.uid" class="toolbar" fixed dark flat :style="toolbar_style" height="55px">
      <main-menu></main-menu>
      <img :src="styles.general.logo" style="max-width:200px;max-height:40px;">
      <div class="divider-left mx-3">
      </div>
      <v-layout align-center>
        <v-flex xs12 row wrap align-center>
          <div style="margin-top:10px">
            <div v-if="filteredOptions.length===0">
              <v-select style="margin-top:5px" :filter="customFilter" label="Type to search" max-height="auto" :loading="loading" autocomplete flat :items="searchList" :search-input.sync="search" no-data-text="No matching data found" prepend-icon="fa-search" append-icon='' dense>
                <template slot='item' slot-scope="data">
                  <template>
                    <v-icon class="titleicon" small style="padding-right:10px">{{data.item.icon}}</v-icon>
                    <v-list-tile-content class='titlecontent' v-text="data.item.title"></v-list-tile-content>
                  </template>
                </template>
              </v-select>
            </div>
            <div v-else>
              <v-select style="margin-top:5px" :filter="customFilter" label="Type to search" max-height="auto" :loading="loading" autocomplete flat :items="filteredOptions" :search-input.sync="search" v-model="select" no-data-text="No matching data found" prepend-icon="fa-search" append-icon="" dense>
                <template slot="selection" slot-scope="data">
                  {{data.item.here}}
                </template>
                <template slot='item' slot-scope="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-tile-content class="caption" v-text="data.item"></v-list-tile-content>
                  </template>
                  <template v-else-if="data.item.title">
                    <v-icon>{{data.item.icon}}</v-icon>
                    <v-list-tile-content v-text="data.item.title"></v-list-tile-content>
                  </template>
                  <template v-else-if="data.item.more">
                    <v-icon>fa-search</v-icon>
                    <v-list-tile-content style="padding-left:10px;">
                      <v-list-tile-title class="caption" v-html="data.item.more"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                  <template v-else>
                    <v-icon :small='true' style="padding-right:10px">{{data.item.icon}}</v-icon>
                    <v-list-tile-content style="margin-top:0px">
                      <v-list-tile-title class="caption" v-html="data.item.text"></v-list-tile-title>
                      <v-list-tile-sub-title style="margin-top:-5px" class="caption" v-html="data.item.highlight"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-select>
            </div>
          </div>
        </v-flex>
      </v-layout>
      <v-spacer></v-spacer>
      <v-btn flat small class="menu-tab" :class="{active: isHome}" @click="goTo('/user/feed')">
        <div>
          <v-icon style="font-size:24px;">mdi-home</v-icon>
          <br> Home
        </div>
      </v-btn>
      <v-btn flat small class="menu-tab" :class="{active: isDirectory}" @click="goTo('/contractors')">
        <div>
          <v-icon style="font-size:24px;">fa-address-book</v-icon>
          <br> Directory
        </div>
      </v-btn>

      <v-btn flat small class="menu-tab" :class="{active: isOpportunities}" @click="goTo('/opportunities')">
        <div>
          <v-icon style="font-size:24px;">lightbulb_outline</v-icon>
          <br> Opportunities
        </div>
      </v-btn>

      <v-btn flat small class="menu-tab" :class="{active: isHistory}" @click="goTo('/contract-history')">
        <div>
          <v-icon style="font-size:24px;">query_builder</v-icon>
          <br> History
        </div>
      </v-btn>
      <div class="divider-left">
      </div>
      <toolbar-menu></toolbar-menu>

    </v-toolbar>
    <v-alert :color="alertColor" dismissible v-model="alert" style="position:absolute;top:50px;z-index:2;margin-left:0;width:100%" class="text-xs-center">
      <div v-html="alertMessage"></div>
    </v-alert>
    <opportunities-modal persistent :trigger="dialog" :item="selectedItem" />
    <history-view-modal :dialog="contractDialog" :item="contractItem" />
    <div v-if="directoryDialog">
      <contractor-view-modal :dialog.sync="directoryDialog" :item="directoryItem"></contractor-view-modal>
    </div>
  </div>
</template>

<script>
import ToolbarMenu from "./toolbar-menu/ToolbarMenuComponent.vue";
import MainMenu from "../components/main-menu/MainMenu.vue";
import { VueAutosuggest } from "vue-autosuggest";
import OpportunitiesModal from "../components/modal/info/opportunitiesViewModal.vue";
import HistoryViewModal from "../components/modal/info/historyViewModal.vue";
import ContractorViewModal from "../components/modal/info/contractorViewModal.vue";
import axios from "axios";
import _ from "lodash";
const ENGINE_KEY = "BvAwqPzArXVis3qwg4HQ";

const instance = axios.create({
  baseURL: "https://api.swiftype.com/"
});

import "font-awesome/css/font-awesome.min.css";
import "../assets/css/autosuggest.css";

const searchList = [
  {
    text: "",
    title: "Directory",
    icon: "fa-address-book"
  },
  { divider: true },
  {
    text: "",
    title: "Opportunities",
    icon: "lightbulb_outline"
  },
  { divider: true },
  { text: "", title: "History", icon: "query_builder" }
];

export default {
  components: {
    OpportunitiesModal,
    ToolbarMenu,
    ContractorViewModal,
    HistoryViewModal,
    MainMenu,
    VueAutosuggest
  },
  props: ["title"],
  data() {
    return {
      alert: false,
      alertMessage: "",
      alertColor: "secondary",
      dialog: false,
      loading: false,
      selectedItem: null,
      contractDialog: false,
      contractItem: null,
      directoryDialog: false,
      directoryItem: null,
      search: null,
      select: null,
      selected: null,
      drawer: true,
      searchList,
      customFilter: () => true,
      filteredOptions: [],
      sectionConfigs: {
        default: {
          limit: 3
        }
      }
    };
  },
  computed: {
    client() {
      return this.$store.getters.getClientDetails;
    },
    user() {
      return this.$store.getters.getUserDetails;
    },
    styles() {
      return this.$store.getters.getStyles;
    },
    toolbar_style() {
      return {
        backgroundColor: this.styles.general.theme_color_light
      };
    },
    toolbarAlert() {
      return this.$store.getters.getToolbarAlert;
    },
    isHome() {
      if (this.$route.name === "HomePage") return true;
      else return false;
    },
    isDirectory() {
      if (this.$route.name === "Contractors") return true;
      else return false;
    },
    isHistory() {
      if (this.$route.name === "ContractsHistory") return true;
      else return false;
    },
    isOpportunities() {
      if (this.$route.name === "Opportunities") return true;
      else return false;
    }
  },
  mounted() {
    const self = this;
    this.$on("cancel", () => {
      self.dialog = false;
      self.directoryDialog = false;
      self.contractDialog = false;
      // self.$refs.autoSuggest.searchInput = ''
    });
  },
  watch: {
    toolbarAlert(val) {
      if (val.active) {
        this.alert = true;
        this.alertMessage = val.message;
      } else {
        this.alert = false;
      }
    },
    select(item) {
      if (item.title) {
        return;
      } else if (item.more) {
        this.goTo(item.link);
      }
      if (item.type === "opportunity") {
        let api =
          "https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?take=1&id=" +
          item.id;
        return axios.get(api).then(({ data }) => {
          if (data.data.length > 0) {
            this.dialog = true;
            this.selectedItem = data.data[0];
          }
        });
      } else if (item.type === "history") {
        let api =
          "https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?uniquetransactionid=" +
          item.id;
        return axios.get(api).then(({ data }) => {
          if (data.data.length > 0) {
            this.contractDialog = true;
            this.contractItem = data.data[0];
          }
        });
      } else if (item.type === "directory") {
        let api =
          "https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?take=1&dunsnumber=" +
          item.id;
        return axios.get(api).then(({ data }) => {
          if (data.data.length > 0) {
            this.directoryDialog = true;
            this.directoryItem = data.data[0];
          }
        });
      }
      this.filteredOptions = [];
    },
    search(val) {
      const convertToHighlight = highlight =>
        _.reduce(
          highlight,
          (list, val, key) => {
            let clone = Object.assign([], list);
            clone.push(`${val}`);
            return clone;
          },
          []
        );
      instance
        .get("/api/v1/public/engines/suggest", {
          params: {
            q: val,
            per_page: 3,
            engine_key: ENGINE_KEY
          }
        })
        .then(({ data }) => {
          const { opportunity, history, directory } = data.records;
          let filteredOptions = [];
          // const totalLength = opportunity.length + history.length + directory.length
          if (directory.length > 0) {
            // filteredOptions = filteredOptions.concat({
            //   header: `${val} in Directory`
            // });
            filteredOptions = filteredOptions.concat(
              directory.map(val => ({
                type: "directory",
                value: { id: val.external_id, type: "directory" },
                icon: "fa-address-book",
                text: val.companylegalname,
                highlight: convertToHighlight(val.highlight)[0]
              }))
            );
            filteredOptions.push({
              more: `<p>Search for more <b>${val} </b> in Directory</p>`,
              text: "",
              value: { link: `/contractors#&search=${val}`, more: true }
            });
            filteredOptions.push({ divider: true });
          }
          if (opportunity.length > 0) {
            // filteredOptions = filteredOptions.concat({
            //   header: `${val} in Opportunities`
            // });
            filteredOptions = filteredOptions.concat(
              opportunity.map(val => ({
                value: { id: val.external_id, type: "opportunity" },
                icon: "lightbulb_outline",
                type: "opportunity",
                text: val.solicitationname,
                highlight: convertToHighlight(val.highlight)[0]
              }))
            );

            filteredOptions.push({
              more: `<p>Search for more <b>${val} </b> in Opportunity</p>`,
              text: "",
              value: {
                link: `/opportunities#&search=${val}&type=active`,
                more: true
              }
            });
            filteredOptions.push({ divider: true });
          }
          if (history.length > 0) {
            // filteredOptions = filteredOptions.concat({
            //   header: `${val} in History`
            // });
            filteredOptions = filteredOptions.concat(
              history.map(val => ({
                type: "history",
                value: { id: val.uniquetransactionid, type: "history" },
                icon: "query_builder",
                text: `${val.contractingofficeagencyid} - ${
                  val.majagencycat
                } - ${new Date(val.signeddate).toLocaleDateString()}`,
                highlight: convertToHighlight(val.highlight)[0]
              }))
            );

            filteredOptions.push({
              more: `<p>Search for more <b>${val} </b> in History</p>`,
              text: "",
              value: { link: `/contract-history#&search=${val}`, more: true }
            });
          }

          this.filteredOptions = filteredOptions;
        });
    }
  },
  methods: {
    toggleSidebar() {
      this.$store.commit(
        "toggleSidebar",
        !this.$store.getters.getSidebar.active
      );
    },
    renderSuggestion(suggestion) {
      return suggestion.item.val;
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.val;
    },
    onSelected(item) {},

    goTo(link) {
      this.$router.app.$emit("clearFilter");
      this.$router.push(link);
    }
  }
};
</script>

<style>
.toolbar-icon {
  color: rgb(170, 170, 170);
}

.divider-left {
  border-left: 1px solid #eeeeee; /* Border on the left */
  width: 1px; /* Width instead of height */
  height: inherit;
  opacity: 0.2;
}

.titleicon {
  font-size: 20px;
}
.titlecontent {
  height: 40px;
}
.menu-tab {
  text-transform: capitalize;
  height: inherit;
  line-height: 12px;
  width: 75px;
  font-size: 12px;
  letter-spacing: 0.1em;
  font-weight: 400;
}
.active {
  border-bottom: 4px solid;
  font-weight: 600;
}
.empty-icon {
  background: rgb(170, 170, 170, 0);
}
</style>
