<template>
  <div class="sidebar-menu" :style="{backgroundColor: styles.general.theme_color_light}">
    <v-list :style="{ backgroundColor: styles.general.theme_color_light}" class="mt-4 menu_list_data">
      <v-list-tile :key="i" v-for="(item, i) in items" router :to="item.link">
        <v-list-tile-action>
          <v-icon class="white--text menu_list_item_data">{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="white--text menu_list_item_data">
            {{ item.text }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>
<style>
.sidebar-menu {
  padding-top: 70px;
  display: flex;
  align-items: stretch;
  top: 0;
  bottom: 0;
  width: 100%;
}
.list__tile--active{
background-color:#0000002e !important;
}
.list__tile--active:hover{
background-color:#0000002e !important;
}
.menu_list_data {
  width: 100%;
}
.menu_list_data li{
  margin-bottom: 12px;
  padding-right: 20px;
}
.menu_list_item_data{
  font-size: 16px;
}
.list {
  background: transparent !important;
}
</style>
<script>
import 'font-awesome/css/font-awesome.min.css'

export default {
  data: () => ({
    items: [
      { icon: 'fa-home', text: 'Home', link: '/admin/settings/home' },
      { icon: 'fa-cog', text: 'Settings', link: '/admin/settings/pages' },
      { icon: 'fa-users', text: 'Users', link: '/admin/settings/users' },
      { icon: 'fa-universal-access', text: 'Access', link: '/admin/settings/priviledges' },
      { icon: 'fa-sticky-note', text: 'Requests', link: '/admin/settings/requests' },
      // { icon: 'subscriptions', text: 'Data Download', link: '' },
      // { icon: 'subscriptions', text: 'Manage Integrations', link: '' },
      // { icon: 'fa-line-chart', text: 'Analytics', link: '/admin/settings/gareport' },
      { icon: 'fa-question', text: 'Feedback/Support', link: '/admin/settings/support' }
    ]
  }),
  computed: {

    styles () {
      return this.$store.getters.getStyles
    }
  },
  methods: {
    async checkUserRole () {
      var usr = this.$store.getters.getUserDetails

      var fb = this.$firebase.database().ref()

      let user = await fb.child('users/' + usr.uid.toString()).once('value')

      if (user.role !== 1) {
        let alert = {
          ative: true,
          header: 'Access denied',
          text: "You don't have access on this page",
          okText: 'Ok',
          cancelText: ''
        }
        this.$store.dispatch('triggerAlert', alert)
        this.$router.push('/user/feed')
      }
    }
  }
}
</script>
