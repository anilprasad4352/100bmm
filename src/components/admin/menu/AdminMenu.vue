<template>

  <v-navigation-drawer
    v-model="isActive"
    :mini-variant="isMini"
    :dark="dark"
    :clipped="clipped"
    overflow
    absolute
    class="pb-0"
    persistent
    height="100%"
  >
    <v-list class="pa-0 py-3">
      <v-list-tile avatar tag="div" dark>
        <v-list-tile-avatar>
          <img :src="user.avatar" />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{user.firstname + " " + user.lastname }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click.native.stop="isMini = !isMini">
            <v-icon dark>chevron_left</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-list class="pt-0" dense>
      <v-divider dark></v-divider>
      <v-list-tile v-for="item in items" :key="item.title">
        <v-list-tile-action>
          <v-icon dark>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="isMini && !this.$store.getters.getInitializing" @click.native.stop="isMini = !isMini">
        <v-list-tile-action>
          <v-icon dark>chevron_right</v-icon>

        </v-list-tile-action>
      </v-list-tile>
    </v-list>

  </v-navigation-drawer>

</template>

<script src="./admin-menu.js"></script>
