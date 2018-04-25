<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm12> 
        <v-card>
          <v-card-title>
            <v-flex xs2 class="mr-4">
              <v-card flat>
                <v-select
                  v-bind:items="status_filter"
                  v-model="currentStatus"
                  label="Status"
                  single-line
                  bottom
                ></v-select>
              </v-card>
            </v-flex>
            <v-flex xs2 class="mr-4">
              <v-card flat>
                <v-select
                  v-bind:items="default_filter"
                  v-model="dateRange"
                  label="Date Range"
                  single-line
                  bottom
                ></v-select>
              </v-card>
            </v-flex>
            <v-flex xs3 class="mr-4">
              <v-card flat>
                <v-text-field
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                  v-model="search"
                ></v-text-field>
              </v-card>
            </v-flex>
          </v-card-title>
          <v-data-table
            v-if="allEvents.length > 0"
            v-bind:headers="headers"
            v-bind:items="allEvents"
            v-bind:search="search"
            :pagination.sync="pagination"
            :rows-per-page-items="[15, 25, 50, 100]"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.submitdate | actualDate }}</td>
              <td class="text-xs-left">
                  <div class="avatar ml-2" style="height: 24px; width: 24px;">
                    <img v-if="props.item.user.avatar" :src="props.item.user.avatar" alt="logo">
                    <img v-if="!props.item.user.avatar" src="https://randomuser.me/api/portraits/men/88.jpg" alt="logo">
                  </div>
                  {{ props.item.user.firstname }} {{ props.item.user.lastname }}
                </td>
              <!-- <td class="text-xs-left">{{ props.item.user.companylegalname }}</td> -->
              <td class="text-xs-left">{{ props.item.title | sliceText }}</td>
              <td class="text-xs-left">{{ props.item.eventdate | actualDate }}</td>
                <td class="text-xs-left">{{ props.item.approvalStatus | status }}</td>
              <td class="text-xs-left">
                <v-layout row wrap>
                  <v-flex xs3 sm3>
                    <v-tooltip top>
                      <v-btn
                      slot="activator"
                      @click.prevent="changeStatus(1, `${props.item.groupId}/${props.item.id}`)"
                      :disabled="props.item.approvalStatus === 1"
                      icon class="green--text">
                        <v-icon>done</v-icon>
                      </v-btn>
                      <span>Approve</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs3 sm3>
                    <v-tooltip top>
                      <v-btn
                      slot="activator"
                      @click.prevent="changeStatus(2, `${props.item.groupId}/${props.item.id}`)"
                      :disabled="props.item.approvalStatus === 2"
                      icon class="red--text">
                        <v-icon>clear</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs3 sm3>
                    <v-dialog v-model="props.item.activeDialog" lazy absolute width="790px">
                      <v-btn
                      slot="activator"
                      icon
                      class="blue--text">
                      <v-icon>remove_red_eye</v-icon>
                    </v-btn>
                      <v-card>
                        <v-layout row>
                          <v-flex xs12 sm12>
                            <v-card>
                              <v-toolbar
                                card color="white" prominent
                              >
                                <v-toolbar-title>Event Details</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-tooltip top>
                                  <v-btn
                                  slot="activator"
                                  dark icon @click.native="props.item.activeDialog = false">
                                    <v-icon color="red">clear</v-icon>
                                  </v-btn>
                                  <span>Close</span>
                                </v-tooltip>
                                <!-- <v-btn icon>
                                  <v-icon>favorite</v-icon>
                                </v-btn>
                                <v-btn icon>
                                  <v-icon>more_vert</v-icon>
                                </v-btn> -->
                              </v-toolbar>
                              <v-list two-line>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>title</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{ props.item.title }} {{ props.item.lastname }}</v-list-tile-title>
                                  </v-list-tile-content>
                                </v-list-tile>
                                <v-divider inset></v-divider>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>person</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{ props.item.companylegalname }} - {{ props.item.user.firstname }} {{ props.item.user.lastname }}</v-list-tile-title>
                                  </v-list-tile-content>
                                </v-list-tile>
                                <v-divider inset></v-divider>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>event</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{ props.item.eventdate }}</v-list-tile-title>
                                    <v-list-tile-sub-title>Event date</v-list-tile-sub-title>
                                  </v-list-tile-content>
                                </v-list-tile>
                              <v-divider inset></v-divider>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>watch_later</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{ props.item.eventtime }}</v-list-tile-title>
                                    <v-list-tile-sub-title>Event time</v-list-tile-sub-title>
                                  </v-list-tile-content>
                                </v-list-tile>
                              <v-divider inset></v-divider>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>location_on</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{ props.item.location }}</v-list-tile-title>
                                  </v-list-tile-content>
                                </v-list-tile>
                                <v-divider inset></v-divider>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>event_note</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{ props.item.description }}</v-list-tile-title>
                                  </v-list-tile-content>
                                </v-list-tile>
                                <v-divider inset></v-divider>
                                <v-list-tile >
                                  <v-list-tile-action>
                                    <v-icon color='primary'>link</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-content>
                                    <a :href="props.item.link"><v-list-tile-title>{{ props.item.link }}</v-list-tile-title></a>
                                  </v-list-tile-content>
                                </v-list-tile>
                              </v-list>
                            </v-card>
                          </v-flex>
                        </v-layout>
                      </v-card>
                  </v-dialog>
                  </v-flex>
                <v-flex xs3 sm3>
                    <v-dialog v-model="dialog" lazy absolute>
                      <v-btn
                      slot="activator"
                      icon
                      @click.prevent="assignId(`${props.item.groupId}/${props.item.id}`)"
                      class="red--text">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                      <v-card>
                          <v-card-title>
                              <div class="headline">Really delete?</div>
                          </v-card-title>
                          <v-card-text>Are you sure you want to delete '{{ props.item.name }}'?</v-card-text>
                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn class="blue--text darken-1" flat="flat" @click.native="dialog = false">No</v-btn>
                              <v-btn class="blue--text darken-1" flat="flat" @click.native="deleteRow()">Yes</v-btn>
                          </v-card-actions>
                      </v-card>
                  </v-dialog>

                  </v-flex>
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
import moment from 'moment'

