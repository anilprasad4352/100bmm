<template lang="html">
  <v-card>
    <v-toolbar color="grey" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Add New Role</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click.native.stop="saveRole()" round color="primary" dark>Save Role</v-btn>
      <v-btn @click.native="activeDialog()" round color="red" dark>Close</v-btn>
    </v-toolbar>
      <v-list three-line subheader>
          <v-card class="pa-4" flat>
            <v-text-field
            label="Role Title"
            v-model="roleTitle"
            required
          ></v-text-field>
          <span v-if="!valid" style="color: red; font-size: 12px;">Title field is required</span>
          </v-card>
        <v-subheader>Groups</v-subheader>
        <v-list-tile>
          <v-list-tile-action>
            <v-checkbox
              v-model="newPriviledge.groups.create_group"
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
              v-model="newPriviledge.groups.post_to_group"
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
              v-model="newPriviledge.activity_stream.post_to_activity"
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
              v-model="newPriviledge.chat.group_chat"
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
            <v-checkbox
            v-model="newPriviledge.chat.private_chat"></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Private Chats</v-list-tile-title>
            <v-list-tile-sub-title>Allow users to be able to send private messages across users</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="javascript:;">
          <v-list-tile-action>
            <v-checkbox
            v-model="newPriviledge.chat.video_chat"></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Video Chats</v-list-tile-title>
            <v-list-tile-sub-title>Enables users access to video chats</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="javascript:;">
          <v-list-tile-action>
            <v-checkbox v-model="newPriviledge.chat.voice_chat"></v-checkbox>
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
              v-model="newPriviledge.email_updates.access"
              readonly
            ></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Enable Access</v-list-tile-title>
            <v-list-tile-sub-title>Allows users to receive email updates</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="javascript:;">
          <v-list-tile-content>
            <v-list-tile-title>Set limit for Email Update</v-list-tile-title>
            <v-list-tile-sub-title>Limit the number of email updates</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-radio-group v-model="newPriviledge.email_updates.limit" row>
            <v-radio label="5" :value="5" ></v-radio>
            <v-radio label="10" :value="10"></v-radio>
          </v-radio-group>
        </v-list-tile>
      </v-list>
    <v-card>
      <v-toolbar flat color="white" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-spacer></v-spacer>
        <span v-if="!valid" style="color: red; font-size: 12px;">Title field is required</span>
        <v-btn @click.native.stop="saveRole()" round color="primary" dark>Save Role</v-btn>
        <v-btn @click.native.stop="activeDialog()" round color="red" dark>Close</v-btn>
      </v-toolbar>
    </v-card>
  </v-card>
</template>

<script>
  export default {
    props: ['activeDialog', 'length'],
    methods: {
      saveRole () {
        if (this.roleTitle) {
          const payload = {
            level: this.roleLevel,
            priviledges: {
              ...this.newPriviledge,
              title: this.roleTitle
            }
          }
          this.$store.dispatch('addPriviledge', payload)
          this.activeDialog()
          this.roleTitle = ''
          this.newPriviledge = {
            email_updates: {
              access: false,
              limit: 0
            },
            activity_stream: {
              post_to_activity: false
            },
            chat: {
              voice_chat: false,
              video_chat: false,
              private_chat: false,
              group_chat: false
            },
            groups: {
              create_group: false,
              post_to_group: false
            }
          }
        } else {
          this.valid = false
        }
      }
    },
    data () {
      return {
        limits: [
          {
            text: '5',
            value: 5
          },
          {
            text: '10',
            value: 10
          }
        ],
        roleTitle: '',
        valid: true,
        newPriviledge: {
          email_updates: {
            access: false,
            limit: 0
          },
          activity_stream: {
            post_to_activity: false
          },
          chat: {
            voice_chat: false,
            video_chat: false,
            private_chat: false,
            group_chat: false
          },
          groups: {
            create_group: false,
            post_to_group: false
          }
        }
      }
    },
    computed: {
      roleLevel () {
        return this.length + 1
      }
    }
  }
</script>

<style lang="css">
</style>
