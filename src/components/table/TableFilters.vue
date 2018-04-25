<template>

  <v-tabs light style="font-size: small;" class="text-xs-left px-2" @input="clearFilterValues()">
    <v-tabs-bar slot="activators" class="white">
      <v-tabs-slider class="blue"></v-tabs-slider>
      <v-tabs-item
        v-for="i in filters"
        :key="i.header"
        :href="'#tab-' + i.header"
        style="text-transform: lowercase;"
      >
        {{ i.header.toString().toLowerCase() }}
      </v-tabs-item>
    </v-tabs-bar>
    <v-tabs-items>
    <v-tabs-content
      v-for="i in filters"
      :key="i.header"
      :id="'tab-' + i.header"
      style="display: block;"
    >
      <v-card flat class="pt-4">
        <v-layout row wrap class="ml-1">
          <v-flex xs12 sm6 md3 lg3 v-for="(j, index) in i.items" v-bind:key="index" class="ml-3" style="padding-top: 0px;float: left;
    position: relative;">
            <v-card-text>

              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="menu"
                transition="scale-transition"
                offset-y
                :nudge-left="40"
                v-if="j.type=='date'"

              >
                <v-text-field
                  slot="activator"
                  :label="j.name"
                  v-model="values[j.field.toString()]"
                  prepend-icon="access_time"
                  readonly
                  @input="say()"
                  class="body-1"

                ></v-text-field>
                <v-date-picker v-model="values[j.field.toString()]" autosave></v-date-picker>
              </v-menu>


              <v-text-field light v-bind:label="j.name" v-if="j.type=='text'"  v-model="values[j.field.toString()]" class="my-0 body-1"
                            style="margin-top:-10px;font-size: 10px" single-line	> </v-text-field>
              <v-checkbox v-bind:label="j.name" v-model="values[j.field.toString()]" light v-if="j.type==='check-box'"></v-checkbox>
            </v-card-text>

          </v-flex>

        </v-layout>

      </v-card>
    </v-tabs-content>
    </v-tabs-items>
  </v-tabs>

</template>

<script>
  export default {
    props: ['filters'],
    data () {
      return {
        text: null,
        test: null,
        menu: false,
        values: []
      }
    },
    methods: {
      clearFilterValues () {
        this.values = []
      },
      filterTable () {
        console.log(this.values)
      }
    },
    beforeCreated () {
      this.filters.forEach(value => {
        value.items.forEach(item => {
          this.values[item.field.toString()] = false
        })
      })
    }
  }
</script>

<style>
  .tabs__item {
    text-transform: capitalize;
  }
  .card__text {
    padding: 0px;
  }

  .flex {
    height: 100%;
  }

  .input-group label {
    font-size: small;
  }

  .input-group__input .icon {
    font-size: 18px;
  }

</style>
