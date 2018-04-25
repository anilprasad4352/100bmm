<template>
  <v-container class="pt-0">
  <v-card>
    <v-card-title :style="{backgroundColor: styles.general.theme_color_light}"  dark>
      TOP 5 OPPORTUNITIES
    </v-card-title>

      <v-list two-line subheader dense>
        <v-list-tile avatar v-for="item in items" @click="openModal(item)" v-bind:key="item.title">
          <v-list-tile-avatar>
            <v-icon class="grey lighten-1 white--text">work</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.solicitationname.toString().toUpperCase()}}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.posteddate }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

  </v-card>
  <opportunities-modal :dialog="openDialog" :item="selectedItem" />
  </v-container>
</template>

<script>
  import opportunitiesModal from '@/components/modal/info/opportunitiesViewModal.vue'
  export default {
    components: {
      opportunitiesModal
    },
    data () {
      return {
        openDialog: false,
        selectedItem: {}
      }
    },
    methods: {
      openModal (item) {
        this.openDialog = true
        this.selectedItem = item
      }
    },
    computed: {
      items () {
        const data = this.$store.getters.getOpportunitiesState.filter(item => {
          if (item.noticetype.match('Cancelled') || item.noticetype.match('Award') ||
            item.noticetype.match('Cancellation') || item.noticetype.match('Award Notice')) {
            return null
          }
          return item
        })
        console.log(data, 'items')
        return data.slice(0, 6)
      },
      styles () {
        return this.$store.getters.getStyles
      }
    },
    mounted () {
      this.$on('cancel', () => {
        this.openDialog = false
      })
      this.$store.dispatch('getOpportunities')
    }
  }
</script>
