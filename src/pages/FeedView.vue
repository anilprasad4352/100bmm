<template>
  <div>
  <v-container fluid class="" v-if="!this.$store.getters.getInitializing">

    <v-layout row wrap>

      <v-flex xs12 sm6 md3>

        <v-card flat align-center justify-center>

            <img
              :src="company.logoUrl"
              height="150px"
              style="display:block;
                margin:auto;"
            >

            <v-list>
              <v-list-tile avatar>
                <v-list-tile-action>
                  <v-icon class="pink--text">star</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title></v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
            </v-list>


        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>


<script>
  export default {
    computed: {
      company () {
        return this.$store.getters.getCompanyDetails
      },
      user () {
        return this.$store.getters.getUserDetails
      }
    },
    mounted () {
      
    },
    data  () {
      return {
        leftListItems: [
          {
            title: this.company.name,
            icon: 'business'
          },
          {
            title: this.user.job,
            icon: 'assignment_ind'
          },
          {
            title: this.user.department,
            icon: 'business_center'
          },
          {
            title: this.compnay.location,
            icon: 'location'
          }
        ],
        items: [
          { icon: true, title: 'Jason Oner', avatar: '/static/doc-images/lists/1.jpg' },
          { title: 'Travis Howard', avatar: '/static/doc-images/lists/2.jpg' },
          { title: 'Ali Connors', avatar: '/static/doc-images/lists/3.jpg' },
          { title: 'Cindy Baker', avatar: '/static/doc-images/lists/4.jpg' }
        ]
      }
    }
  }
</script>
