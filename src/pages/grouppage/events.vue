<template>
  <div>
    <v-container>
      <v-layout row class="mx-5"  align-center>        
        <v-flex xs9>
          <v-flex xs12>
            <h4 style="font-weight:bolder;">Events</h4>
          </v-flex>
          <v-flex xs12 style="font-size:18px;line-height:1.2;font-weight:400;">
            Events are great for getting things done and staying in touch with just the people you want.Share photos and videos,
            have conversations, make plans and more.
          </v-flex>
        </v-flex>
        <v-flex xs3>
          <v-btn large class="white my-4" style="height:70px;text-transform:capitalize;float:right;font-size:18px;" :style="{color: styles.general.theme_color_dark}" @click.prevent="openModal">
            <v-icon x-large>add</v-icon>
            Create an Event
          </v-btn>
        </v-flex>      
      </v-layout>
      <v-layout row  align-center justify-center>
        <v-flex xs12>
          <v-card class="mx-5 mt-2" style="position:relative;">
            <v-tabs  style="margin-left:0px;padding-left:0px;" grow>
              <v-layout>
                <v-flex xs12 sm7 md4>
                  <v-tabs-bar class="white" dark >
                    <v-tabs-slider :color="styles.general.theme_color_dark"></v-tabs-slider>
                    <v-tabs-item key="tab-1" href="#tab-1">
                      <div style="text-transform:capitalize;color:#000;font-size:16px;" :style="{color:styles.general.theme_color_light}" >
                        <v-icon medium>my_location</v-icon>
                        Events
                      </div>
                    </v-tabs-item>
                    <v-tabs-item key="tab-2" href="#tab-2">
                      <div style="text-transform:capitalize;color:#000;font-size:16px;" :style="{color:styles.general.theme_color_light}" >
                        <v-icon medium>assignment</v-icon>
                        Calendar
                      </div>
                    </v-tabs-item>
                  </v-tabs-bar>
                </v-flex>
              </v-layout>   
              <v-divider></v-divider>
              <v-tabs-items>
                <v-tabs-content id="tab-1">
                  <v-layout column wrap style="height:100%;" >			          
                    <event-timeline @viewEvent="viewEvent" :event="event" v-for="event in events" :key="event.eventKey"></event-timeline> 
                  </v-layout>
                </v-tabs-content>
                <v-tabs-content id="tab-2">
                  <full-calendar :events="events" @eventClick="eventClick" class="mx-3 my-3"/>
                </v-tabs-content>
              </v-tabs-items>
            </v-tabs>    
            <new-events-modal :groupRoute="groupRoute" type="groupevents" :groupId="groupId" @closeModal="closeModal" :trigger.sync="dialog"/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <event-view-modal :dialog.sync="eventModal" :item="eventData" @closeViewEvent="closeViewEvent"></event-view-modal>
  </div>
</template>

<script>
  import * as moment from 'moment'
  import Vue from 'vue'
  import FullCalendar from 'vue-fullcalendar'
  import NewEventsModal from './events/NewEventsModal.vue'
  import EventViewModal from './events/EventViewModal.vue'
  import EventTimeline from './events/EventTimelineComponent.vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    props: ['groupId'],
    data () {
      return {
        dialog: false,
        trigger: false,
        eventModal: false,
        events: [],
        items: [],
        count: 0,
        eventData: '',
        activeTab: null,
        counter: 10
      }
    },
    components: {
      FullCalendar,
      NewEventsModal,
      EventViewModal,
      EventTimeline
    },
    firebase () {
      return {
        getEvents: db.ref('groupevents').child(`/${this.groupId}`)
      }
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      },
      strippedGroupId () {
        return this.groupId.replace('-', '')
      },
      groupRoute () {
        return `/${this.strippedGroupId}`
      },
      getGroupEventsWithUser () {
        const self = this
        return this.$firebaseRefs.getEvents.orderByChild('approvalStatus').equalTo(1).limitToLast(this.counter).on('value', function (result) {
          if (result.val()) {
            self.items = []
            self.feed = []
            const results = result.val()
            const eventKeys = Object.keys(results)
            const userIds = self._.uniq(eventKeys.map(event => results[event].uid))
  
            const userInfo = userIds.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })
  
            Promise.all(userInfo)
              .then((users) => {
                users.forEach((user) => {
                  eventKeys.forEach((event) => {
                    if (results[event].uid === user.val().uid) {
                      let item = results[event]
                      item.eventKey = event['.key']
                      item.avatar = user.val().avatar
                      item.user = {}
                      Object.assign(item.user, user.val())
                      let eventTime = new Date(item.eventdate).getTime()
                      let beginningOfDay = moment().startOf('day').format('x')
                      if (eventTime >= beginningOfDay) {
                        self.items.push(item)
                      }
                      self.events = self.items.sort((d1, d2) => new Date(d2.posteddate).getTime() - new Date(d1.posteddate).getTime())
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
      var calendarCSS = `
        .full-calendar-body .dates .dates-events .events-week .events-day .event-box .event-item {
          color: #fff;
          background-color: ${this.styles.general.theme_color_light};
        }
        .week {
          color: ${this.styles.general.theme_color_light}
        }
        .header-center .title, .header-center .prev-month, .header-center .next-month {
          color: ${this.styles.general.theme_color_light};
        float:left;
        
        
      }`

      var style = document.createElement('style')
      style.type = 'text/css'
      style.innerHTML = calendarCSS
  
      document.getElementsByTagName('head')[0].appendChild(style)
  
      const self = this
      this.$on('togglemodal', (val) => {
        this.dialog = val
      })

      this.$on('closeModal', () => {
        self.openEventModal = false
        self.openUpdateEventModal = false
        self.openCalendarModal = false
      })

      this.getGroupEventsWithUser
    },
    methods: {
      close () {
        this.dialog = false
        this.$emit('togglemodal', false)
      },
      closeModal () {
        this.dialog = false
      },
      viewEvent (val) {
        this.eventData = val
        this.eventModal = true
      },
      eventClick (event, jsEvent, pos) {
        this.viewEvent(event)
      },
      openModal () {
        this.dialog = true
      },
      closeViewEvent () {
        this.eventModal = false
      },
      fetchGroupEvents (counter) {
        let self = this
        this.$firebase.database().ref(`groupevents/${this.groupId}`).orderByChild('approvalStatus').equalTo(1).limitToFirst(this.counter).on('value', (snap) => {
          self.items = []
          self.events = []
          snap.forEach((childSnapshot) => {
            const childData = childSnapshot.val()
            self.getUserInfo(childData.uid, self.count)
            .then((result) => {
              childData.user = result.val()
              childData.avatar = childData.user.avatar
              self.items.push(childData)
            })
          })
          self.events = self.items.sort((d1, d2) => new Date(d2.submitdata).getTime() - new Date(d1.submitdate).getTime())
        })
      },

      getUserInfo (uid, index) {
        return this.$firebase.database().ref('users/' + uid).once('value')
      },

      getCompanyInformation (cid, index) {
        return this.$firebase.database().ref('companies/' + cid).once('value')
      }
    }
  }
</script>

<style>
    .comp-full-calendar {
        max-width: none !important;
        padding: 0px !important
    }
    
</style>
