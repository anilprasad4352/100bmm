<template>
  <v-container fluid style="height: 100%; padding: 0;">
    <v-layout row style="height: 100%">
      <v-flex xs2 :style="{backgroundColor: styles.general.theme_color_light}">
        <AdminSideBarMenu />
      </v-flex>
      <v-flex xs10 class="dashboard-view" style="margin-top:71px;">
        <v-flex xs12 style="margin-top:-1px;">
          <v-tabs  dark fixed centered class="my_white" >
            <v-tab
              :style="{backgroundColor: styles.general.theme_color_light}"
              v-for="(i, index) in itemsz"
              :key="index"
              :href="'#tab-' + i.tabId"
            >
              {{ i.name }}
            </v-tab>
            
            <v-tab-item id="tab-activity">
              <activity />
            </v-tab-item>

            <v-tab-item id="tab-events">
              <events />
            </v-tab-item>
            <v-tab-item id="tab-companies">
              <company />
            </v-tab-item>

            <v-tab-item id="tab-groups">
              <groups />
            </v-tab-item>

            <v-tab-item id="tab-groupevents">
              <group-events />
            </v-tab-item>
          </v-tabs>                  
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import Activity from './Request/activity.vue'
  import Groups from './Request/groups.vue'
  import GroupEvents from './Request/groupevents.vue'
  import Events from './Request/events.vue'
  import Company from './Request/company.vue'
  import MainMenu from '../../../components/main-menu/MainMenuComponent.vue'
  import UserToolbar from '../../../components/Toolbar.vue'
  import AdminSideBarMenu from './Components/AdminSideBar.vue'

  export default {
    components: {
      Activity,
      Groups,
      Events,
      Company,
      MainMenu,
      AdminSideBarMenu,
      UserToolbar,
      GroupEvents
    },
    mounted () {
      const payload = {
        meta: {
          'h1': 'Requests',
          'title': 'Requests',
          'description': 'Admin Settings',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      }
    },
    data: () => ({
      drawer: true,
      itemsz: [
        {
          name: 'Activity Stream',
          tabId: 'activity'
        },
        {
          name: 'Events',
          tabId: 'events'
        },
        {
          name: 'Company Submission',
          tabId: 'companies'
        },
        {
          name: 'Group Post',
          tabId: 'groups'
        },
        {
          name: 'Group Events',
          tabId: 'groupevents'
        }
      ],
      h1: window.title
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
<style lang="scss" scoped>
  .navigation-drawer {
    position: fixed;
  }
  .datatable th.column.text-xs-left {
    text-align: center !important;
  }
  .my_white ul li a{
    color:white !important;
  }
  tr td:nth-child(2){
    width:21% !important;
  }
  .dashboard-view {
    padding: 0 20px;
  }
</style>
