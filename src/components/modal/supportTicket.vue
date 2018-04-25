<template>
  <v-dialog :max-width="700" v-model="openModal" persistent>
    <v-card>
      <form @submit.prevent="submitHelp()">
        <v-card-title>
          OPEN SUPPORT TICKET
        </v-card-title>
        <hr>
        <v-card-text>
          <b>Support Topic:</b>
          <v-radio-group v-model="help.topic" :row="false" :column="false" value="Neutral" style="font-size:6px;" class="feedback">
            <v-radio v-for="n in keys.topics" :key="n" :label="n" :value="n"></v-radio>    
          </v-radio-group>

          <b>Comment</b>
          <v-text-field v-model="help.comment" multi-line rows="3" hide-details></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="white--text" color="red darken-1" @click.prevent="cancel()">Cancel</v-btn>
          <v-btn type="submit" class="white--text primary">Submit</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["dialog"],
  data() {
    return {
      openModal: this.dialog,
      help: {
        topic: "Other",
        comment: ""
      },
      keys: {
        topics: [
          "Homepage",
          "Directory",
          "Opportunity",
          "History",
          "Chat",
          "Other"
        ],
      }
    };
  },
  watch: {
    dialog(val) {
      this.openModal = val;
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUserDetails;
    }
  },
  methods: {
    cancel() {
      this.openModal = false;
      this.$emit("cancel");
    },
    submitHelp() {
      this.cancel();
      this.$store.dispatch("submitHelp", {
        help: this.help
      });
    }
  }
};
</script>

<style>
.feedback .input-group.input-group--selection-controls label {
  left: 25px;
  font-size: 13px;
}
</style>
