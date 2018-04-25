<template>
  <v-menu bottom dark offset-x offset-y v-if="!this.$store.getters.getInitializing">
    <v-btn flat slot="activator" dark class="ml-0" style="text-transform: capitalize" >
        <v-avatar size="24px">
          <img :src="user && user.avatar ? user.avatar : 'default-avatar.gif'" :alt="user && user.avatar ? user.avatar : 'default-avatar.gif'">
        </v-avatar>
        <div style="margin-left:30px;" class="ml-2">
          Hi, {{user.firstname.toString()}}
        </div>
        <v-btn icon>
          <v-icon small>arrow_drop_down</v-icon>
        </v-btn> 

    </v-btn>
    <v-list>
      <v-list-tile avatar v-if="!this.$store.getters.getInitializing">
        <v-list-tile-avatar>
          <img :src="userProfilePicture" />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title class="caption">
            {{ userFullName}}
          </v-list-tile-title>

        </v-list-tile-content>

      </v-list-tile>

      <v-list-tile v-if="user.role==5">

        <v-list-tile-content>

          <v-list-tile-title class="body-2" v-on:click.prevent="handleAdmin">
            Client Admin
          </v-list-tile-title>

        </v-list-tile-content>

      </v-list-tile>

      <v-list-tile @click.prevent="handleAccount">
        <v-list-tile-content>

          <v-list-tile-title class="body-2">My Account</v-list-tile-title>

        </v-list-tile-content>

      </v-list-tile>
      <v-list-tile @click.prevent="handleSignOut">
        <v-list-tile-content >

          <v-list-tile-title class="body-2">Sign Out</v-list-tile-title>

        </v-list-tile-content>

      </v-list-tile>
    </v-list>
    
  </v-menu>
</template>

<script>
  export default {
    computed: {
      userEmail () {
        return this.$store.getters.getUserDetails.email
      },
      userProfilePicture () {
        return this.$store.getters.getUserDetails.avatar
      },
      userFullName () {
        var userDetails = this.$store.getters.getUserDetails
        return userDetails.firstname + ' ' + userDetails.lastname
      },
      client () {
        return this.$store.getters.getClientDetails
      },
      user () {
        return this.$store.getters.getUserDetails
      }
    },
    methods: {
      handleSignOut () {
        this.$store.dispatch("signUserOut")
      },
      handleAccount () {
        this.$router.push('/user/profile')
      },
      handleAdmin () {
        this.$router.push('/admin/settings')
      }
    }
  }
</script>
