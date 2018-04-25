<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-tabs dark fixed centered>
        <v-card-title class="headline">
          <v-tabs-bar slot="activators" class="cyan">
            <v-tabs-slider class="yellow"></v-tabs-slider>
            <v-tabs-item
              v-for="i in items"
              :key="i"
              :href="'#tab-' + i"
            >
              {{ i }}
            </v-tabs-item>
          </v-tabs-bar>
        </v-card-title>
        <v-card-text>
          <v-tabs-content
            v-for="i in items"
            :key="i"
            :id="'tab-' + i"
          >
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tabs-content>
        </v-card-text>
      </v-tabs>
      <v-card-actions>
        <v-spacer></v-spacer>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['dialog']
  }
</script>
