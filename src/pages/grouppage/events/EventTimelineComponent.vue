<template>
  <div>
    <v-layout row wrap style="height:100%;min-height:150px;" class="ml-2" align-center>
      <v-layout row wrap align-center class=""  >
        <v-flex xs1 class="mr-5 text-xs-center" >
          <div style="border-radius:15px;">
            <img :src="event.logo || '/static/images/event-icon.png'" style="border-radius:15px;height:100px;max-height:150px;" />
          </div>
        </v-flex>

        <v-flex xs7 class="ml-1" style="margin-left:-20px;">
          <h5  style="font-weight:900;cursor:pointer"   @click.prevent="viewEvent(event)" class="secondary--text"  >{{ event.title }}</h5>
          <p style="font-size:16px;">                     
            <v-icon medium>date_range</v-icon>  {{ event.eventdate }} at {{event.starteventtime}}
            <br>
            <v-icon medium>group</v-icon>  1 Members are attending
          </p>
          <p style="font-size:18px;"></p>
        </v-flex>

        <v-flex xs1 style="float:left;" >
          <v-btn flat large style="height:20%;" :style="{color: styles.general.theme_color_dark}">
            <v-layout column style="text-transform:capitalize;">
              <v-icon x-large>date_range</v-icon>
              RSVP
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs1 style="float:left;">
          <v-btn flat large style="height:20%;" :style="{color: styles.general.theme_color_dark}">
            <v-layout column style="text-transform:capitalize;">
              <v-icon x-large>favorite</v-icon>
              Favorite
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs1 style="float:right;" class="pl-2">
          <v-btn flat large style="height:20%;" :style="{color: styles.general.theme_color_dark}">
            <v-layout column>
              <v-icon x-large>share</v-icon>
              Share
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-divider class="mt-2"></v-divider>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
  export default {
    props: ['event'],
    mounted () {},
    methods: {
      viewEvent (event) {
        this.$emit('viewEvent', event)
      }
    },
    computed: {
      styles () {
        return this.$store.getters.getStyles
      }
    }
  }
</script>