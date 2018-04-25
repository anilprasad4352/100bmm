<template>
    <v-container fluid>
        <v-layout  class="body-bgx  pb-5 mt-5 pt-5">
            <v-flex md3 style="margin:0 auto;text-align:center;" >
                <img src="/static/images/emoticon-down.png" style="width:60%;color:#000;"/>
                <h2>404</h2>
                <h5>Page not found</h5>
                <p>The Page you are looking for does not exists or an error occured.
                    <br>
                    <br>
                    <a href="/">Head over to the home page</a>
                </p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    mounted() {
    }
}
</script>

<style scoped>
    .body-bgx{
    /*position:absolute;*/
    height:100%;
    width:100%;
  }
  img {
      -webkit-filter: opacity(60%); /* Safari 6.0 - 9.0 */
    filter: opacity(60%);
  }
</style>
