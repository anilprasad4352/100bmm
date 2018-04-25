<template>
  <v-dialog v-model="this.$store.getters.getAlert.active" :persistent="persistent">
    <v-card>
      <v-card-title class="headline">{{ this.$store.getters.getAlert.header }}</v-card-title>
      <v-card-text>{{ this.$store.getters.getAlert.text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1" flat="flat" @click.native="onAgree()">{{ this.$store.getters.getAlert.okText }}</v-btn>
        <v-btn class="blue--text darken-1" flat="flat" @click.native="onDisagree()">{{ this.$store.getters.getAlert.cancelText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    computed: {
      alertData () {
        return this.$store.getters.getAlert
      }
    },
    watch: {
      alertData (val) {
      }
    },
    props: ['persistent'],
    methods: {
      onAgree () {
        let alert = {
          text: '',
          header: '',
          active: false,
          okText: '',
          cancelText: ''
        }
        this.$store.dispatch('triggerAlert', alert)
        this.$emit('agree')
      },
      onDisagree () {
        this.$emit('disagree')
      }
    }
  }
</script>
