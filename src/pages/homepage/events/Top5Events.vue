<template>
  <span>
    <v-container>
      <v-card>
        <v-card-title :style="{backgroundColor: styles.general.theme_color_light}">
          <v-layout align-center>
            <v-flex xs1 class="mr-2">
              <v-icon medium dark>date_range</v-icon>
            </v-flex>

            <v-flex xs8>
              <div style="font-weight:500;font-size:20px;color:#fff;">Upcoming Events</div>
            </v-flex>

            <v-flex xs1 style="text-align: right;display:none;;">
              <v-tooltip top>
                <v-icon dark medium slot="activator" @click.prevent="openCalendar" style="cursor:pointer">mdi-calendar</v-icon>
                <span>View calendar</span>
              </v-tooltip>
            </v-flex>

            <v-flex xs1 style="text-align: right" class="ml-3">
              <v-tooltip top>
                <v-icon dark medium slot="activator" @click.prevent="openNewModal" style="cursor:pointer">mdi-plus</v-icon>
                <span>Add event</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card-title>
        <div class="pb-3 pt-2">
          <v-list two-line subheader dense>
            <!--<v-list-tile @click.prevent="goTo(event.link)" avatar v-for="event in events" v-bind:key="event.title">-->
            <v-list-tile  avatar v-for="event in events" v-bind:key="event.postKey"  @click.prevent="openUpdateModal($event, event)">
              <v-list-tile-avatar >
                <v-icon x-large :style="{color: styles.general.theme_color_dark}" style="font-size:42px;">date_range</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content  class="eventitem">
                <v-list-tile-title style="font-size: 15px;font-weight:900;"  :style="{color: styles.general.theme_color_dark}" >{{ event.title.toString()}}</v-list-tile-title>
                <v-list-tile-sub-title style="font-size: 12px;font-weight:900;">Event Date: {{ event.eventdate }} {{ event.eventtime }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
      </v-card>
    </v-container>
    <calendar-modal :dialog="openCalendarModal" />
    <new-event-modal @closeModal="closeModal" :trigger="openEventModal" />
    <update-event-modal @closeModal="closeModal" :trigger.sync="openUpdateEventModal"  :item="selectedItem" />
  </span>
</template>

<script>
  import * as moment from 'moment'
  import 'mdi/css/materialdesignicons.min.css'
  import NewEventModal from './NewEventsModal.vue'
  import UpdateEventModal from './UpdateEventsModel.vue'
  import CalendarModal from '@/components/modal/calendarModal.vue'

  export default {
    components: {
      NewEventModal,
      UpdateEventModal,
      CalendarModal
    },
    data () {
      return {
        dialog: false,
        dialog1: false,
        openCalendarModal: false,
        openEventModal: false,
        openUpdateEventModal: false,
        items: [],
        events: [],
        count: 0,
        selectedItem: {}
      }
    },
    methods: {
      openNewModal () {
        this.openUpdateEventModal = false
        this.openEventModal = true
      },
      openUpdateModal (event, item) {
        this.openEventModal = false
        this.openUpdateEventModal = true
        this.selectedItem = item
      },
      closeModal (modal) {
        this[modal] = false
      },
      goTo (link) {
        window.open(link, '_blank')
      },
      openCalendar () {
        this.openCalendarModal = true
      },
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      }
    },
    mounted () {
      const self = this
      this.$on('cancel', () => {
        self.openEventModal = false
        self.openUpdateEventModal = false
        self.openCalendarModal = false
      });
      this.$on('closeModal', () => {
        self.openEventModal = false
        self.openUpdateEventModal = false
        self.openCalendarModal = false
      })
      this.$firebase.database().ref().child('events').orderByChild("approvalStatus").equalTo(1).limitToLast(5).once('value', (snap) => {
        snap.forEach((childSnapshot, index) => {
          const childKey = childSnapshot.key
          let childData = childSnapshot.val()
          let eventTime = new Date (childData.eventdate).getTime()
          let beginningOfDay  = moment().startOf('day').format('x')
          if (eventTime >= beginningOfDay) {
            childData.eventKey = childKey
            self.items.push(childData)
          }
        })
        self.events = self.items
          .sort((d1, d2) => new Date(d2.eventdate).getTime() < new Date(d1.eventdate).getTime())
      })
    }
  }
</script>
<style>
.eventitem{
  cursor: pointer;
}
</style>

