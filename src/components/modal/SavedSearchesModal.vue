<template>
  <div>
    <v-dialog :max-width="800" v-model="openModal" persistent>
      <v-card>
        <v-card-title>
          <v-flex md1 sm1 xs1>
            <v-btn icon @click.native="closeSavedSearchesModal">
              <v-icon>cancel</v-icon>
            </v-btn>
          </v-flex>
          <v-flex md11 sm11 xs11>
            <h3 class="modal-title">Saved Searches for {{ pageName }}</h3>
          </v-flex>
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="savedSearches"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.searchName }}</td>
              <td>{{ new Date(props.item.dateCreated).toISOString().split('T')[0] }}</td>
              <td class="justify-center layout px-0">
                <v-btn icon class="mx-0 action-button" @click="performSearch(props.item)">
                  <v-icon color="teal">open_in_new</v-icon>
                </v-btn>
                <v-btn icon class="mx-0 action-button" @click="deleteConfirmationModal(props.item)">
                  <v-icon color="pink">delete</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog :max-width="400" v-model="showDeleteModal" persistent>
      <v-card>
        <v-card-title><h2 class="delete-modal-title">Are you sure you want to delete this saved search?</h2></v-card-title>
        <v-card-actions>
          <v-btn  flat color="red" @click.native="deleteSearch">Yes, Delete</v-btn>
          <v-btn flat @click.native="cancelDeleteConfirmationModal">Go back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
  export default {
    props: ['dialog', 'pageName', 'savedSearches'],
    data() {
      return {
        headers: [
          {
            text: 'Search Name',
            value: 'searchName',
            sortable: false
          },
          {
            text: 'Date Added',
            value: 'dateCreated',
            sortable: false
          },
          {
            text: 'Actions',
            value: 'name'
          }
        ],
        selectedItem: null,
        showDeleteModal: false
      }
    },
    methods: {
      deleteSearch() {
        const path = this.pageName.toLowerCase()
        this.$firebase.database().ref(`saved_searches/${path}/${this.user.uid}/${this.selectedItem.id}`).set(null).then(() => {
          this.showDeleteModal = false
          this.selectedItem = null
        })
      },
      deleteConfirmationModal(item) {
        this.selectedItem = item
        this.showDeleteModal = true
      },
      cancelDeleteConfirmationModal(item) {
        this.selectedItem = null
        this.showDeleteModal = false
      },
      performSearch(item) {
        const filters = item.filters
        this.$emit('performSearch', filters)
        this.$emit('closeSavedSearchesModal')
      },
      closeSavedSearchesModal() {
        this.$emit('closeSavedSearchesModal')
      }
    },
    computed: {
      openModal() {
        return this.dialog
      },
      user() {
        return this.$store.getters.getUserDetails
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal-title {
    font-size: 32px;
    text-align: center;
  }
  .delete-modal-title {
    font-size: 22px;
    text-align: center;
  }
  .close-button {
    background: rgba(0, 0, 0, 0.40);
  }
  .btn .action-button{
    margin-right: 20px;
  }
</style>