export default {
  computed: {
    events () {
      return this.$store.getters.fetchGroupEvents
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
    allEvents () {
      if (this.currentStatus || this.currentStatus === 0 || this.dateRange !== 0) {
        let dateAfter = moment().clone().subtract(this.dateRange, 'days').startOf('day')
        return this.events.filter((event) => {
          if (this.currentStatus) {
            return event.approvalStatus === this.currentStatus
          }
          if (this.dateRange !== 0) {
            return moment(event.submitdate).isAfter(dateAfter)
          }
        }).sort((d1, d2) => new Date(d2.submitdate).getTime() - new Date(d1.submitdate).getTime())
      } else {
        return this.events.sort((d1, d2) => new Date(d2.submitdate).getTime() - new Date(d1.submitdate).getTime())
      }
    }
  },
  data () {
    return {
      search: '',
      e1: '',
      pagination: {
        rowsPerPage: 15
      },
      dialog: false,
      currentStatus: '',
      currentEventId: '',
      currentDate: '',
      dateRange: 0,
      view_dialog: false,
      headers: [
        {
          text: 'Submit Date',
          align: 'left',
          sortable: false,
          value: 'eventdate'
        },
        {
          text: 'Submitter',
          value: 'user',
          align: 'left',
          sortable: false
        },
        {
          text: 'Event Title',
          value: 'title',
          align: 'left',
          sortable: false
        },
        {
          text: 'Event Date',
          align: 'left',
          sortable: false,
          value: 'posteddate'
        },
        {
          text: 'Status',
          value: 'status',
          align: 'left',
          sortable: false
        },
        {
          text: 'Actions',
          value: 'action',
          align: 'left',
          sortable: false
        }
      ],
      status_filter: [
        {
          text: 'All',
          value: ''
        },
        {
          text: 'Approved',
          value: 1
        },
        {
          text: 'Pending',
          value: 0
        },
        {
          text: 'Rejected',
          value: 2
        }
      ],
      default_filter: [
        {
          text: 'All',
          value: 0
        },
        {
          text: 'Last 24hrs',
          value: 1
        },
        {
          text: 'Last 7 days',
          value: 7
        },
        {
          text: 'Last 30 days',
          value: 30
        }
      ],
      items: []
    }
  },
  methods: {
    changeStatus (status, postId) {
      const payload = {
        type: 'groupevents',
        status,
        postId
      }
      console.log('payload', payload)
      this.$store.dispatch('changeStatus', payload)
    },
    deleteRow () {
      const payload = {
        type: 'groupevents',
        postId: this.currentEventId
      }
      this.$store.dispatch('deletePost', payload)
      this.dialog = false
    },
    assignId (postId) {
      this.currentEventId = postId
    }
  }
}
</script>
<style>
  #right {
    float: right !important;
  }
</style>