<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <download-excel
          class   = "btn btn--raised pa-2"
          :data   = "feedbacks"
          :fields = "fields"
          name    = "Feedbacks.xls">
      
          Download Excel

        </download-excel> 
        <v-card>
          <v-data-table
            :headers="headers"
            :items="feedbacks"
            
            :pagination.sync="pagination"
            :rows-per-page-items="[15, 25, 50, 100]"
            v-if="feedbacks.length > 0"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.submitdate | actualDate }}</td>
              <td class="text-xs-left">{{ props.item.module }}</td>
              <td class="text-xs-left">
                  
                  {{ props.item.user.firstname }} {{ props.item.user.lastname }}
              <td class="text-xs-left">{{ props.item.user.companylegalname }}</td>
              <td class="text-xs-left">{{ props.item.satisfaction}}</td>
              <td class="text-xs-left">{{ props.item.usage}}</td>
                <td class="text-xs-left">{{ props.item.recommendation}}</td>
                <td class="text-xs-left">{{ props.item.frequency}}</td>
                <td class="text-xs-left">{{ props.item.suggestion}}</td>
              <td class="text-xs-left">
                <v-layout>
                  <v-btn medium icon @click="openChat(props.item.user.uid)" >
                    <v-icon medium>chat</v-icon>
                  </v-btn>
                  <v-btn icon medium @click="deleteFeedback(props.item)"> 
                    <v-icon medium>cancel</v-icon>
                  </v-btn>
                </v-layout>
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
  computed: {
    feedbacks () {
      return this.$store.getters.getFeedbacks
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
    }
  },
  components: {
    DownloadExcel,
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 15
      },
      fields: {
        'Submit Date': 'submitdate',
        'User': 'user.name',
        'Company': 'user.companylegalname',
        'Module': 'module',
        'How satisfied are you with this module?': 'satisfaction',
        'Would you use this module in future ?': 'usage',
        'Would you recommend this module ?': 'recommendation',
        'How often do you use this module ?': 'frequency',
        'How can we improve this module ?': 'suggestion'

      },
      headers: [
        {
          text: 'Submit Date',
          align: 'left',
          sortable: false,
          value: 'submitdate'
        },
        {
          text: 'Module',
          value: 'module',
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
          text: 'How satisfied are you with this module?',
          align: 'left',
          sortable: false,
          value: 'satisfaction'
        },
        {
          text: 'Would you use this module in future ?',
          value: 'usage',
          align: 'left',
          sortable: false
        },
        {
          text: 'Would you recommend this module ?',
          value: 'recommendation',
          align: 'left',
          sortable: false
        },
        {
          text: 'How often do you use this module ?',
          value: 'frequency',
          align: 'left',
          sortable: false
        },
        {
          text: 'How can we improve this module ?',
          value: 'suggestion',
          align: 'left',
          sortable: false
        },
        {
          text: 'Actions',
          sortable: false
        }
      ],
      items: []
    }
  },
  methods: {
    deleteFeedback (item) {
      this.$store.dispatch('deleteFeedback', item)
    },
    openChat (uid) {
      this.contactChat = true
      this.contactUser(uid)
      this.contactUser(uid)
    },
    contactUser (uid) {
      window.$applozic.fn.applozic('loadTab', uid)
      document.getElementsByClassName('chatbutton ')[0].click()
    }
  }
}
</script>
<style>
  #right {
    float: right !important;
  }
</style>