<template>
  <span>
    <v-card class="mx-3 mb-3">
        <v-card-title style="background-color: #424242;color:#fff" dark>
            <v-layout>
            Invite User
            </v-layout>
        </v-card-title>
        <form @submit.prevent="inviteUser">
            <v-card-text>
                <input class="text-field m" v-model="email" type="text" placeholder="Insert user's email address"/>
            </v-card-text>
            <v-card-actions class="mt-0 pt-0" style="padding-left: 16px">
                <v-btn type="submit" class="ml-0" style="float: right" color="primary">Invite</v-btn>
            </v-card-actions>
        </form>
    </v-card>
  </span>
</template>

<script>
  export default {
    props: ['groupId', 'group'],
    data () {
      return {
        email: ''
      }
    },
    methods: {
      inviteUser () {
        const groupId = `-${this.groupId}`
        const email = this.email
        const self = this
        if (email.length) {
          this.$firebase.database().ref(`users`).once('value').then(snap => {
            snap.forEach(user => {
              user = user.val()
              if (user.email === email) {
                if (self.group.privacy.value === 2) {
                  user.approvalStatus = 0
                } else {
                  user.approvalStatus = 1
                }
                this.email = ''
                this.$firebase.database().ref(`groups/${groupId}/members/${user.uid}`).set(user)
                return true
              }
            })
          })
        }
      }
    }
  }
</script>

<style>
    .text-field {
      width: 100%;
      padding-left: 10px;
      border: 1px solid #ccc;
      height: 40px;
    }
</style>
