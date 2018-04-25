<template>
  <v-container class="pt-5 mt-5" fluid :style="{backgroundColor: styles.general.background_color}">
    <v-layout row wrap class="mx-5" align-center> 
      <v-flex xs9>
        <v-flex xs12 class="ml-4 ">
          <p style="color:#4a4a4a;font-size:34px;font-weight:900;">Groups</p>
        </v-flex>
        <v-flex xs12 style="color:#4a4a4a;font-size:18px;line-height: 120%;font-weight:400;margin:0px;" class="ml-4">
          <div style="margin-top:-10px;padding-top:0px;">
            Groups are great for getting things done and staying in touch with just the people you want. Share photos and videos,
            have conversations, make plans and more.
          </div>
        </v-flex>
        <v-flex>
          <v-alert
            :style="{'background-color': styles.general.theme_color_dark + '!important'}"
            icon="warning"
            dismissible
            v-model="alert"
            transition="scale-transition">
            You cannot access this group as are not a member yet!
          </v-alert>
        </v-flex>
      </v-flex>
      <v-flex xs3 class="pr-3" v-if="privileges.groups && privileges.groups.create_group" >
        <v-btn large class="white my-4" style="height:70px;text-transform:capitalize;float:right;font-size:18px;>" 
          :style="{color: styles.general.theme_color_dark}"
          @click.prevent="newGroup()"
        >
          <v-icon x-large>add</v-icon>
          Create a Group
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout class="mx-4 mt-3">
      <v-card class="mx-5" style="width:100%;">
        <v-tabs :scrollable="false" fixed >
          <v-tab href="#tab-1" class="mx-2">
            <div style="text-transform:capitalize;font-size:16px;" >
              <v-icon medium>assignment</v-icon>
              Groups 
            </div>
          </v-tab>
          <v-tab href="#tab-2" class="mx-2">
            <div style="text-transform:capitalize;font-size:16px;">
              <v-icon medium>assignment</v-icon>
              Your Groups 
            </div>
          </v-tab>
          <v-tab-item id="tab-1">
            <v-layout column wrap style="height:100%;">
              <group-view :group="group" @showAlert="showAlert" v-for="group in publicGroups" :key="group.groupId"></group-view>
            </v-layout>
          </v-tab-item>

          <v-tab-item id="tab-2">
            <v-layout row wrap style="height:100%;" >
              <group-view :group="group" @showAlert="showAlert" v-for="group in createdGroups" :key="group.groupId"></group-view>
            </v-layout>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-layout>
    <div v-if="openCreateGroupModal">
      <create-group-modal :dialog.sync="openCreateGroupModal" @closeCreateGroupModal="closeCreateGroupModal"/>
    </div>
  </v-container>
</template>
<style>
  .new-group{
    cursor:pointer;
  }
  .card_text{
    min-height: 80px;
    margin-bottom: 10px;
  }
	a{
	  text-decoration:none;
	}
  .invisible {
    display:none;
  }
  .alert {
    margin-left: 30px;
  }
  .error {
    background-color: unset !important;
  }
</style>
<script>
  import Vue from 'vue'
  import GroupView from '../components/GroupViewComponent'
  import CreateGroupModal from '../components/modal/createGroup.vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    data () {
      return {
        joinedgroups: [],
        publicGroups: [],
        createdGroups: [],
        alert: false,
        openCreateGroupModal: false
      }
    },
    components: {
      GroupView,
      CreateGroupModal
    },
    firebase () {
      return {
        getGroups: db.ref('groups')
      }
    },
    mounted () {
      const payload = {
        meta: {
          'h1': 'Groups',
          'title': 'Groups',
          'description': 'Groups Pages',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
      this.groups
    },
    methods: {
      openGroup (group) {
        this.$router.push(`groups/${group.groupId}`)
      },
  
      checkApprovedMember (group) {
        var obj = this.publicgroups[group.groupId]
        return !obj.members[this.user.uid] || obj.members[this.user.uid].approvalStatus === 0
      },
      newGroup () {
        this.openCreateGroupModal = true
      },
      closeCreateGroupModal () {
        this.openCreateGroupModal = false
      },
      showAlert () {
        console.log('I was called')
        this.alert = true
      }
    },
    computed: {
      privileges () {
        return this.$store.getters.getUserPrivileges
      },
      user () {
        return this.$store.getters.getUserDetails
      },
      styles () {
        return this.$store.getters.getStyles
      },
      groups () {
        const self = this
        const userId = this.$store.getters.getUserDetails.uid
        return this.$firebaseRefs.getGroups.on('value', function (result) {
          if (result.val()) {
            const results = result.val()
            const groupKeys = Object.keys(result.val())
            self.publicGroups = []
            self.createdGroups = []
            groupKeys.forEach((group) => {
              const groupInfo = results[group]
              groupInfo.memberCount = Object.keys(groupInfo.members).length
              if (groupInfo.members && (Object.keys(groupInfo.members).includes(userId) || groupInfo.privacy.value === 1)) {
                self.publicGroups.push(groupInfo)
              }
              if (groupInfo.adminId === userId) {
                self.createdGroups.push(groupInfo)
              }
            })
            self.publicGroups.sort((x, y) => x.name - y.name)
            self.createdGroups.sort((x, y) => x.name - y.name)
          } else {
            self.publicGroups = []
            self.createdGroups = []
          }
        })
      }
    }
  }
</script>
