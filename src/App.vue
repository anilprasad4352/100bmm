<template :style="{backgroundColor: styles.general.background_color}">
  <v-app id="app" toolbar fill-height :style="[baseStyles]">
    <user-toolbar :drawer="drawer" :title="h1" v-if="path!='/' && !this.$store.getters.getInitializing"></user-toolbar>
    <v-progress-linear 
      indeterminate 
      active 
      height="3"
      style="z-index:4;position:fixed;top:0;left:0;margin-top: -1px;"
    >
    </v-progress-linear>
    <v-content fill-height id="content_area">
      <router-view  v-if="!this.$store.getters.getInitializing"></router-view>
    </v-content>
    <v-snackbar
      bottom
      multi-line  
      v-model="this.$store.getters.getSnackbar.active"
      style="z-index: 9999"
    >
      {{ this.$store.getters.getSnackbar.text }}
      <v-btn flat class="pink--text" @click.native="closeSnackbar()">Close</v-btn>
    </v-snackbar>
    <ui-dialog :persistent="true"></ui-dialog>
    <!-- <sidebox-chat :show="false" /> -->
  </v-app>
</template>

<script>
  import MainNavigation from './components/main-menu/MainMenuComponent.vue'
  import UserToolbar from './components/Toolbar.vue'
  import UiDialog from './components/ui/Dialog.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      MainNavigation,
      UserToolbar,
      UiDialog
    },
    data () {
      return {
        drawer: true,
        dialog: true
      }
    },
    mounted () {
      this.$store.dispatch('addStyle')
    },
    computed: {
      ...mapGetters({
        styles: 'getStyles'
      }),
      isInitializing () {
        return this.$store.getters.getInitializing
      },
      h1 () {
        return this.$store.getters.getRouteDetails.current.meta.h1
      },
      path () {
        return this.$store.getters.getRouteDetails.current.path
      },
      bg () {
        return this.$store.getters.getSettings.styles.general.background_color
      },
  
      baseStyles () {
        return {
          backgroundColor: this.$store.getters.getSettings.styles.general.background_color.toString() || '#fff',
          color: this.$store.getters.getSettings.styles.general.font_color || '#000',
          fontFamily: this.$store.getters.getSettings.styles.general.font_types,
          fontSize: this.$store.getters.getSettings.styles.general.font_size
        }
      },
      user () {
        return this.$store.getters.getUserDetails
      },
      styles () {
        return this.$store.getters.getStyles
      }
    },
    methods: {
      closeSnackbar () {
        this.$store.dispatch('triggerSnackbar', {active: false, text: ''})
      },
      loadStyles () {
  
      }
    },
    watch: {
      styles (val) {
        this.$store.dispatch('addStyle')
      }
    }
  }
</script>


<style lang="stylus">
  @import './stylus/main'

  body
    font-family: 'Montserrat', sans-serif

  .container
    overflow-y:hidden;

  a:hover
    text-decoration: none;
  #app {
    width: 100%;
  }
  #fluid {
    position: absolute !important;
    height: 100% !important;
  }

   #body_view {
    margin-top: 40px;
  }
  thead {
    text-indent: 9px;
  }
  .bold {
    font-weight: 600;
  }

  .vue-highcharts {
    border: none;
    box-shadow:none;
  }
</style>
