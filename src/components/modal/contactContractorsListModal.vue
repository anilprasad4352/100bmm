<template>
  <div>
    <v-dialog v-model="openModal" lazy max-width="700px" persistent :fullscreen="screenWidth<600" transition="scale-transition">
      <v-card>
          <v-tabs class="pd-0" dark fixed centered >
              <v-tabs-bar class="header primary">
                  <v-tabs-slider class="white"></v-tabs-slider>
                  <v-tabs-item
                      href="#info-1"
                  >
                  Contact Contractors
                  </v-tabs-item>
                  <v-btn icon @click.native="cancel" style="float:right">
                      <v-icon dark>cancel</v-icon>
                  </v-btn>
              </v-tabs-bar>

        

              <v-card-text style="max-height:500px;overflow:auto;" class="pa-5" >
                  <v-tabs-content id="info-1">
                      
                  </v-tabs-content>
              </v-card-text>
          </v-tabs>

      </v-card>
    </v-dialog>
    <div v-if="contractorDialog">
      <contractor-view-modal :dialog.sync="contractorDialog" :item="contractorItem"></contractor-view-modal>
    </div>
  </div>
</template>

<script>
  import KendoTable from '../../components/KendoTable.vue'
  import ContractorViewModal from '../modal/info/contractorViewModal.vue'
  export default {
    components: {
      KendoTable,
      ContractorViewModal
    },
    props: ['dialog', 'item'],
    data: () => {
      return {
        openModal: this.dialog,
        contractorItem: '',
        mode: 'naicscode',
        onSearch: false,
        contractorDialog: false,
        basisMap: {'naicscode': 'NAICS Code', 'psccode': 'PSC Code'},
        url: 'https://fed-exchange-api.herokuapp.com/api/v2.0/contractorsfilter?',
        kendoSchema: [
          { title: 'Name', field: 'companylegalname', editable: false },
          { title: 'Address', field: 'streetaddress', editable: false }
        ],
        apiMap: {'naicscode': 'naics', 'psccode': 'psc'}
      }
    },
    watch: {
      dialog () {
        this.openModal = this.dialog
      }
    },
    methods: {
      cancel () {
        this.onSearch = false
        this.contractorDialog = false
        this.$parent.$emit('cancel')
      },
      searchContractors () {
        var self = this
        this.kendoSchema = [
          { title: 'Name', field: 'companylegalname', editable: false },
          { title: 'Address', field: 'streetaddress', editable: false }
        ]
        this.kendoSchema.push({
          title: self.basisMap[self.mode],
          field: self.mode
        })
        this.onSearch = true
              // this.$emit('search',{item: self.mode, val: self.item[self.mode]} )
        this.url = 'https://fed-exchange-api.herokuapp.com/api/v2.0/contractorsfilter?' + this.apiMap[this.mode] + '=' + this.item[this.mode]
      },
      moreInfo (item) {
        this.contractorItem = item
        this.contractorDialog = true
        this.openModal = false
      }
    },
    computed: {
      screenWidth () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      }
    },
    mounted () {
      var self = this
      this.$on('cancel', () => {
        self.contractorDialog = false
        self.openModal = true
      })
    }
  }
</script>


<style>
  #kendoGrid {
    width: 100%;
    height: 100%;
  }

  .k-grid-content .k-auto-scrollable .km-widget .km-native-scroller {
    height: 260px;
  }
</style>

