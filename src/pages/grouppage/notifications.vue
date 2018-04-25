<template>
  <v-container>
    <v-layout wrap row>
      <v-flex md9 offset-md2 mb-2>
        <v-card>
          <!-- <v-card-text> -->
          <v-layout wrap row>
            <!-- <img :src="props.item.avatar" :alt="props.item.firstname + ' ' + props.item.lastname"> -->
            <v-flex md12>
              <v-list two-line subheader>
                <v-subheader inset>Join requests</v-subheader>
                <v-list-tile avatar v-for="item in notifications" v-bind:key="item.uid">
                  <v-list-tile-avatar>
                    <img :src="item.avatar" />
                    <!-- <v-icon>close</v-icon> -->
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                  <v-list-tile-title>{{ item.firstname + ' ' + item.lastname }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.jobtitle + ' at ' + item.companylegalname }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-layout>
                      <v-flex md6>
                        <v-btn @click="accept(item)" color="green" ripple flat>
                          ACCEPT
                        </v-btn>
                      </v-flex>
                      <v-flex md6>
                        <v-btn @click="deny(item)" color="red" ripple flat>
                          DENY
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    data () {
      return {
        counter: 10,
        notificationItems: [],
        notifications: []
      }
    },
    props: ['groupId'],
    firebase() {
      return {
        groupMembers: db.ref('groups').child(`/-${this.groupId}/members`)
      }
    },
    mounted() {
      this.getUnApprovedGroupMembers
    },
    computed: {
      getUnApprovedGroupMembers() {
        const self = this
        return this.$firebaseRefs.groupMembers.orderByChild('approvalStatus').equalTo(0).limitToFirst(this.counter).on('value', function(result) {
          if (result.val()) {
            const results = result.val()
            const unapprovedKeys = Object.keys(results)
            const userIds = self._.uniq(unapprovedKeys.map(member => results[member].uid))
  
            const userInfo = userIds.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })

            self.notifications = []
            self.notificationItems = []
  
            Promise.all(userInfo)
              .then((users) => {
                users.forEach((user) => {
                  unapprovedKeys.forEach((member) => {
                    if (results[member].uid === user.val().uid) {
                      let item = results[member]
                      self.$firebase.database().ref('companies/' + user.val().cid).once('value').then((company) => {
                        item.companylegalname = company.val().companylegalname
                        item.avatar = user.val().avatar
                        item.firstname = user.val().firstname
                        item.lastname = user.val().lastname
                        item.email = user.val().email
                        item.jobtitle = user.val().jobtitle
                        self.notificationItems.push(item)
                        self.notifications = self.notificationItems.sort((d1, d2) => new Date(d2.dateAdded).getTime() - new Date(d1.dateAdded).getTime())
                      })
                    }
                  })
                })
              })
          } else {
            self.feed = []
          }
        })
      }
    },
    methods: {
      accept (user) {
        user.approvalStatus = 1
        this.$firebase.database().ref(`groups/-${this.groupId}/members/${user.uid}`).set(user)
      },
      deny (user) {
        this.$firebase.database().ref(`groups/-${this.groupId}/members/${user.uid}`).set({})
      } 
    },
  }
</script>

<style>

</style>
