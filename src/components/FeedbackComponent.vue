<template>
  <div>
    <v-card style="position:absolute;right:0px;top:50px;height:42px;" class="grey lighten-3 text-xs-center primary--text">
      <v-card-actions>
        <v-btn flat @click.prevent="openModal()" small depressed >
            Send Feedback
            <v-icon class="primary--text pl-2">feedback</v-icon>
        </v-btn>
        <v-btn flat @click.prevent="openSupport()" small depressed>
          Help
          <v-icon class="primary--text pl-2">help</v-icon>
          
        </v-btn>
      </v-card-actions>
    </v-card>
    <feedback-modal :dialog="modalTrigger" @cancel="modalTrigger=false" :module="module"></feedback-modal>
    <support-modal :dialog="supportTrigger" @cancel="supportTrigger=false"></support-modal>
  </div>
</template>

<script>
  import FeedbackModal from '../components/modal/feedbackModal.vue'
  import SupportModal from '../components/modal/supportTicket.vue'
  export default {
    props: ['module'],
    components: {
      FeedbackModal,
      SupportModal
    },
    data () {
      return {
        modalTrigger: false,
        supportTrigger: false
      }
    },
    methods: {
      openModal () {
        this.modalTrigger = true
      },
      openSupport () {
        this.supportTrigger = true
      }
    }
  };
</script>

<style>

</style>
