<template lang="html">
  <v-card>
    <!-- <v-card-media :src="props.item.companylogo" height="300px" :contain="true">
      <v-layout column class="media">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn dark icon class="mr-3">
            <v-icon primary>edit</v-icon>
          </v-btn>
          <v-btn dark icon @click.native="props.item.activeDialog = false">
            <v-icon color="red">clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-card-title class="white--text pl-5 pt-5">
          <div class="display-1 pl-5 pt-5" style="color: #000;font-size:18px;">{{ props.item.companylegalname }}
            <v-icon v-if="props.item.verified" small :right="true" primary>verified_user</v-icon>
            <v-icon color="red" v-if="!props.item.verified" small :right="true">error</v-icon>
          </div>
        </v-card-title>
      </v-layout>
    </v-card-media> -->
    <v-list two-line>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-title>{{ props.item.dunsnumber }}</v-list-tile-title>
          <v-list-tile-sub-title>Duns Number</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-title>{{ props.item.cageid }}</v-list-tile-title>
          <v-list-tile-sub-title>Cage ID</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-title>Federal Contractor</v-list-tile-title>
        </v-list-tile-content>
        <v-list-action>
          <v-chip v-if="props.item.fedcontractor" color="green" text-color="white">
            <v-card-text>YES</v-card-text>
          </v-chip>
          <v-chip v-if="!props.item.fedcontractor" color="red" text-color="white">
            <v-card-text>NO</v-card-text>
          </v-chip>
        </v-list-action>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Federal Contractor Type</v-list-tile-sub-title>
          <v-list-tile-title>{{props.item.fedcontractortype}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Security Clearance</v-list-tile-sub-title>
          <v-list-tile-title>{{props.item.securityclearance}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Primary NAICS Codes</v-list-tile-sub-title>
          <v-list-tile-title>{{props.item.primarynaicscode}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Additional NAICS Codes</v-list-tile-sub-title>
          <v-list-tile-title>{{props.item.additionalnaicscodes}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Primary PSC Codes</v-list-tile-sub-title>
          <v-list-tile-title>{{props.item.primarypsccode}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider inset></v-divider>
      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-sub-title>Additional PSC Codes</v-list-tile-sub-title>
          <v-list-tile-title>{{props.item.additionalpsccodes}}</v-list-tile-title>
        </v-list-tile-content>
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
