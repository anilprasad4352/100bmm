<template>
  <v-dialog :max-width="600" v-model="openModal" persistent>
      <v-card>
        <v-flex md1 sm1 xs1>
          <v-btn icon @click.native="closeSaveSearchModal">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-flex>
        <form @submit.prevent="performSaveSearch">
          <v-card-text class="mt-5">
            <v-layout column>
              <v-flex xs12>
                <v-text-field required v-model="searchName" class="white--text title-input" label="Search Name" style="border: 1px solid rgba(255,255,255,0.2);" prepend-icon="create"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="white--text" color="red darken-1" @click.prevent="closeSaveSearchModal()">Cancel</v-btn>
            <v-btn type="submit" class="white--text" color="blue darken-1">Save</v-btn>
          </v-card-actions>
        </form>
      </v-card>
  </v-dialog>
</template>
<script>
  export default {
    props: ['dialog', 'searchPayload', 'type'],
    data () {
      return {
        searchName: ''
      }
    },
    computed: {
      openModal () {
        return this.dialog
      },
      user () {
        return this.$store.getters.getUserDetails
      }
    },
    methods: {
      performSaveSearch () {
        const searchPayload = {
          searchName: this.searchName,
          filters: this.searchPayload,
          uid: this.user.uid,
          dateCreated: Date.now(),
          dataModified: ''
        }

        this.$firebase.database().ref('saved_searches').child(`/${this.type}/${this.user.uid}`).push(searchPayload).then(() => {
          let snackbar = {
            active: true,
            text: 'Search filter saved'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          this.closeSaveSearchModal()
          return null
        })
      },
      closeSaveSearchModal () {
        this.$emit('closeSaveSearchModal')
      }
    }
  }
</script>

<style scoped>

  .title-input ::-webkit-input-placeholder { /* Chrome */
    color: white;
    padding:10px;
  }
  .title-input :-ms-input-placeholder { /* IE 10+ */
    color: white;
    padding:10px;
  }
  .title-input :-moz-placeholder { /* Firefox 19+ */
    color: white;
    opacity: 1;
    padding:10px;
  }
  .title-input :-moz-placeholder { /* Firefox 4 - 18 */
    color: white;
    opacity: 1;
    padding:10px;
  } 
  .vertical-center {
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
