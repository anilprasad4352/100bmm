<template>
  <v-dialog v-model="openModal" max-width="600px"  :fullscreen="screenWidth<600" transition="scale-transition">
    <v-card style="overflow:hidden;">
      <div :style="{backgroundColor: this.styles.general.theme_color_light}" style="height:105px;">
        <v-layout>
          <v-btn icon dark v-on:click="closeViewEvent">
            <v-icon >close</v-icon>
          </v-btn>
        </v-layout>
        <v-layout class="mx-2 px-2">
          <v-flex xs2  class="text-xs-center">
            <img :src="item.logo ? item.logo: '/static/images/event-icon.png'" height="75px;" style="border-radius:10px;"/>
          </v-flex>
          <v-flex xs10 class="mx-4">
            <span style="font-size:20px;color:white" class="bold" >{{ item.title }}</span>
          </v-flex>
        </v-layout>
      </div>
          
      <v-layout justify-end >
        <v-flex xs2 style="float:left;" >
          <v-btn flat medium  :style="{color: styles.general.theme_color_dark}">
            <v-layout column style="text-transform:capitalize;">
              <v-icon medium>date_range</v-icon>
              RSVP
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs2 style="float:left;">
          <v-btn flat medium :style="{color: styles.general.theme_color_dark}">
            <v-layout column style="text-transform:capitalize;">
              <v-icon medium>favorite</v-icon>
              Favorite
            </v-layout>
          </v-btn>
        </v-flex>

        <v-flex xs2 style="float:right;" class="pl-2">
          <v-btn flat medium  :style="{color: styles.general.theme_color_dark}">
            <v-layout column>
              <v-icon medium>share</v-icon>
              Share
            </v-layout>
          </v-btn>
        </v-flex>  
      </v-layout>

      <v-layout column class="mx-3">
        <v-flex xs12 class="my-2">
          <span class="bold">Description</span>
          <p>{{ item.description || '-'}}</p>
        </v-flex>
      
        <v-flex xs12 class="my-2">
          <v-icon>query_builder</v-icon>
          <span>{{ item.eventdate }} at {{ item.starteventtime }} </span>
        </v-flex>

        <v-flex xs12 class="my-2">
          <v-icon>room</v-icon>
          <span>{{ item.location || '-' }}</span>
        </v-flex>

        <v-flex xs12 class="my-2">
          <v-icon>date_range</v-icon>
          <span>{{ item.user.firstname + ' ' + item.user.lastname}} - {{ item.user.jobtitle || '-'}}</span>
        </v-flex>
      </v-layout> 
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "item"],
  methods: {
    closeViewEvent() {
      this.$emit("closeViewEvent")
    }
  },
  computed: {
    screenWidth() {
      return Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
    },
    styles() {
      return this.$store.getters.getStyles;
    },
    openModal() {
      return this.dialog;
    }
  },
  mounted() {}
};
</script>

<style>

</style>
