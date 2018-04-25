<template>
  <v-container class="pt-0">
  <v-card>
    <v-card-title dark :style="{backgroundColor: styles.general.theme_color_light}" >
      <v-layout align-center>
        <v-flex xs1 class="mr-2">
          <v-icon medium dark>fa-lightbulb-o</v-icon>
        </v-flex>
        <v-flex xs9>          
          <div style="font-weight:500;font-size:20px;color:#fff;">Top Opportunities</div>
        </v-flex>
        <v-flex xs2 style="font-size:10px;">
          <router-link to="/opportunities" style="color:#fff;">See All</router-link>
        </v-flex>
        
      </v-layout>
      
    </v-card-title>
    <div class="pb-4">
      <v-list two-line subheader dense>
        <v-list-tile avatar v-for="item in items" @click="openModal(item)" v-bind:key="item.title" style="padding-left:0px;">
          <v-list-tile-avatar>
            <div style="font-size:40px;">
            <v-icon  x-large :style="{color: styles.general.theme_color_dark}" style="font-size:42px;">fa-lightbulb-o</v-icon>
            </div>
          </v-list-tile-avatar>
          <v-list-tile-content class="mt-3">
            <v-list-tile-title style="font-size:15px;font-weight:900;" :style="{color: styles.general.theme_color_dark}"><b>{{ item.solicitationname.toString()}}</b></v-list-tile-title>
            <v-list-tile-sub-title style="font-size:12px;font-weight:900"><b>Posted Date: {{ item.posteddate }}</b></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>

  </v-card>
  <opportunities-modal :trigger.sync="openDialog" @cancel="cancel" :item="selectedItem"/>
  </v-container>
</template>

<script>
  import opportunitiesModal from '../../../components/modal/info/opportunitiesViewModal.vue'
  export default {
    components: {
      opportunitiesModal
    },
    data () {
      return {
        openDialog: false,
        selectedItem: {},
		    naics:this.$store.getters.getCompanyDetails.primarynaicscode
      }
    },
    methods: {
      openModal (item) {
        this.openDialog = true
        this.selectedItem = item
      },
      cancel() {
        this.openDialog = false
      }
    },
    computed: {
      items () {
        const data = this.$store.getters.getOpportunitiesState.data
        return data
      },
      styles () {
        return this.$store.getters.getStyles
      }
    },
    mounted () {
	    let self = this
      this.$on('cancel', () => {
        this.openDialog = false
      }) 	 
	 
      this.$store.dispatch('getOpportunities', { type: 'active', limit: 5,naics:self.naics })
    }
  }
</script>
