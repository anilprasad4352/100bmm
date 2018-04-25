<template>
  <div>
    <v-layout row wrap style="min-height:150px;"  class="ml-2" align-center >
      <v-layout row wrap align-center :style="{color: styles.general.theme_color_dark}" style="height:150px;">
        <v-flex xs2 class="mr-2 text-xs-center" >
          <v-layout style="height:130px;border-radius:15px;border:1px solid black;overflow:hidden;background-color:#d1d1d1;" justify-center align-center >
            <img :src="group.coverPhoto.url" style="overflow-y:hidden;width:100%;" />
          </v-layout>
        </v-flex>

        <v-flex xs7 class="mt-4 pl-4" style="margin-left:-20px;">
          <h6 v-if="canAccessGroup" @click.prevent="goTo(`${group.groupId}`)" style="font-weight:900;cursor:pointer" >{{ group.name }}</h6>
          <h6 v-else @click.prevent="showAlert" style="font-weight:900;cursor:pointer" >{{ group.name }}</h6>
          <br>
          <p style="font-size:18px;">
            <v-icon medium>group</v-icon>  {{ Object.keys(groupMembers).length }} Members
          </p>
        </v-flex>

        <v-flex xs1 style="float:left;" >
          <v-btn flat large style="height:20%;" @click.prevent="joinGroup(group)" :style="{color: styles.general.theme_color_dark}" :disabled="isDisabled">
            <v-layout column style="text-transform:capitalize;">
              <v-icon x-large >add</v-icon>
                Join 
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs1 style="float:left;">
          <v-btn flat large style="height:20%;" :style="{color: styles.general.theme_color_dark}">
            <v-layout column style="text-transform:capitalize;">
              <v-icon x-large>favorite</v-icon>
              Favorite
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs1 style="float:right;" class="pl-2">
          <v-btn flat large style="height:20%;" :style="{color: styles.general.theme_color_dark}">
            <v-layout column>
              <v-icon x-large>share</v-icon>
              Share
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-divider class="my-2"></v-divider>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>
<script>
  import Vue from 'vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    props: ['group'],
    data() {
      return {
        groupMembers: []
      }
    },
    firebase() {
      return {
        getMembers: db.ref('groups/' + this.group.groupId).child('members')
      }
    },
    mounted() {
      this.members
    },
    computed: {
      styles() {
        return this.$store.getters.getStyles
      },
      user() {
        this.$store.getters.getUserDetails
      },
      isDisabled() {
        const uid = this.$store.getters.getUserDetails.uid
        if ((this.group.members[uid] && this.group.members[uid].approvalStatus == 1)) {
          return true
        }
        return false
      },
      canAccessGroup() {
        const groupMembersId = Object.keys(this.group.members)
        const userId = this.$store.getters.getUserDetails.uid
        if (groupMembersId.includes(userId) && this.group.members[userId].approvalStatus === 1) {
          return true
        }
        return false
      },
      members(group) {
        const self = this
        return this.$firebaseRefs.getMembers.on('value', function(result) {
          if (result.val()) {
            const results = result.val()
            self.groupMembers = results
          } else {
            self.groupMembers = []
          }
        })
      },
    },
    methods: {
      joinGroup (group) {
        const userId = this.$store.getters.getUserDetails.uid
        let memberPayload = {
          approvalStatus: 0,
          dateAdded: Date.now(),
          memberRole: 'member',
          uid: userId
        }
        var payload = { userId, groupId: group.groupId, member: memberPayload }
        this.$store.dispatch('joinGroup', payload)
      },
      goTo (link) {
        var id = link.split('/').slice(-1)[0].replace('-', '')
        this.$router.push(`/groups/${id}`)
      },
      showAlert() {
        this.$emit('showAlert')
      }
    }

  }
</script>