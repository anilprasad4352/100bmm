<template>

       <v-container fluid class="px-5 pa-4" v-if="!this.$store.getters.getInitializing">
        <form @submit.prevent="handleUpdateSettings">

          <v-layout row>

            <v-flex xs12 md6 class="text-align-left">
              <v-text-field
                label="Site Title"
                v-model="client.title"
                hint="For example, Georgia Defense Exchange"
                persistent-hint
                prepend-icon="create"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>

            <v-flex xs12 md6 class="text-align-left">
              <v-text-field
                label="Site Tagline"
                v-model="client.tagline"
                hint="Describe your site in few words"
                persistent-hint
                prepend-icon="description"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>

            <v-flex xs12 md6 class="text-align-left">
              <v-select
                v-bind:items="states"
                label="Select the state of operation"
                hint="For example, Georgia"
                persistent-hint
                single-line
                auto
                prepend-icon="map"
                hide-details
                v-model="client.state"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout row>

            <v-flex xs12 md6 class="text-align-left">
              <v-text-field
                label="Url to site logo"
                v-model="client.logo"
                hint=""
                persistent-hint
                prepend-icon="image"
              ></v-text-field>
            </v-flex>

        </v-layout>
          <v-layout row>

            <v-flex xs12 md6 class="text-align-left" v-if="updateProcess && !error">
              <alert :success="true" :error="false" :text="'Successfully updated client settings'"  @dismissed="onDismiss" class="py-2"></alert>
            </v-flex>
          </v-layout>



          <v-layout row>

            <v-flex xs12 sm6 class="text-align-right">
              <v-layout right>
                <v-btn dark class="blue tex-align-right" type="submit" :disable="loading" :loading="loading">
                  Update
                  <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
              </v-layout>

            </v-flex>

          </v-layout>

          <v-layout row v-if="error && updateProcess">
            <alert :text="error"  @dismissed="onDismiss" class="py-2"></alert>
          </v-layout>



        </form>
      </v-container>





</template>

<script>
  import UserToolbar from '../components/Toolbar.vue'
  import Alert from '../components/Alert.vue'
  export default {
    components: {
      UserToolbar,
      Alert
    },
    data () {
      return {
        h1: window.title,
        states: [
          'Alabama', 'Alaska', 'American Samoa', 'Arizona',
          'Arkansas', 'California', 'Colorado', 'Connecticut',
          'Delaware', 'District of Columbia', 'Federated States of Micronesia',
          'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho',
          'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
          'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
          'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
          'Missouri', 'Montana', 'Nebraska', 'Nevada',
          'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
          'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
          'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
          'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
          'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
          'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ]
      }
    },
    mounted () {
      this.h1 = document.title
    },
    computed: {
      client () {
        return this.$store.getters.getClientDetails
      },
      loading () {
        return this.$store.getters.getLoading
      },
      error () {
        return this.$store.getters.getError
      },
      updateProcess () {
        return this.$store.getters.getProcess === 'Client Update'
      }
    },
    methods: {
      handleUpdateSettings () {
        this.$store.dispatch('updateClient', this.client)
      },
      onDismiss () {
        this.$store.dispatch('setError', null)
        this.$store.dispatch('setProcess', 'null')
      }
    }
  }
</script>
