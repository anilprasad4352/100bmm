<template>
  <v-data-table
    v-bind:headers="headers"
    :items="members"
    :total-items="totalItems"
    :loading="loading"
    v-bind:search="search"
  >
  <!-- :pagination.sync="tablePagination" -->
    <template slot-scope="{props}">
      <tr style="cursor: pointer">
        <td class="text-xs-left">
            <div class="avatar ml-2" style="height: 24px; width: 24px;">
              <img :src="props.item.avatar" :alt="props.item.firstname + ' ' + props.item.lastname"></div>
            {{ props.item.firstname + ' ' + props.item.lastname }}
        </td>
        <td class="text-xs-left">{{ props.item.companylegalname }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td v-if="user.uid === group.adminId" class="text-xs-left">
          <v-tooltip right>
            <v-btn @click="remove(props.item)" class="reduce-fab" flat fab slot="activator">
                <v-icon class="red--text">mdi-close-circle</v-icon>
            </v-btn>
            <span>Remove {{ props.item.firstname + ' ' + props.item.lastname }}</span>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  import Vue from 'vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    props: ['groupId', 'group'],
    data () {
      return {
        totalItems: 0,
        search: '',
        loading: false,
        members: [],
        headers: [
          { text: 'Full Name', align: 'center', value: 'firstname', sortable: false },
          { text: 'Company', align: 'center', value: 'companylegalname', sortable: false },
          { text: 'Email', align: 'center', value: 'email', sortable: false },
          { text: 'Actions', align: 'left', value: 'actions', sortable: false }
        ],
        memberItems: [],
        counter: 10
      }
    },
    firebase() {
      return {
        groupMembers: db.ref('groups').child(`/-${this.groupId}/members`).orderByChild('approvalStatus').equalTo(1).limitToFirst(this.counter)
      }
    },
    methods: {
      remove (user) {
        this.$firebase.database().ref(`groups/-${this.groupId}/members/${user.uid}`).set({})
      }
    },
    mounted () {
      this.getGroupMembers
    },
    computed: {
      user () {
        return this.$store.getters.getUserDetails
      },
      getGroupMembers() {
        const self = this
        return this.$firebaseRefs.groupMembers.orderByChild('approvalStatus').equalTo(1).limitToFirst(this.counter).on('value', function(result) {
          if (result.val()) {
            const results = result.val()
            const approvedMembersKey = Object.keys(results)
            const userIds = self._.uniq(approvedMembersKey.map(member => results[member].uid))
  
            const userInfo = userIds.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })

            self.members = []
            self.memberItems = []
  
            Promise.all(userInfo)
              .then((users) => {
                users.forEach((user) => {
                  approvedMembersKey.forEach((member) => {
                    if (results[member].uid === user.val().uid) {
                      let item = results[member]
                      self.$firebase.database().ref('companies/' + user.val().cid).once('value').then((company) => {
                        item.companylegalname = company.val().companylegalname
                        item.avatar = user.val().avatar
                        item.firstname = user.val().firstname
                        item.lastname = user.val().lastname
                        item.email = user.val().email
                        self.memberItems.push(item)
                        self.members = self.memberItems.sort((d1, d2) => new Date(d2.dateAdded).getTime() - new Date(d1.dateAdded).getTime())
                      })
                    }
                  })
                })
              })
          } else {
            self.members = []
          }
        })
      }
    }
  }
</script>

<style>
    .reduce-fab {
        width: 40px !important;
        height: 40px !important;
    } 
</style>
