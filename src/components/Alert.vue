<template>
  <v-alert :color="color" dismissible @input="onClose" :value="true">
    {{ text }}
  </v-alert>
</template>

<script>
  export default {
    props: ['text', 'color'],
    methods: {
      onClose () {
        this.$emit('dismissed')
      }
    }
  }
</script>
