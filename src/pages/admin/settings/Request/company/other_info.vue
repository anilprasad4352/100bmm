<template lang="html">
  <v-card>
    <v-list two-line>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Specialties</v-list-tile-sub-title>
          <v-list-tile-title>{{ props.item.specialties }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Capabilities</v-list-tile-sub-title>
          <v-list-tile-title>{{ props.item.capabilities }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-title>Capabilities Statements</v-list-tile-title>
        </v-list-tile-content>
        <v-card-action>
          <v-btn v-if="props.item.capabilitiesstatement" target="_blank" :href="props.item.capabilitiesstatement" round color="red lighten-1" dark>View PDF</v-btn>
          <v-card-text v-if="!props.item.capabilitiesstatement">Not Available</v-card-text>
        </v-card-action>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: ['props']
}
</script>

<style lang="css">
</style>
