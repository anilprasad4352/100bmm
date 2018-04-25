<template>
  <v-card flat>
    <v-card>
      <v-toolbar class="white elevation-0">
        <v-toolbar-title class="grey--text text-underline text--darken-4">
          Favorites Page
        </v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content v-bind:value="true">
              <div slot="header">Edit Favorites Page</div>
              <block
                :items="items"
                :submitData="submitData"
                :loading="loading"
                type="favorites"
                :data="settings"
              ></block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
        </v-layout>
        <v-snackbar
          :timeout="3000"
          :success="updateProcess"
          :error="status === 'error'"
          v-model="updateProcess"
        >{{ process }}
        </v-snackbar>
      </v-container>
    </v-card>
  </v-card>
</template>
<script src="./js/favorites.js"></script>
<style lang="stylus" scoped>

</style>
