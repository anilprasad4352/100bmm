<template>
  <v-layout row wrap style="overflow-x:scroll;">
  <div class="loader" v-if="showprogress"></div>	
  <kendo-grid :height="height || 800"
                @change="onChange" 
                ref="kendoGrid"
                id="grid"
                :data-source="localsource"
                :columns="kendoSchema"
                :column-menu='true'
                :sortable='false'
                :pageable='{
                  pageSizes: [25,50,100]
                }'
                :selectable='true'
                :page-size="50" 
                :scrollable="true"
			    :input="true"

        >
        </kendo-grid>
  </v-layout>
</template>

<script>
import {
  KendoGrid,
  KendoGridInstaller
} from "@progress/kendo-grid-vue-wrapper";
import axios from 'axios'
export default {
  props: ["kendoSchema", "url", "height"],
  data: () => {
    return {
      data: {},
      selected: "",
      selecedtRowData: "",
	  localsource: [],
	  showprogress: true
    };
  },
  components: {
    KendoGrid
  },
  mounted() {
  let self = this	
 return axios.get(this.url)	
         .then(res => {	
            self.localsource = {data:res.data.data,pageSize:50}	
			self.showprogress = false	
				
         })
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML =
      ".k-grid table tr:hover { background:" +
      this.styles.general.theme_color_light +
      ";color:#fff;}";
    style.innerHTML += `.k-grid td.k-state-selected, .k-state-selected, .k-grid tr.k-state-selected {
      background-color: ${
        this.styles.general.theme_color_dark
      };
      color: #fff;
    }`;
    document.getElementsByTagName("head")[0].appendChild(style);
  },
  methods: {
    totalRecords(response) {
      this.$emit("loaded", response.data);
      this.$emit("totalRecords", response.total);
      return response.total;
    },
    onChange(e) {
      var row = e.sender.select().data();
      var self = this;
      this.$emit("change", row.uid);
      var data = e.sender.dataSource.data();
      for (var i in data) {
        if (i == parseInt(i, 10) && data[i].uid == row.uid) {
          this.selected = data[i];
          this.$emit("view", this.selected);
        }
      }
    },
    deselectRow(id) {
      var element = $('tr[data-uid="' + id + '"]');
      $(element).removeClass("k-state-selected");
    },
    onDataBound(e) {
      var grid = $("#grid");
      console.log(grid);
      //grid.autoFitColumn(1);
    },
    onPage(e) {}
  },
  computed: {
    query() {
      try {
        this.$refs.datasource1.kendoDataSource.transport.options.read.url = this.url;
      } catch (e) {}
      return this.url;
    },
    styles() {
      return this.$store.getters.getStyles;
    }
  },
  watch: {
    async url (val) {
      this.showprogress = true
      let res = await axios.get(this.url)	
      this.localsource = {data:res.data.data,pageSize:50}	
			this.showprogress = false	
    }
  }
};
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
.loader {	
  border: 16px solid #f3f3f3;	
  border-radius: 50%;	
  border-top: 16px solid #363636;	
  width: 120px;	
  height: 120px;	
  -webkit-animation: spin 2s linear infinite; /* Safari */	
  animation: spin 2s linear infinite;	
  position:absolute;	
  z-index:9999;	
  top:40%;	
  left:40%;	
}	
	
/* Safari */	
@-webkit-keyframes spin {	
  0% { -webkit-transform: rotate(0deg); }	
  100% { -webkit-transform: rotate(360deg); }	
}	
	
@keyframes spin {	
  0% { transform: rotate(0deg); }	
  100% { transform: rotate(360deg); }	
}
</style>