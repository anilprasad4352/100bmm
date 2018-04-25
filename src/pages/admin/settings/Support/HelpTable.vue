<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12> 
        <download-excel
          class   = "btn btn--raised pa-2"
          :data   = "helpRequests"
          :fields = "fields"
          name    = "Help Requests.xls">
          Download Excel
        </download-excel>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="helpRequests"
            
            :pagination.sync="pagination"
            :rows-per-page-items="[15, 25, 50, 100]"
            v-if="helpRequests.length > 0"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-center">{{ props.item.submitdate | actualDate }}</td>
              <td class="text-xs-center">{{ props.item.topic }}</td>
              <td class="text-xs-center">
                  
                  {{ props.item.user.firstname }} {{ props.item.user.lastname }}
              <td class="text-xs-center">{{ props.item.user.companylegalname }}</td>
              <td class="text-xs-center">{{ props.item.comment}}</td>
              <td class="text-xs-center"> <v-checkbox v-model="props.item.reviewed" @click.prevent="updateRequest(props.item)"></v-checkbox></td>
              <td class="text-xs-center">
                <div v-if="user.uid==props.item.user.uid">
                  This ticket is opened by you
                </div>
                <div v-else>
                  <v-layout>
                    <v-btn small icon @click="openChat(props.item.user.uid)" >
                      <v-icon small>chat</v-icon>
                    </v-btn>
                    <v-btn small icon @click="deleteRequest(props.item)">
                      <v-icon small>cancel</v-icon>
                    </v-btn>
                  </v-layout>
                </div>
              </td>
            </template>
            <template slot="pageText" slot-scope="{ pageStart, pageStop }">
              From {{ pageStart }} to {{ pageStop }}
            </template>
          </v-data-table>
      </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import DownloadExcel from 'vue-json-excel'
export default {
  components: {
    DownloadExcel
  },
  computed: {
    helpRequests () {
      return this.$store.getters.getHelpRequests
    },
    loading () {
      return this.$store.getters.getLoading
    },
    error () {
      return this.$store.getters.getError
    },
    updateProcess () {
      return this.$store.getters.getProcess === 'Settings Saved'
    },
    process () {
      return this.$store.getters.getProcess
    },
    user () {
      return this.$store.getters.getUserDetails
    }
  },
  mounted () {
    this.$store.dispatch('fetchHelpRequests')
  },
  data () {
    return {
      contactChat: false,
      pagination: {
        rowsPerPage: 15
      },
      fields: {
        'Submit Date': 'submitdate',
        'User': 'user.name',
        'Company': 'user.companylegalname',
        'Help Request': 'comment',
        'Reviewed': 'reviewed'
      },
      headers: [
        {
          text: 'Submit Date',
          align: 'left',
          sortable: false,
          value: 'submitdate'
        },
        {
          text: 'Topic',
          value: 'topic',
          align: 'left',
          sortable: false
        },
        {
          text: 'User',
          value: 'user',
          align: 'left',
          sortable: false
        },
        {
          text: 'Company',
          value: 'companylegalname',
          align: 'left',
          sortable: false
        },
        {
          text: 'Help Request',
          align: 'left',
          sortable: false,
          value: 'comment'
        },
        {
          text: 'Reviewed',
          align: 'left',
          sortable: false,
          value: 'reviewed'
        },
        {
          text: 'Actions',
          align: 'left',
          sortable: false,
          value: 'user'
        }
      ],
      items: []
    }
  },
  methods: {
    openChat (uid) {
      this.contactChat = true
      this.contactUser(uid)
      this.contactUser(uid)
    },
    contactUser (uid) {
      window.$applozic.fn.applozic('loadTab', uid)
      document.getElementsByClassName('chatbutton ')[0].click()
    },
    updateRequest (item) {
      item.reviewed = !item.reviewed
      this.$store.dispatch('updateHelpRequest', item)
    },
    deleteRequest (item) {
      this.$store.dispatch('deleteHelpRequest', item)
    }
  }
}
</script>
<style>
  #right {
    float: right !important;
  }
</style>