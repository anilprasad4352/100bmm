<template>
    <v-container>
        <v-layout>
            <v-flex md12>
                <v-card>
                    <v-card-text>
                        <v-layout wrap row>
                            <v-flex md6>
                                <h5>Update Group Details</h5>
                                <v-text-field label="Group Title" v-model="group.name"/>
                                <v-select
                                    style="margin-top: 0;"
                                    label="Select privacy"
                                    required
                                    return-object
                                    v-model="group.privacy"
                                    :items="[{ text: 'Public Group', value: 1 }, { text: 'Closed Group', value: 2 }]"
                                />
                                <v-text-field textarea v-model="group.description" label="Group Title"/>
                                <v-btn @click="updateGroup" class="white--text" color="green">
                                    UPDATE
                                </v-btn>
                            </v-flex>
                            <v-flex class="ml-3" md5>
                                <h5>Delete Group</h5>
                                <v-dialog v-model="dialog" persistent max-width="290">
                                <v-btn color="red" dark slot="activator">DELETE GROUP</v-btn>
                                <v-card>
                                    <v-card-title class="headline">Are you sure you want to delete the group?</v-card-title>
                                    <v-card-text>This is an irreversible action.</v-card-text>
                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" flat @click.native="deleteGroup">Yes</v-btn>
                                    <v-btn color="red darken-1" flat @click.native="dialog = false">No</v-btn>
                                    </v-card-actions>
                                </v-card>
                                </v-dialog>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    props: ['group', 'groupId'],
    data () {
      return {
        dialog: false,
      }
    },
    methods: {
      updateGroup () {
        const group = this.group
        this.$firebase.database().ref(`groups/-${this.groupId}/name`).set(group.name)
        this.$firebase.database().ref(`groups/-${this.groupId}/privacy`).set(group.privacy)
        this.$firebase.database().ref(`groups/-${this.groupId}/description`).set(group.description)
        let snackbar = {
          active: true,
          text: 'Group details updated successfully'
        }
        this.$store.dispatch('triggerSnackbar', snackbar)
      },
      deleteGroup () {
        this.$firebase.database().ref(`groups/-${this.groupId}`).set({})
        this.$router.replace('/groups')
      }
    }
  }
</script>

<style>

</style>
