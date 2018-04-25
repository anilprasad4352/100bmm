<template>
  <span>
    <v-navigation-drawer
      v-model="isActive"
      :mini-variant="isMini"
      class="nav-top"
      style="margin-top:64px"
      dark
      overflow
      fixed
      persistent
      height="100%"
      enable-resize-watcher
      disable-route-watcher
    >
      <v-list class="pa-0 py-3">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img :src="site_settings.styles.general.logo" class="sidemenulogo" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ userFullName }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="isMini = !isMini">
              <v-icon dark>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list dense>
        <v-divider></v-divider>
        <v-list-tile v-if="!item.admin" @click.prevent="item && item.link ? goTo(item.link) : item.click()" v-for="item in items" :key="item.title" class="text-xs-center">
            <v-list-tile-action>
              <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title style="font-weight: 700;">{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="item.admin && userRole === 1" @click="goTo(item.link)" v-for="item in items" :key="item.title" class="text-xs-center">
            <v-list-tile-action>
              <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title style="font-weight: 700;">{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="isMini && !this.$store.getters.getInitializing">
          <v-list-tile-action>
            <v-btn icon @click.native.stop="isMini = !isMini">
              <v-icon dark>chevron_right</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
       <OthersSideBarMenu />
    </v-navigation-drawer>
    <!-- <full-view-chat /> -->
  </span>
</template>

<script>
import 'mdi/css/materialdesignicons.min.css'
import OthersSideBarMenu from './OthersMenuComponent.vue'

export default {
  components: {
    OthersSideBarMenu
  },
  props: ['drawer'],
  data () {
    const self = this
    return {
      logo: this.$store.getters.getCompanyDetails.avatar,
      items: [
        {title: 'Home', icon: 'home', link: '/user/feed'},
        { title: 'Site Administration', icon: 'mdi-settings', link: '/admin/settings/home', admin: true },        
        {title: 'Groups', icon: 'mdi-comment-text', link: '/groups'},
        {title: 'Contractor Directory', icon: 'reorder', link: '/contractors'},
        {title: 'Active Opportunities', icon: 'announcement', link: '/opportunities'},
        {title: 'Contract History', icon: 'history', link: '/contract-history'},
        {title: 'Company Questionnaire', icon: 'mdi-format-list-checks', link: '/questionnaire'},
        {title: 'Impact Analysis', icon: '', link: '/'},
        {title: 'Data Explorer', icon: '', link: '/'}
      ], 
      user: null,
      mini: false,
      dark: true,
      right: null,
      clipped: false,
      usercompanyLogo: this.$store.getters.getCompanyDetails.companylogo
    }
  },
  methods: {
    goTo (link) {
      this.$router.push(link)
    }
  },
  computed: {
    userProfilePicture () {
      return this.$store.getters.getUserDetails.avatar
    },
    userRole () {
      return this.$store.getters.getUserDetails.role
    },
    site_settings () {
      return this.$store.getters.getSettings
    },
    userFullName () {
      var userDetails = this.$store.getters.getUserDetails
      return userDetails.firstname + ' ' + userDetails.lastname
    },
    isActive: {
      get () {
        return this.$store.getters.getSidebar.active
      },
      set (val) {
        this.$store.commit('toggleSidebar', val)
      }
    },
    isMini: {
      get () {
        return this.$store.getters.getSidebar.mini
      },
      set (val) {
        this.$store.commit('minimizeSidebar', val)
      }
    }
  }
}
</script>

<style lang="stylus">

  .nav-top {
    border-top: thin solid #d1d0cf;
    border-top-width: 2px;
  }


</style>
