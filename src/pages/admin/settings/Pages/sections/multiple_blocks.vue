<template>
  <v-card class="pa-2" id="block">
    <v-tabs fixed dark primary centered>
      <v-tab
        class="grey lighten"
        v-for="i in items"
        :key="i"
        :href="'#tab-' + i"
        id="tab-item"
      >
        {{ i }}
      </v-tab>
      <v-tab-item v-for="i in items" :key="i" :id="'tab-' + i">
        <v-card class="pa-3">
          <v-text-field name="input-1" label="Title Text" id="testing" v-model="allData[i].header"></v-text-field>
          <v-text-field name="input-7-1" label="Subtitle Text" multi-line v-model="allData[i].sub_text"></v-text-field>
          <v-btn
            :loading="loading"
            @click.prevent="saveData(allData[i], i)"
            :disabled="loading"
            round primary dark small
            :id="type"
          >
            <v-icon>save</v-icon>
            Save
            <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
            </span>
          </v-btn>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
export default {
  props: ['items', 'submitData', 'loading', 'type', 'data'],
  computed: {
    allData () {
      let data = {}
      this.items.forEach((element) => {
        data[element] = this.data[element]
      })
      return data
    }
  },
  methods: {
    saveData (data, block) {
      const type = `${this.type}/${block}`
      const values = {
        type,
        data
      }
      this.submitData(values)
    }
  },
  data () {
    return {
      values: {}
    }
  }
}
</script>
<style>
    #block {
        border: #ccc solid 2px;
    }
</style>
