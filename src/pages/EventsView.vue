<template>
  <div>
    <v-container style="padding-top: 100px" class="pt-5 mt-5" fluid :style="{backgroundColor: styles.general.background_color}">
      <v-layout row class="mx-5"  align-center>        
        <v-flex xs9>
          <v-flex xs12>
            <h2 style="font-weight:bolder;">Events</h2>
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
              <v-tab class="white" dark key="tab-1" href="#tab-1">
                <div style="text-transform:capitalize;color:#000;font-size:16px;" :style="{color:styles.general.theme_color_light}" >
                  <v-icon medium>my_location</v-icon>
                  Events
                </div>
              </v-tab>
              <v-tab-item id="tab-1">
                <v-layout column wrap style="height:100%;" >			          
                  <event-timeline @viewEvent="viewEvent" :event="event" v-for="event in events" :key="event.eventKey"></event-timeline> 
                </v-layout>
              </v-tab-item>
            </v-tabs>    
            <new-events-modal groupId="" groupRoute="" type="events" @closeModal="closeModal" :trigger.sync="dialog"/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <div v-if="selected">
      <event-view-modal :dialog.sync="eventModal" :item="eventData" @closeViewEvent="closeViewEvent"></event-view-modal>
    </div>
  </div>
</template>

<script>
  import * as moment from 'moment'
  import Vue from 'vue'
  import NewEventsModal from './grouppage/events/NewEventsModal.vue'
  import EventViewModal from './grouppage/events/EventViewModal.vue'
  import EventTimeline from './grouppage/events/EventTimelineComponent.vue'

  let db = Vue.prototype.$firebase.database()

  export default {
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
        counter: 10,
        selected: false
      }
    },
    components: {
      NewEventsModal,
      EventViewModal,
      EventTimeline
    },
    firebase () {
      return {
        getEvents: db.ref('events')
      }
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
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
                      item.eventKey = event
                      item.avatar = user.val().avatar
                      item.user = {}
                      Object.assign(item.user, user.val())
                      let eventTime = Number(new Date(item.eventdate).getTime())
                      let beginningOfDay = Number(moment().startOf('day').format('x'))
                      if (eventTime >= beginningOfDay) {
                        self.items.push(item)
                      }
                      self.events = self.items.sort((d1, d2) => new Date(d2.eventdate).getTime() - new Date(d1.eventdate).getTime())
                    }
                  })
                })
              })
          } else {
            self.events = []
          }
        })
      },
      groupId () {
        return ''
      }
    },
    mounted () {
      const payload = {
        meta: {
          'h1': 'Events',
          'title': 'Events',
          'description': 'General Events Page',
          'keywords': '',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)

      // const self = this
      // this.$on('togglemodal', (val) => {
      //   this.dialog = val
      // })

      // this.$on('closeModal', () => {
      //   self.openEventModal = false
      //   self.openUpdateEventModal = false
      //   self.openCalendarModal = false
      // })

      this.getGroupEventsWithUser
    },
    methods: {
      closeModal () {
        this.dialog = false
      },
      viewEvent (val) {
        this.eventData = val
        this.eventModal = true
        this.selected = true
      },
      eventClick (event, jsEvent, pos) {
        this.viewEvent(event)
      },
      openModal () {
        this.dialog = true
      },
      closeViewEvent () {
        this.eventModal = false
        this.selected = false
      },
      fetchGroupEvents (counter) {
        let self = this
        this.$firebase.database().ref('events').orderByChild('approvalStatus').equalTo(1).limitToFirst(this.counter).on('value', (snap) => {
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
