<template>
  <v-dialog :max-width="1000" @click.self="closeModal" v-model="trigger">
    <v-card>
        <v-card-title class="pt-0 pb-0">
            <div style="float:right">
                <v-btn icon light @click.native="closeModal">
                    <v-icon style="color: black" dark>cancel</v-icon>
                </v-btn>
            </div>
        </v-card-title>
        <full-calendar :events="events" locale="en" />
    </v-card>
  </v-dialog>
</template>

<script>
  import FullCalendar from 'vue-fullcalendar'

  export default {
    props: ['dialog'],
    components: {
      FullCalendar
    },
    watch: {
      dialog (val) {
        this.trigger = val
      },
      trigger (val) {
        if (!val) {
          this.$parent.$emit('cancel')
        }
      }
    },
    methods: {
      closeModal () {
        this.$parent.$emit('cancel')
      }
    },
    data () {
      return {
        events: [],
        trigger: this.$props.dialog,
        items: [],
        count: 0
      }
    },
    mounted () {
      const self = this
      this.$firebase.database().ref(`events`).orderByChild('submitdate').limitToFirst(5).once('value').then((snap) => {
        snap.forEach((childSnapshot) => {
          const childKey = childSnapshot.key
          let childData = childSnapshot.val()
          if (childData.approvalStatus === 1) {
            self.items.push({
              title: childData.title,
              start: childData.eventdate
            })
            self.items[self.count]['postKey'] = childKey
          }
        })
        self.events = self.items
      })
    }
  }
</script>
