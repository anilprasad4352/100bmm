<template>
  <v-container fluid style="height: 100%; padding: 0;">
    <v-layout row style="height: 100%">
      <v-flex xs2 :style="{backgroundColor: styles.general.theme_color_light}">
        <AdminSideBarMenu />
      </v-flex>
      <v-flex xs10 class="dashboard-view" style="background:white; margin-top: 70px;" >
        <v-tabs dark fixed centered  style="height: 100%;margin-top: -1px;" >
          <v-tab :style="{backgroundColor: styles.general.theme_color_light}" v-for="i in itemsz" :key="i" :href="'#tab-' + i" id="tab-item" style="color: #FFFFFF;">
            {{ i }}
          </v-tab>

          <v-tab-item id="tab-General Settings">
            <v-card flat style="height: 100%">
              <GeneralAppearance />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Landing Page">
            <v-card flat style="height: 100%">
              <LandingAppearance />
              <Landing :settings="pages.landing_pages" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Opportunities">
            <v-card flat style="height: 100%">
              <Opportunities :settings="pages.opportunities" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Directory">
            <v-card flat style="height: 100%">
              <Directory :settings="pages.directory" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Questionnaire">
            <v-card flat style="height: 100%">
              <Questionnaire :settings="pages.questionnaire" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-History">
            <v-card flat style="height: 100%">
              <History :settings="pages.history" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Favorites">
            <v-card flat style="height: 100%">
              <Favorites :settings="pages.favorites" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Tracking">
            <v-card flat style="height: 100%">
              <Tracking :settings="pages.tracking" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Awarded">
            <v-card flat style="height: 100%">
              <Awarded :settings="pages.awardedopportunities" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Recovery">
            <v-card flat style="height: 100%">
              <Recovery :settings="pages.recoveryopportunities" />
            </v-card>
          </v-tab-item>

          <v-tab-item style="height: 100%" id="tab-Forecast">
            <v-card flat style="height: 100%">
              <Forecast :settings="pages.forecastopportunities" />
            </v-card>
          </v-tab-item>
        </v-tabs>
        <!-- <v-card flat>
          <Opportunities :settings="pages.opportunities" />
        </v-card>
        <v-card flat>
          <Directory :settings="pages.directory" />
        </v-card>
        <v-card flat>
          <History :settings="pages.history" />
        </v-card> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import Landing from './Pages/landing.vue'
  import LandingAppearance from './Appearance/landing.vue'
  import GeneralAppearance from './Appearance/general.vue'
  import Opportunities from './Pages/opportunities.vue'
  import Directory from './Pages/directory.vue'
  import Questionnaire from './Pages/questionnaire.vue'
  import History from './Pages/history.vue'
  import Favorites from './Pages/favorites.vue'
  import Tracking from './Pages/tracking.vue'
  import Awarded from './Pages/award.vue'
  import Recovery from './Pages/recovery.vue'
  import Forecast from './Pages/forecast.vue'
  import NavBar from './Components/NavBar.vue'
  import MainMenu from '../../../components/main-menu/MainMenuComponent.vue'
  import UserToolbar from '../../../components/Toolbar.vue'
  import AdminSideBarMenu from './Components/AdminSideBar.vue'

  export default {
    components: {
      Landing,
      LandingAppearance,
      GeneralAppearance,
      NavBar,
      MainMenu,
      AdminSideBarMenu,
      UserToolbar,
      Opportunities,
      Directory,
      Questionnaire,
      History,
      Favorites,
      Tracking,
      Awarded,
      Recovery,
      Forecast
    },
    computed: {
      pages () {
        return this.$store.getters.getPages
      },
      styles () {
        return this.$store.getters.getStyles
      }
    },
    data: () => ({
      drawer: true,
      h1: window.title,
      itemsz: ['General Settings', 'Landing Page', 'Opportunities', 'Directory', 'Questionnaire', 'History', 'Favorites', 'Tracking', 'Awarded', 'Recovery', 'Forecast'],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }),
    methods: {
      onDismiss () {
        this.$store.dispatch('setError', null)
        this.$store.dispatch('setProcess', 'null')
      },
      triggerDrawer () {
        this.drawer = !this.drawer
      }
    },
    mounted () {
      const payload = {
        meta: {
          'h1': 'Settings/Configuration',
          'title': 'Settings/Configuration',
          'description': 'Admin Settings',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
    }
  }
</script>
<style>
  .navigation-drawer {
    position: fixed;
  }
  #tab-item {
    min-width: 18px;
    font-size: 12px;
  }
  #body_view {
    margin-top: 71px;
  }
  .dashboard-view {
    padding: 0 20px;
  }
</style> 
