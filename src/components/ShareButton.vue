<template>
    <v-menu top offset-y>
        <v-tooltip top slot="activator">
            <v-btn dark flat slot="activator" style="height:100%;">
                <v-layout column align-center  style="font-size:10px;">
                    <v-icon medium>share</v-icon>
                    
                </v-layout>        
            </v-btn>
            <span>Share</span>
        </v-tooltip>
        <v-list>
            <v-list-tile @click.prevent="copyToClipboard(link)">
                <v-list-tile-title >Copy Link</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :href="'mailto:?body='+link">
                <v-list-tile-title>Email Link</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'  
export default {
    props: ['link'],
    methods: {
        copyToClipboard (link) {
            var self = this
            console.log(link)
            this.$copyText(link).then(function (e) {
                let snackbar = {
                    active: true,
                    text: 'Link Successfully Copied To Clipboard'
                }
                self.$store.dispatch('triggerSnackbar', snackbar)

                setTimeout(() => {
                    let snackbar = {
                        active: false,
                        text: ''
                    }
                    self.$store.dispatch('triggerSnackbar', snackbar)
                }, 2000)
                
                
            }, function (e) {
                let snackbar = {
                    active: true,
                    text: 'Unable To Copy Link To Clipboard'
                }
                self.$store.dispatch('triggerSnackbar', snackbar)
            })
        }
    }
}
</script>

<style>

</style>
