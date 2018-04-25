<template>
  <v-container fluid style="height: 100%">
      <v-layout row style="height: 100%">
          <v-flex xs10 order-md3 order-xs2>
              <v-card fill-height>
                <v-toolbar class="white elevation-0">
                  <v-toolbar-title class="">
                    Appearance Setting
                  </v-toolbar-title> 
                </v-toolbar>
                 <v-card-text>
                  Welcome, Feel free to change the logo, color and font styles for your platform
                </v-card-text>
                <v-flex xs10 offset-xs1 class="mt-3">
                  <v-card flat>
                       <v-tabs dark fixed centered class="mt-4">
                        <v-tabs-bar class="grey lighten-0">
                          <v-tabs-slider class="white"></v-tabs-slider>
                          <v-tabs-item
                            v-for="i in itemsz"
                            :key="i"
                            :href="'#tab-' + i"
                          >
                            {{ i }}
                          </v-tabs-item>
                        </v-tabs-bar>
                        <v-tabs-content
                          id="tab-General"
                        >
                          <v-card flat>
                            <General />
                          </v-card>
                        </v-tabs-content>
                        <v-tabs-content
                          id="tab-Landing Page"
                        >
                          <v-card flat>
                            <Landing />
                          </v-card>
                        </v-tabs-content>
                      </v-tabs>
                  </v-card>
                </v-flex>
              </v-card>
               
          </v-flex>
          <v-flex xs2 order-md1 order-xs3 class="ml-0">
            <AdminSideBarMenu />
          </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
  import General from './Appearance/general.vue'
  import Landing from './Appearance/landing.vue'
  import NavBar from './Components/NavBar.vue'
  import MainMenu from '../../../components/main-menu/MainMenuComponent.vue'
  import UserToolbar from '../../../components/Toolbar.vue'
  import AdminSideBarMenu from './Components/AdminSideBar.vue'

  export default {
    components: {
      General,
      Landing,
      NavBar,
      MainMenu,
      AdminSideBarMenu,
      UserToolbar
    },
    mounted () {
    },
    data: () => ({
      drawer: true,
      itemsz: ['General Settings', 'Landing Page Settings'],
      h1: window.title,
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
    }
  }
</script>
<style>
  .navigation-drawer {
    position: fixed;
  }
</style>
