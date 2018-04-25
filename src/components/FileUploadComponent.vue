<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>

      <form enctype="multipart/form-data" @submit.prevent="confirm()" novalidate>
        <v-layout column align-center justify-center>
          <v-card-title class="pb-0">
            <input ref="pick" type="file" style="display:none;" @change="broadcastInput()">
            <v-layout column align-center justify-center>
              <v-btn flat icon @click.prevent="pickFile()">
                <v-icon class="text-xs-justify" x-large>backup</v-icon>
              </v-btn>
              <h6 class="text-xs-center mt-2">Click to choose a file</h6>
              <p class="caption">* {{
                formats.toString()
                }}</p>
            </v-layout>

          </v-card-title>

          <v-card-actions class="pa-0" >
            <v-btn flat type="submit">Confirm</v-btn>
            <v-btn flat @click.prevent="cancel()">Cancel</v-btn>
          </v-card-actions>
        </v-layout>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['trigger', 'formats'],
    data () {
      return {
        filePicker: true
      }
    },
    computed: {
      dialog () {
        return this.trigger
      }
    },
    methods: {
      confirm () {
        if (this.$refs.pick.files.length === 0) {
          let snackbar = {
            active: true,
            text: 'Please add a file'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          return
        }

        var truth = this.formats.map(val => {
          return val === (this.$refs.pick.files[0].type.split('/')[1]).toLowerCase()
        })

        var supported = false
        truth.forEach(val => {
          supported = supported || val
        })
        if (!supported) {
          let snackbar = {
            active: true,
            text: 'Invaid file type'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          return
        }

        this.$emit('confirm')
      },
      cancel () {
        this.$emit('cancel')
      },
      pickFile () {
        this.$refs.pick.click()
      },
      broadcastInput  () {
        this.$emit('input', [this.$refs.pick.files[0]])
      }
    }
  }
</script>
