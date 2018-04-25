<template>
  <v-menu :close-on-content-click="false" offset-y :min-width="600" v-model='menu' style="padding-right:10px">
    <v-btn v-if="single" style='font-size:14px' depressed outline :color='input !=="" ? "indigo" :"black"' small slot="activator" flat>
      {{label}}
      <v-icon right>{{icon}}</v-icon>
    </v-btn>
    <v-btn v-else depressed outline style='font-size:14px' :color=' input && input.length > 0 ? "indigo" :"black"' small slot="activator" flat>
      {{input && input.length> 0 ? `${label}(${input.length})`:label}}
      <v-icon right>{{icon}}</v-icon>
    </v-btn>
    <v-card dense>
      <v-list dense>
        <v-list-tile v-if="!all">
          <v-select v-if="single" :filter="customFilter" :items="list" v-model="selected" autocomplete dense clearable open-on-clear>
            <template slot='item' slot-scope="data">
              <v-list-tile-content style="margin-top:0px">
                <v-list-tile-title class="caption" v-html="data.item.value.text || data.item.value"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
          <v-select v-else :filter="customFilter" :items="list" v-model="selected" autocomplete dense clearable open-on-clear>
            <template slot='item' slot-scope="data">
              <v-list-tile-content style="margin-top:0px">
                <v-list-tile-title class="caption" v-html="data.item.value.text || data.item.value"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
        </v-list-tile>
        <template v-if="all &&!single">
          <v-list-tile>
            <v-text-field v-if="list.length>15" row-height="10" single-line label="Search" v-model="searchText"></v-text-field>
          </v-list-tile>
          <template v-for="item in displayArray">
            <v-list-tile style="margin-bottom:-10px" :key="item.value.text">
              <v-checkbox :label='`${item.value.text}`' v-model="finalized" :value="item.value.value" :key="item.value.value"></v-checkbox>
            </v-list-tile>
          </template>
        </template>
        <template v-else-if="all && single">
          <template v-for="item in list">
            <v-list-tile :key="item.value.text">
              <v-radio-group v-model="finalized">
                <v-radio :label='`${item.text}`' :value="item.value" :key="item.value"></v-radio>
              </v-radio-group>
            </v-list-tile>
          </template>
        </template>
        <template v-else-if="!single" v-for="item in selectedList">
          <v-list-tile :key="item.value">
            <v-checkbox :label='`${item.text}`' v-model="finalized" :value="item.value" :key="item.value"></v-checkbox>
          </v-list-tile>
        </template>
        <v-list-tile>
          <v-spacer></v-spacer>
          <v-btn small flat @click="menu = false">Cancel</v-btn>
          <v-btn small color="primary" @click="apply">Apply</v-btn>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import _ from "lodash";
export default {
  props: ["list", "id", "label", "icon", "single", "input", "all"],
  data: () => ({
    selected: "",
    selectedList: [],
    number: 0,
    searchText: "",
    finalized: [],
    menu: false
  }),
  computed: {
    displayArray() {
      const filtered = _.filter(this.list, ({ value }) =>
        _.includes(_.toLower(value.text), _.toLower(this.searchText))
      );
      const arr = filtered.slice(0, 15);
      return arr;
    }
  },
  methods: {
    customFilter(item, queryText, itemText) {
      const hasValue = val => (val != null ? val : "");
      const text = hasValue(item.value.text);
      const query = hasValue(queryText);
      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    },
    apply() {
      let arr = [];
      if (_.isString(this.finalized) && !this.single) {
        arr.push(this.finalized);
      } else {
        arr = this.finalized;
      }
      this.$emit("apply", { id: this.id, filter: arr });
      this.number = this.finalized.length;
      this.menu = false;
    }
  },
  watch: {
    menu(val) {
      if (!val) {
        this.finalized = this.input;
        this.searchText = "";
      }
    },
    input(val) {
      this.finalized = val;
    },
    selected(val) {
      if (this.single) {
        this.finalized = val;
      } else {
        if (
          val !== "" &&
          val &&
          !_.find(this.selectedList, ({ value }) => val === value)
        ) {
          this.selectedList.push(val);
          // this.list = _.filter(this.list, ({ value }) => value.value !== val);
          this.finalized.push(val.value);
        }
      }
    }
  }
};
</script>
