<template>
  <v-dialog :max-width="700" v-model="openModal" persistent>
    <v-card>
      <form @submit.prevent="submitFeedback()">
        <v-card-title>
          TELL US WHAT YOU THINK
        </v-card-title>
        <hr>
        <v-card-text>
          <b>How statisfied are you wih this modal?</b>
          <v-radio-group v-model="feedback.satisfaction" :row="false" :column="false" value="Neutral" style="font-size:6px;" class="feedback">
            <v-radio v-for="n in keys.statisfaction" :key="n" :label="n" :value="n"></v-radio>    
          </v-radio-group>

          <b>Would you use this modal in the future?</b>
          <v-radio-group v-model="feedback.usage" :row="false" :column="false" value="Neutral" style="font-size:6px;" class="feedback">
            <v-radio v-for="n in keys.usage" :key="n" :label="n" :value="n"></v-radio>    
          </v-radio-group>

          <b>Would you recommend this module?</b>
          <v-radio-group v-model="feedback.recommendation" :row="false" :column="false" value="Neutral" style="font-size:6px;" class="feedback">
            <v-radio v-for="n in keys.recommendation" :key="n" :label="n" :value="n"></v-radio>    
          </v-radio-group>

          <b>How often do you use this module?</b>
          <v-radio-group v-model="feedback.frequency" :row="false" :column="false" value="Neutral" style="font-size:6px;" class="feedback">
            <v-radio v-for="n in keys.frequency" :key="n" :label="n" :value="n"></v-radio>    
          </v-radio-group>

          <b>How can we improve this module?</b>
          <v-text-field v-model="feedback.suggestion" multi-line rows="3" hide-details></v-text-field>
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
  props: ["dialog", "module"],
  data() {
    return {
      openModal: this.dialog,
      feedback: {
        satisfaction: "Very Unsatisfied",
        usage: "Definitely not",
        recommendation: "Definitely not",
        frequency: "Once a week",
        suggestion: ""
      },
      keys: {
        statisfaction: [
          "Very Unsatisfied",
          "Unsatisfied",
          "Neutral",
          "Satisfied",
          "Very Satisfied"
        ],
        usage: [
          "Definitely not",
          "Probably not",
          "Not sure",
          "Probably",
          "Definitely"
        ],
        recommendation: [
          "Definitely not",
          "Probably not",
          "Not sure",
          "Probably",
          "Definitely"
        ],
        frequency: [
          "Once a week",
          "2 - 3 times a month",
          "Once a month",
          "Less then once a month"
        ]
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
    submitFeedback() {
      this.cancel();
      this.$store.dispatch("submitFeedback", {
        feedback: this.feedback,
        module: this.module
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
