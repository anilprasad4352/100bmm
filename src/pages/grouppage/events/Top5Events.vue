<template>
  <span>
    <v-container class="pt-0">
    <v-card dark>
      <v-card-title :style="{backgroundColor: styles.general.theme_color_light}" dark>
        <v-layout align-center>
          <v-flex xs1 class="mr-2">
            <v-icon medium dark>date_range</v-icon>
          </v-flex>
          <v-flex xs9>
            <div style="font-weight:500;font-size:20px;">Upcoming Events</div>
          </v-flex>

          <v-flex xs1 style="text-align: right" class="ml-3" v-if="add">
            <v-tooltip top>
              <v-icon dark large slot="activator" @click.prevent="openNewModal" style="cursor:pointer">mdi-plus</v-icon>
              <span>Add event</span>
            </v-tooltip>
          </v-flex>

        </v-layout>

      </v-card-title>

      <v-list two-line subheader>
        <v-list-tile avatar v-for="event in events" v-bind:key="event.eventKey" @click.prevent="openUpdateModal(event)">
          <v-list-tile-avatar >
            <v-icon x-large :style="{color: styles.general.theme_color_dark}">date_range</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content @click.prevent="openUpdateModal(event)" class="eventitem">
            <v-list-tile-title  style="font-size: 15px;font-weight:900;text-transform:capitalize;"  :style="{color: styles.general.theme_color_dark}">{{ event.title.toString()}}</v-list-tile-title>
            <v-list-tile-sub-title style="font-size: 12px;font-weight:900;">Event Date: {{ event.eventdate }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-container>
  <calendar-modal :dialog="openCalendarModal" />
  <new-event-modal @closeModal="closeModal" :groupId="groupId" :trigger.sync="openEventModal" />
  <update-event-modal @closeModal="closeModal" :groupId="groupId" :trigger.sync="openUpdateEventModal"  :item="selectedItem" />
  </span>
</template>

<script>
  import * as moment from 'moment'
  import Vue from 'vue'
  import 'mdi/css/materialdesignicons.min.css'
  import NewEventModal from './NewEventsModal.vue'
  import UpdateEventModal from './UpdateEventsModel.vue'
  import CalendarModal from '@/components/modal/calendarModal.vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    props: ['groupId', 'add'],
    components: {
      NewEventModal,
      CalendarModal,
      UpdateEventModal
    },
    data () {
      return {
        openCalendarModal: false,
        openEventModal: false,
        openUpdateEventModal: false,
        items: [],
        events: [],
        count: 0,
        selectedItem: {}
      }
    },
    firebase() {
      return {
        getTopEvents: db.ref('groupevents').child(`/${this.groupId}`)
      }
    },
    methods: {
      close () {
        this.$emit('togglemodal', false)
        this.openEventModal = false
      },
      openUpdateModal (item) {
        this.openEventModal = false
        this.openUpdateEventModal = true
        this.selectedItem = item
      },
      openNewModal () {
        this.openEventModal = true
      },
      closeModal (modal) {
        var self = this
        self[modal] = false
      },
      openCalendar () {
        this.openCalendarModal = true
      }
    },
    computed: {
      user () {
        return this.$store.getters.getUserDetails
      },
      styles () {
        return this.$store.getters.getStyles
      },
      fetchTopFiveEvents() {
        const self = this
        return this.$firebaseRefs.getTopEvents.orderByChild('approvalStatus').equalTo(1).limitToLast(5).on('value', function(snap) {
          if (snap.val()) {
            const results = snap.val()
            const eventKeys = Object.keys(results)

            const userIds = self._.uniq(eventKeys.map(event => results[event].uid))
  
            const userInfo = userIds.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })

            self.items = []
            self.events = []

            Promise.all(userInfo)
              .then((users) => {
                users.forEach((user) => {
                  eventKeys.forEach((event) => {
                    if (results[event].uid === user.val().uid) {
                      let item = results[event]
                      item.eventKey = event
                      item.avatar = user.val().avatar
                      item.user = {}
                      Object.assign(item.user, user.val())
                      let eventTime = new Date(item.eventdate).getTime()
                      let beginningOfDay  = moment().startOf('day').format('x')
                      if (eventTime >= beginningOfDay) {
                        self.items.push(item)
                      }
                      self.events = self.items.sort((d1, d2) => new Date(d2.eventdate).getTime() < new Date(d1.eventdate).getTime())
                    }
                  })
                })
              })
          } else {
            self.events = []
          }
        })
      }
    },
    mounted () {
      const self = this
      this.$on('togglemodal', (val) => {
        this.dialog = val
      })
      this.fetchTopFiveEvents
    }
  }
</script>
