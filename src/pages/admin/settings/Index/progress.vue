<template>
    <v-container fluid class="progressbar"  :style="{backgroundColor: styles.general.theme_color_light , width: activeColor + '%'}" >
        <v-layout row wrap>
             <div class="tab1 white--text" ></div>
         
        </v-layout>
    </v-container>
</template>
<style>
.progressbar{
padding: 0px;
    height: 20px;
    float: left;
}
</style>

<script>
  
  export default {
    props: ['value'],
    data () {
      return {
	    activeColor: this.value*2
      }
    },
	computed: {
      styles () {
        return this.$store.getters.getStyles
      }
    },
  }

</script>
