<template>
  <v-container fluid style="height: 100%; padding: 0;">
    <v-layout row style="height: 100%">
      <v-flex xs2 :style="{backgroundColor: styles.general.theme_color_light}">
        <AdminSideBarMenu />
      </v-flex>
      <v-flex xs10 class="dashboard-view" id="body_view">
        <v-card style="height: 100%">
          <v-toolbar color="grey" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Manage Access</v-toolbar-title>
          </v-toolbar>
          <v-list three-line subheader>
            <v-list-tile>
              <v-flex xs6>
                <v-select
                  v-bind:items="roles"
                  v-model="currentRole"
                  label="Select"
                  class="input-group--focused"
                  single-line
                  hint="Select a Role"
                  persistent-hint
                ></v-select>
              </v-flex>
              <v-flex xs6>
                <v-dialog v-model="open_modal" lazy absolute max-width="790px">
                  <v-btn
                  slot="activator"
                  fab small dark color="primary">
                    <v-icon dark>add</v-icon>
                  </v-btn>
                  <NewRole v-bind="{ activeDialog, length }" />
                </v-dialog>
                <v-dialog
                v-if="currentRole !== 0"
                v-model="dialog"
                lazy absolute>
                  <v-btn
                  slot="activator"
                  fab
                  dark small
                  color="red">
                    <v-icon dark>delete</v-icon>
                  </v-btn>
                    <v-card>
                        <v-card-title>
                            <div class="center headline">Confirm delete</div>
                        </v-card-title>
                        <v-card-text>Are you sure you want to delete this role " {{ selectedPriviledge['title'] }} "?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="green--text darken-1" flat="flat" @click.native="deleteRole()">Yes</v-btn>
                            <v-btn class="red--text darken-1" flat="flat" @click.native="dialog = false">No</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
              </v-flex>
            </v-list-tile>
          </v-list>
          <v-card v-if="selectedPriviledge">
            <v-list v-if="selectedPriviledge" three-line subheader>
              <v-subheader>Groups</v-subheader>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox
                    v-model="selectedPriviledge.groups.create_group"
                    @click.native.stop="updateData()"
                    readonly
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Create Group</v-list-tile-title>
                  <v-list-tile-sub-title>Allow users to be able to create groups</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox
                    v-model="selectedPriviledge.groups.post_to_group"
                    @click.native.stop="updateData()"
                    readonly
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Post to Groups</v-list-tile-title>
                  <v-list-tile-sub-title>Allow users to be able to post to groups</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-subheader>Activity Stream</v-subheader>
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox
                    v-model="selectedPriviledge.activity_stream.post_to_activity"
                    @click.native.stop="updateData()"
                    readonly
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Post to Activity Stream</v-list-tile-title>
                  <v-list-tile-sub-title>Allow users to be able to create post in activity stream</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-subheader>Chat</v-subheader>
              <v-list-tile href="javascript:;">
                <v-list-tile-action>
                  <v-checkbox
                    v-model="selectedPriviledge.chat.group_chat"
                    @click.native.stop="updateData()"
                    readonly
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Group Chats</v-list-tile-title>
                  <v-list-tile-sub-title>Allow users to be able to send messages in groups</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile href="javascript:;">
                <v-list-tile-action>
                  <v-checkbox @click.native.stop="updateData()"
                  v-model="selectedPriviledge.chat.private_chat"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Private Chats</v-list-tile-title>
                  <v-list-tile-sub-title>Allow users to be able to send private messages across users</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile href="javascript:;">
                <v-list-tile-action>
                  <v-checkbox @click.native.stop="updateData()"
                  v-model="selectedPriviledge.chat.video_chat"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Video Chats</v-list-tile-title>
                  <v-list-tile-sub-title>Enables users access to video chats</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile href="javascript:;">
                <v-list-tile-action>
                  <v-checkbox @click.native.stop="updateData()" v-model="selectedPriviledge.chat.voice_chat"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Voice Chats</v-list-tile-title>
                  <v-list-tile-sub-title>Enables users access to voice chats</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-subheader>Email Updates</v-subheader>
              <v-list-tile href="javascript:;">
                <v-list-tile-action>
                  <v-checkbox
                    v-model="selectedPriviledge.email_updates.access"
                    @click.native.stop="updateData()"
                    readonly
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Enable Access</v-list-tile-title>
                  <v-list-tile-sub-title>Allows users to receive email updates</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile href="javascript:;">
                <v-list-tile-action>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Set limit for Email Update</v-list-tile-title>
                  <v-list-tile-sub-title>Limit the number of email updates</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-radio-group v-model="selectedPriviledge.email_updates.limit" row>
                  <v-radio @click.native.stop="updateData()" label="5" :value="5" ></v-radio>
                  <v-radio @click.native.stop="updateData()" label="10" :value="10"></v-radio>
                </v-radio-group>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-card v-if="!selectedPriviledge">
            <v-card-text>
              <p>
                No Role has been selected, Please select role to display above
              </p>
            </v-card-text>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminSideBarMenu from './Components/AdminSideBar.vue'
import NewRole from './Priviledges/NewRole.vue'

export default {
  components: {
    AdminSideBarMenu,
    NewRole
  },
  computed: {
    user () {
      return this.$store.getters.getUserDetails
    },
    styles () {
      return this.$store.getters.getStyles
    },
    all_priviledges () {
      const raw = this.$store.getters.getAllPriviledges.val()
      const notAllowed = ['Client Admin', 'Business Admin', 'Staff', 'User', 'Disabled']
      this.length = Object.keys(raw).length
      const filtered = Object.keys(raw)
      .filter(key => !notAllowed.includes(raw[key].title))
        .reduce((obj, key) => {
          obj[key] = raw[key]
          return obj
        }, {})
      return filtered
    },
    loading () {
      return this.$store.getters.getLoading
    },
    error () {
      return this.$store.getters.getError
    },
    selectedPriviledge () {
      if (this.currentRole) {
        return this.all_priviledges[this.currentRole]
      }
      return null
    },
    roles () {
      const allRoles = []
      const levels = Object.keys(this.all_priviledges)
      levels.forEach((role) => {
        const data = {}
        data['text'] = this.all_priviledges[role]['title']
        data['value'] = role
        allRoles.push(data)
      })
      return allRoles
    }
  },
  methods: {
    updateData () {
      const payload = {
        level: this.currentRole,
        priviledges: this.all_priviledges[this.currentRole]
      }
      this.$store.dispatch('updatePriviledge', payload)
    },
    deleteRole () {
      const payload = {
        title: this.currentRole
      }
      this.$store.dispatch('deleteRole', payload)
      this.currentRole = 0
      this.dialog = false
    },
    activeDialog () {
      this.open_modal = !this.open_modal
    }
  },
  data: () => ({
    currentRole: 0,
    length: 0,
    open_modal: false,
    dialog: false,
    limits: [
      {
        text: '5',
        value: 5
      },
      {
        text: '10',
        value: 10
      }
    ]
  }),
  mounted () {
    const payload = {
      meta: {
        'h1': 'Manage Access',
        'title': 'Manage Access',
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

<style lang="scss" scoped>
  .dashboard-view {
    padding: 0 20px;
  }
</style>
