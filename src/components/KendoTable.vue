<template>
  <v-layout row wrap style="overflow-x:scroll;">
    <kendo-data-source ref="datasource1"
      @requestend="onDataBound"
      :transport-read ="{url:query}"
      :schema = " {total: totalRecords, data: 'data' }"
      :page-size="50"
      :server-paging='true'  
      :server-sorting='true' 
    >  
    </kendo-data-source>

    <kendo-grid :height="height || 800"
      @change="onChange" 
      ref="kendoGrid"
      id="grid"
      :data-source-ref="'datasource1'"
      :columns="kendoSchema"
      :column-menu='true'
      :sortable='true'
      :pageable='{
        pageSizes: [25,50,100]
      }'
      :toolbar="['excel']"
      :excel='{fileName: "Exchange Data.xlsx"}'
      :selectable='true'
      :page-size="50" 
      :scrollable="true"
    >
    </kendo-grid>
  </v-layout>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'

import {
  KendoGrid,
  KendoGridInstaller
} from '@progress/kendo-grid-vue-wrapper'
import {
  KendoDataSource,
  KendoDataSourceInstaller
} from '@progress/kendo-datasource-vue-wrapper'

Vue.use(KendoGridInstaller)
Vue.use(KendoDataSourceInstaller)
export default {
  props: ['kendoSchema', 'url', 'height'],
  data: () => {
    return {
      data: {},
      selected: '',
      selecedtRowData: ''
    }
  },
  components: {
    KendoDataSource,
    KendoGrid
  },
  mounted () {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML =
      '.k-grid table tr:hover { background:' +
      this.styles.general.theme_color_light +
      ';color:#fff;}'
    style.innerHTML += `.k-grid td.k-state-selected, .k-state-selected, .k-grid tr.k-state-selected {
      background-color: ${
        this.styles.general.theme_color_dark
      };
      color: #fff;
    }`
    document.getElementsByTagName('head')[0].appendChild(style)
  },
  methods: {
    totalRecords (response) {
      this.$emit('loaded', response.data)
      this.$emit('totalRecords', response.total)
      return response.total
    },
    onChange (e) {
      var row = e.sender.select().data()

      this.$emit('change', row.uid)

      var data = e.sender.dataSource.data()
      for (var i in data) {
        if (data[i].uid === row.uid) {
          this.selected = data[i]
          this.$emit('view', this.selected)
        }
      }
    },
    deselectRow (id) {
      var element = $('tr[data-uid="' + id + '"]')

      $(element).removeClass('k-state-selected')
    },
    onDataBound (e) {
      // var grid = $("#grid");
      // console.log(grid);
      // grid.autoFitColumn(1);
    },
    onPage (e) {}
  },
  computed: {
    query () {
      try {
        this.$refs.datasource1.kendoDataSource.transport.options.read.url = this.url
      } catch (e) {}
      return this.url
    },
    styles () {
      return this.$store.getters.getStyles
    }
  }
}
</script>

<style>
.k-state-selected {
  background-color: #4f772d;
}
.k-grid td.k-state-selected,
.k-grid tr.k-state-selected {
  background-color: #4f772d;
  color: #fff;
}
.k-pager-numbers .k-link,
.k-pager-numbers .k-link:link {
  color: #000;
}

.k-grid {
  font-size: 13px;
}
.k-grid td {
  line-height: 1.3em;
}
</style>

