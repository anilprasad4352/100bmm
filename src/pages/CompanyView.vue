<template>
  <v-container style="" :style="{backgroundColor: styles.general.background_color}">
    <v-layout>
      <v-tabs v-model="active">
        <v-tabs-bar class="header" style="background-color:rgb(245, 245, 245)">
          <v-tabs-item
            v-for="tab in tabs"
            :key="tab"
            :href="'#' + tab.toLowerCase().replace(/\,|\.|\s/g, '')"
            ripple
          >
            {{tab}}
          </v-tabs-item>
          <v-tabs-slider class="yellow"></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content
            id="companyinfo"
          >
            <v-card flat>
              <v-card-text>
                <company-info :mode="'view'"></company-info>
              </v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-container>

</template>

<script>
  import CompanyInfo from './questionaire/CompanyInformationForm.vue'
  export default {
    components: {
      CompanyInfo
    },
    data () {
      return {
        active: null,
        tabs: ['Company Info', 'Contracting Info', 'Other Info'],
        text: 'a'
      }
    },
    mounted () {
      var company = this.$route.params.name
      this.$firebase.database().ref(`companies/${company}`).once('value')
        .then(
          snapshot => {
            console.log(snapshot.val())
          }
        )
    },
	computed: {
     
	  styles () {
        return this.$store.getters.getStyles
      }
    },
    methods: {
      next () {
        this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
      }
    }
  }
</script>

<style>
  .header {
    background-color: rgb(245, 245, 245);
    border-style: none;
    border-bottom: thin solid #d1d0cf;
    border-bottom-width: 2px;
  }
</style>
