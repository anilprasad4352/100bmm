<template>
<section>
<v-navigation-drawer
    class="pb-0"
    persistent
    height="100%"
    clipped
    absolute
    enable-resize-watcher
    v-model="drawer"
  >
    <v-list dense>
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img :src="'https://randomuser.me/api/portraits/men/38.jpg'" alt="">
        </v-list-tile-avatar>
        <v-list-tile-title>User</v-list-tile-title>
      </v-list-tile>
      <br/>
      <v-divider></v-divider>
      <v-subheader> Categories </v-subheader>
      <v-list-tile v-for="item in items" class="mt-3" :key="item.text">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.text }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider></v-divider>
      <v-subheader> Settings </v-subheader>
      <v-list-tile
        v-for="item in items2"
        :key="item.text"
        class="mt-3"
        :to="item.link">
        <v-list-tile-action>
          <v-icon class="grey--text text--darken-1">{{ item.icon }}
          </v-icon>
        </v-list-tile-action>
        <v-list-tile-title class="grey--text text--darken-1">
          {{ item.text }}
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar dark class="primary" fixed>
    <v-toolbar-title>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      Logo
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-menu bottom right>
        <v-btn flat slot="activator" dark>
          <v-icon class="text--darken-2" left>account_circle</v-icon>
          My Account
        </v-btn>
        <v-list>
          <v-list-tile v-for="item in account" :key="item.title">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</section>
 </template>
<script>
export default {
  props: ['drawer'],
  data: () => ({
    drawer: true,
    itemsz: ['General', 'Landing Page'],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    items: [
      { icon: 'subscriptions', text: 'Activity Stream' },
      { icon: 'collections', text: 'Pages', link: '/' },
      { icon: 'group', text: 'Groups', link: '/' },
      { icon: 'event_note', text: 'Calendar', link: '/' }
    ],
    items2: [
      { icon: 'public', text: 'General', link: '/general' },
      { icon: 'desktop_mac', text: 'Appearance', link: '/appearance' },
      { icon: 'group_add', text: 'Manage Access', link: '/priviledge' }
    ],
    account: [
      { title: 'My Profile' },
      { title: 'Sign Out' }
    ]
  })
}
</script>
<style>
  .navigation-drawer {
    position: fixed;
  }
</style>