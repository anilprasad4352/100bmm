<template>
    <div>
    <v-dialog v-model="openModal" lazy max-width="700px" persistent :fullscreen="screenWidth<600" transition="scale-transition">
      <v-card>
         
        <v-tabs class="pd-0" dark fixed centered v-model="activeTab" slider-color="white" >
          <v-tab href="#info-1"  color="white" key="info-1">
            Find Contractors
             <v-btn icon @click.native="cancel">
              <v-icon dark>cancel</v-icon>
            </v-btn>            
          </v-tab>
          
           
          
          
           
      
                         

                
                    <v-tab-item id="info-1">
                      <v-card-text style="max-height:500px;overflow:auto;" class="pa-5" >
                          <div v-if="!onSearch">
                            <v-layout column align-center>
                                <h6>Find contractors based on:</h6>
                            </v-layout>
                            <v-layout align-center>
                                    <v-flex md3>
                                    </v-flex>
                                    <v-flex md4>
                                        <v-select
                                        v-bind:items="[{text:'NAICS Code', value:'naicscode'},{text:'PSC Code', value:'psccode'},
                                        {text:'Set Aside', value:'setaside'}]"
                                        v-model="mode"
                                        label="Select"
                                        single-line
                                        bottom
                                        ></v-select>
                                    </v-flex>
                                    <v-flex md4>
                                        <v-btn @click.native="searchContractors">Search</v-btn> 
                                    </v-flex>
                            </v-layout>
                          </div>
                          <div v-if="onSearch">
                            <v-layout column align-center>
                                <h6>Find contractors based on {{basisMap[mode]}} {{item[mode]}}:</h6>
                            </v-layout>
                            <v-layout>
                                <kendo-table ref="kendoSearchTable" :url="kendoUrl" height="350" :kendo-schema="kendoSchema" id="kendoGrid" @view="moreInfo"></kendo-table>
                            </v-layout>
                          </div>
                    
                </v-card-text>
                </v-tab-item>
            </v-tabs>

        </v-card>
    </v-dialog>
    <div v-if="contractorDialog">
      <contractor-view-modal :dialog.sync="contractorDialog" :item="contractorItem"></contractor-view-modal>
    </div>
  </div>
</template>

<script>
  import KendoTable from '../../components/KendoModalTable.vue'
  import ContractorViewModal from '../modal/info/contractorViewModal.vue'
  export default {
    components: {
      KendoTable,
      ContractorViewModal
    },
    props: ['dialog', 'item'],
    data: () => {
      return {
        activeTab: 'info-1',
        openModal: this.dialog,
        contractorItem: '',
        mode: 'naicscode',
        onSearch: false,
        contractorDialog: false,
        basisMap: {
          naicscode: 'NAICS Code',
          psccode: 'PSC Code',
          setaside: 'Set Aside'
        },
        url: 'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?',
        kendoUrl: '',
        kendoSchema: [
          { title: 'Name', field: 'companylegalname', editable: false },
          { title: 'Address', field: 'streetaddress', editable: false }
        ],
        apiMap: {
          naicscode: 'primarynaicscode',
          psccode: 'primarypsccode',
          setaside: 'companycertifications'
        },
        fieldMap: {
          naicscode: 'primarynaicscode',
          psccode: 'primarypsccode',
          setaside: 'companycertifications'
        }
      }
    },
    watch: {
      dialog () {
        this.activeTab = 'info-1'
        this.openModal = this.dialog
      },
      url (val) {
        this.kendoUrl = val
      }
    },
    methods: {
      cancel () {
        this.onSearch = false
        this.openModal = false
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
          field: self.fieldMap[self.mode]
        })
        if (self.mode === 'setaside' && this.item[this.mode] === 'N/A') { this.item[this.mode] = 'NONE' }
        this.onSearch = true
        // this.$emit('search',{item: self.mode, val: self.item[self.mode]} )
        this.url =
          'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?' +
          this.apiMap[this.mode] +
          '=' +
          this.item[this.mode]
      },
      moreInfo (item) {
        this.contractorItem = item
        this.contractorDialog = true
        this.openModal = false
      }
    },
    computed: {
      screenWidth () {
        return Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        )
      }
    },
    mounted () {
      this.activeTab = 'info-1'
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

