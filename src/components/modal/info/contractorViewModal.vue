<template>
  <div>
    <v-dialog v-model="dialogFetch" max-width="1050px" persistent :fullscreen="screenWidth<600" transition="scale-transition" max-height="600px" >
      <v-card>    
        <v-layout v-if="item">
          <v-flex xs12 md4 :style="{backgroundColor: styles.general.theme_color_light}" class="modal-bg pb-5">
            <v-layout column>
              <v-flex xs12>
                <v-btn dark @click.prevent="cancel()" icon>
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>

              <v-flex xs12 style="text-align:center">
                <v-avatar class="grey lighten-4" size="94px" style="text-align:center;"><img :src="item.companylogo || '/static/images/business-icon.png'" alt="logo"></v-avatar>
              </v-flex>
              
              <v-flex xs12 style="color:#fff;text-align:center;" class="mx-2">
                <p  class="mt-2" style="font-size:24px;color:#fff;text-align:center;font-weight:700;">{{ item.companylegalname || 'N/A' }}</p>
                <p style="margin-top:-10px;padding-top:0px;">{{ item.streetaddress }}</p>
              </v-flex>
              
              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3"><b><span>Phone:</span></b>
                  <br>
                  {{ item.phonenumber || 'N/A'}}                
                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3"><b><span>Public Email:</span></b>
                  <br>
                  {{ item.emailaddress || 'N/A' }}              
                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3"><b><span>SBA Certifications:</span></b>
                  <br>
                  {{ item.companycertifications && item.companycertifications.trim(' ')!='' ? item.companycertifications : 'N/A'}}              
                </p>
              </v-flex>

              <v-flex xs12 style="color:#fff;text-align:left;">
                <p class="pl-3"><b><span>Primary NAICS:</span></b>
                  <br>
                  {{ item.naicscodedescription || 'N/A' }}              
                </p>
              </v-flex>
            </v-layout>
            <v-layout class="mt-5">
              <v-card-actions dark style="position: absolute; bottom: 25px;">
                <v-layout  class="mt-1 pt-1 ml-4 text-xs-center" justify-space-around>
                  <!-- <v-btn flat><v-icon medium>mdi-heart</v-icon></v-btn> -->
                  <v-flex xs2> 
                    <v-tooltip top v-if="!favorited">
                      <v-btn small dark flat slot="activator" @click.prevent="favoriteItem" style="margin-left:-9px;height:100%;">
                        <v-layout column align-center  style="font-size:10px;">
                          <v-icon medium>favorite</v-icon>
                        </v-layout>    
                      </v-btn>
                      <span>Add Favorite</span>
                    </v-tooltip>

                    <v-tooltip top v-else>
                      <v-btn small dark flat slot="activator" @click.prevent="unfavoriteItem">
                        <v-layout column align-center  style="font-size:10px;">
                          <v-icon medium color="red">favorite</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Remove Favorite</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs2 >  
                    <share-button :link="shareLink"></share-button>
                  </v-flex>

                  <v-flex xs2 style="font-size:12px;">
                    <v-tooltip top v-if="companyUsers.data && companyUsers.data.length > 0">
                      <v-btn dark @click.prevent="contact" flat slot="activator" style="height:100%;">
                        <v-layout column align-center  style="font-size:10px;">
                          <v-icon medium>chat</v-icon>
                        </v-layout>
                      </v-btn>
                      <span>Contact Contractor</span>
                    </v-tooltip>

                    <v-tooltip top v-else>
                        <v-btn dark flat slot="activator" style="height:100%;">
                          <v-layout column align-center  style="font-size:10px;">
                            <v-icon medium>chat</v-icon>
                          </v-layout>
                        </v-btn>
                        <span>Contractor Unavailable</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-layout>
          </v-flex>
          <v-flex xs12 md8>
            <v-card class="mx-2 my-2">
              <v-tabs class="pd-0" color="white" slider-color="primary" fixed centered v-model="active" >
                <v-tab class="white" href="#info-1" @click.prevent="loadTab1Charts">
                  <span style="text-transform:capitalize;">General Information</span>
                </v-tab>

                <v-tab class="white" href="#info-2" @click.native="loadTab2Charts">
                  <span style="text-transform:capitalize;">Contract Performance</span>
                </v-tab>

                <v-tab class="white" href="#info-3">
                  <span style="text-transform:capitalize;">More Information</span>
                </v-tab>

                <v-btn icon @click.native="cancel" style="float:right">
                  <v-icon dark>cancel</v-icon>
                </v-btn>
              </v-tabs>
            </v-card>
            <v-tabs-items v-model="active" >
              <v-tab-item id="info-1">  
                <v-layout row wrap>
                  <v-flex xs12 class="mx-5">
                    <span class="secondary--text title">Description</span>
                    <p v-if="item && item.companydescription && item.companydescription.trim(' ')!=''">
                        {{ item.companydescription || 'N/A'}}
                    </p>
                    <p v-else>
                        No description available
                    </p>
                  </v-flex>

                  <v-flex xs12 md6 class="text-xs-center mt-1">    
                    <p :style="{color:styles.general.theme_color_dark}" style="font-size:16px;">Contract Award Amount by Year</p>                            
                    <vue-highcharts :options="tab1chart1" class="primary--text" ref="tab1chart1ref"/>
                  </v-flex>

                  <v-flex xs12 md6 class="text-xs-center mt-1"> 
                    <p :style="{color:styles.general.theme_color_dark}" style="font-size:16px;">Contract Award Volume by Year</p>
                    <vue-highcharts :options="tab1chart2"   ref="tab1chart2ref"/>
                  </v-flex>

                  <v-flex xs12>
                    <kendo-table :url="contractActivityLink" :kendo-schema="kendoSchema" :height="200"  ></kendo-table>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item id="info-2">
                <v-layout row wrap class="text-xs-center" >
                  <v-flex xs12 md6>
                    <h6 class="subheading primary--text" :style="{color:styles.general.theme_color_dark}">Top NAICS Codes</h6>                          
                    <vue-highcharts :options="tab2chart1" class="primary--text" ref="tab2chart1ref"/>
                  </v-flex>
                      
                  <v-flex xs12 md6>
                    <h6 class="subheading primary--text" :style="{color:styles.general.theme_color_dark}">Top PSC Codes</h6>
                    <vue-highcharts :options="tab2chart1" class="primary--text" style="float:right;" ref="tab2chart2ref"/>
                  </v-flex>
                </v-layout>      
              </v-tab-item>

              <v-tab-item id="info-3">
                <v-layout row wrap class="mx-5">
                  <v-flex xs12 >
                    <span class="secondary--text title">Description</span>
                    <p v-if="item && item.companydescription && item.companydescription.trim(' ')!=''">
                        {{ item.companydescription || 'N/A'}}
                    </p>
                    <p v-else>
                        No description available
                    </p>
                  </v-flex>
                      
                  <v-flex xs12 >
                    <span class="secondary--text title">NAICS</span>
                    <p>{{ this.item.naicscodedescription || 'N/A'}}</p>
                  </v-flex>

                  <v-flex xs12 >
                    <span class="secondary--text title">PSC</span>
                    <p>{{ this.item.psccodedescription || 'N/A' }}</p>
                  </v-flex>

                  <v-flex xs12>
                    <span class="secondary--text title">Industries</span>
                    <p>{{ this.item.companyprimaryindustry || 'N/A'}}</p>
                  </v-flex>

                  <v-flex xs12 sm6 md4 >
                    <span class="secondary--text title">Contractor Type</span>
                    <p>{{ this.item.fedcontractortype || 'N/A' }}</p>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <span class="secondary--text title">Sub Contractor</span>       
                    <p>{{ this.item.subcontractor || 'N/A'}}</p>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <span class="secondary--text title">Security Clearance</span>
                    <p>{{ this.item.securityclearance || 'N/A'}}</p>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <span class="secondary--text title">Specialties</span>
                    <p>{{ this.item.specialties || 'N/A'}}</p>
                  </v-flex> 
                      
                  <v-flex xs12 sm6>
                    <span class="secondary--text title">Capabilities</span>
                    <p>{{ this.item.capabilities || 'N/A'}}</p>
                  </v-flex> 
                  <v-flex xs12>
                    <span class="secondary--text title">Capabilities Statement</span>
                    <p v-if="item && item.capabilitiesstatement">
                      <v-icon>attach_file</v-icon>
                      <a target="_blank" :href="item.capabilitiesstatement">Click here</a>
                    </p>
                    <p v-else>N/A</p>
                  </v-flex>    
                </v-layout>  
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <contractors-list-modal :dialog="listModal" :items="companyUsers"></contractors-list-modal>
  </div>    
</template>

<script>
  import VueHighcharts from 'vue2-highcharts'
  import ShareButton from '@/components/ShareButton.vue'
  import * as firebase from 'firebase'

  import KendoTable from '@/components/KendoModalTable.vue'

  import ContractorsListModal from '@/components/modal/info/contractorsListModal'

  export default {
    components: {
      VueHighcharts,
      ShareButton,
      KendoTable,
      ContractorsListModal
    },
    props: ['dialog', 'item', 'favorited'],
    data: () => {
      return {
        openModal: false,
        tab1chartref1: '',
        tab1chartref2: '',
        listModal: false,
        color: '#000',
        root: this,
        kendoSchema: [
          {
            title: 'Major Funding Agency Cat ID',
            field: 'majagencycat',
            editable: false,
            width: 250
          },
          {
            title: 'Contract Action Type',
            field: 'contractactiontype',
            editable: false,
            width: 250
          },
          {
            title: 'NAICS Description',
            field: 'naicsdescription',
            editable: false,
            width: 250
          },
          {
            title: 'PCS Description',
            field: 'pscdescription',
            editable: false,
            width: 250
          },
          {
            title: 'Vendor Name',
            field: 'vendorname',
            editable: false,
            width: 250
          },
          {
            title: 'Signed Date',
            field: 'signeddate',
            editable: false,
            format: '{0:MM-dd-yyyy}',
            width: 250
          },
          {
            title: 'Completion Date',
            field: 'currentcompletiondate',
            editable: false,
            format: '{0:MM-dd-yyyy}',
            width: 250
          },
          {
            title: 'Place Of Performance',
            field: 'placeofperformancecity',
            editable: false,
            width: 250
          },
          {
            title: 'Total Contract Value',
            field: 'totalcontractfield',
            editable: false,
            width: 250
          },
          {
            title: 'Set-aside Type',
            field: 'typeofsetaside',
            editable: false,
            width: 250
          },
          {
            title: 'Subcontract Plan',
            field: 'subcontractplan',
            editable: false,
            width: 250
          },
          {
            title: 'Transaction ID',
            field: 'uniquetransactionid',
            editable: false,
            width: 250
          },
          {
            title: 'Program Code',
            field: 'majorprogramcode',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Extent Competed',
            field: 'extentcompeted',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Created At',
            field: 'created_at',
            editable: false,
            hidden: true,
            format: '{0:MM-dd-yyyy}',
            width: 250
          },
          {
            title: 'Contract Duration',
            field: 'contractduration',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Pop County',
            field: 'popcounty',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Type of Set Aside',
            field: 'typeofsetaside',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Type of Contract Pricing',
            field: 'typeofcontractpricing',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Program Source Agency',
            field: 'progsourceagency',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Competitive Procedures',
            field: 'competitiveprocedures',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Place of Performance ZIP Code',
            field: 'placeofperformancezipcode',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Prog Source Account',
            field: 'progsourceaccount',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor State',
            field: 'vendorstate',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Contractaction Type',
            field: 'contractactiontype',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Prime Awardee Executive',
            field: 'primeawardeeexecutive',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'DUNS Number',
            field: 'dunsnumber',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Solicitation Procedures',
            field: 'solicitationprocedures',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'NAICS Code',
            field: 'naicscode',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Total Contract Value',
            field: 'totalcontractvalue',
            editable: false,
            hidden: true,
            template: d => {
              if (d.totalcontractvalue && d.totalcontractvalue !== 'N/A') {
                return `$${(d.totalcontractvalue).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`
              } else return d.totalcontractvalue
            }
          },
          {
            title: 'Fiscal Year',
            field: 'fiscalyear',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor Name',
            field: 'vendorname',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Pop State Code',
            field: 'popstatecode',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Place of Performance City',
            field: 'placeofperformancecity',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Number of Offers Received',
            field: 'numberofoffersreceived',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Parent DUNS Number',
            field: 'parentdunsnumber',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Effective Date',
            field: 'effectivedate',
            editable: false,
            hidden: true,
            format: '{0:MM-dd-yyyy}',
            width: 250
          },
          {
            title: 'Reason Not Competed',
            field: 'reasonnotcompeted',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Dollars Obligated',
            field: 'dollarsobligated',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor Address',
            field: 'vendoraddress',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Subcontract Plan',
            field: 'subcontractplan',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor County',
            field: 'vendorcounty',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Ultimate Completion Date',
            field: 'ultimatecompletiondate',
            editable: false,
            hidden: true,
            format: '{0:MM-dd-yyyy}',
            width: 250
          },
          {
            title: 'Description of Contract Requirement',
            field: 'descriptionofcontractrequirement',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Base and Exercised Options Value',
            field: 'baseandexercisedoptionsvalue',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Pop City State',
            field: 'popcitystate',
            editable: false,
            hidden: true,
            width: 250
          },
          { title: 'ID', field: 'id', editable: false, hidden: true, width: 250 },
          {
            title: 'Phone Number',
            field: 'phonenumber',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor ZIP code',
            field: 'vendorzipcode',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Current Completion Date',
            field: 'currentcompletiondate',
            editable: false,
            hidden: true,
            format: '{0:MM-dd-yyyy}',
            width: 250
          },
          {
            title: 'Vendor Street Address',
            field: 'vendorstreetaddress',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor State Code',
            field: 'vendorstatecodeid',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Multi Year Contract',
            field: 'multiyearcontract',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Solicitation ID',
            field: 'solicitationid',
            editable: false,
            hidden: true,
            width: 250
          },
          {
            title: 'Vendor City',
            field: 'vendorcity',
            editable: false,
            hidden: true,
            width: 250
          }
        ],
        prevUrl: '',
        companyExists: false,
        companyUsers: [],
        companyUsers1: [],
        active: 'info-1',
        subtab1: 'tab-1',
        contractActivityLink:
          'https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?&filter[filters][0][field]=majagencycat&filter[filters][0][operator]=like&filter[filters][0][value]=&filter[logic]=and',
        categories: ['2014', '2015', '2016', '2017', '2018'],
        contractHistory: '',
        tab1chart1: {
          credits: {
            enabled: false
          },
          chart: {
            type: 'column',
            height: 175
          },
          lang: {
            noData: 'No data to display'
          },
          legend: {
            enabled: false
          },
          xAxis: {
            lineColor: '#7f7f7f',
            tickWidth: 0,
            categories: ['2014', '2015', '2016', '2017', '2018']
          },
          yAxis: {
            visible: false
          },
          tooltip: {
            shared: true,
            formatter: function () {
              return `Award Amount $${(this.y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`
            },
            valueDecimals: 2
          },
          plotOptions: {
            column: {
              className: 'highcharts-fill-color',
              dataLabels: {
                enabled: true,
                crop: false,
                overflow: 'none',
                color: '#7f7f7f',
                formatter: function () {
                  if (this.y !== 0) {
                    return '$' + (this.y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
                  }
                }
              }
            }
          },
          title: {
            text: ''
          },
          series: []
        },
        tab1chart2: {
          credits: {
            enabled: false
          },
          chart: {
            type: 'column',
            height: 175
          },
          lang: {
            noData: 'No data to display'
          },
          legend: {
            enabled: false
          },
          tooltip: {
            shared: true,
            formatter: function () {
              return `Award Amount ${(this.y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`
            },
            valueDecimals: 2
          },
          xAxis: {
            lineColor: '#7f7f7f',
            tickWidth: 0,
            categories: ['2014', '2015', '2016', '2017', '2018']
          },
          yAxis: {
            visible: false
          },
          plotOptions: {
            column: {
              className: 'highcharts-fill-color',
              dataLabels: {
                enabled: true,
                crop: false,
                overflow: 'none',
                color: '#7f7f7f',
                formatter: function () {
                  if (this.y !== 0) {
                    return (this.y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
                  }
                }
              }
            }
          },
          title: {
            text: ''
          },
          series: []
        },
        tab2chart1: {
          credits: {
            enabled: false
          },
          chart: {
            type: 'column',
            height: 150,
            inverted: true
          },
          lang: {
            noData: 'No data to display'
          },
          legend: {
            enabled: false
          },
          tooltip: {
            shared: true,
            formatter: function () {
              return `Award Amount $${(this.y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`
            },
            valueDecimals: 2
          },
          xAxis: {
            lineColor: '#7f7f7f',
            tickWidth: 0
          },
          yAxis: {
            visible: false
          },
          plotOptions: {
            column: {
              className: 'highcharts-fill-color',
              dataLabels: {
                enabled: true,
                crop: false,
                overflow: 'none',
                color: '#7f7f7f',
                formatter: function () {
                  if (this.y !== 0) {
                    return '$' + (this.y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
                  }
                }
              }
            }
          },
          title: {
            text: ''
          },
          series: []
        }
      }
    },
    watch: {
      contractActivityLink (val) {
        this.contractHistory = val
      },
      openModal (val) {
        let self = this
        self.companyUsers = []
        self.companyUsers1 = []
        firebase
          .database()
          .ref('users')
          .orderByChild('cid')
          .equalTo(this.item._id)
          .on('child_added', function (snapshot) {
            if (snapshot.val().uid !== self.userDetails.uid) {
              self.companyUsers1.push(snapshot.val())
            }
          })
        self.companyUsers = {
          data: self.companyUsers1,
          pageSize: 10
        }
        if (val) {
          this.prevUrl = window.location.href
          history.replaceState(null, null, '/contractors#id=' + this.item._id)
          this.contractActivityLink =
            'https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?&filter[filters][0][field]=dunsnumber&filter[filters][0][operator]=like&filter[filters][0][value]=' +
            this.item.dunsnumber +
            '&filter[logic]=and'
        } else {
          history.replaceState(null, null, this.prevUrl)
        }
      },
      active (val) {}
    },
    mounted () {
      this.tab1chart1.plotOptions.column.color = this.styles.general.theme_color_light
      this.subtab1 = 'tab-1'
      this.$on('cancel', () => {
        this.listModal = false
        this.dialog = true
      })
    },
    methods: {
      cancel () {
        history.replaceState(null, null, this.prevUrl)
        this.openModal = false
        this.listModal = false
        this.$parent.$emit('cancel')
      },
      contact () {
        this.listModal = true
      },
      favoriteItem () {
        let favoritePayload = {
          [this.item._id]: this.item._id
        }
        this.$firebase.database().ref(`favorites/directory/${this.userDetails.uid}/${this.item._id}`).set(favoritePayload)
      },
      unfavoriteItem () {
        this.$firebase.database().ref(`favorites/directory/${this.userDetails.uid}/${this.item._id}`).set(null)
      },
      loadTab1Charts () {
        const tab1chart1ref = this.$refs.tab1chart1ref
        const tab1chart2ref = this.$refs.tab1chart2ref
        var self = this
        tab1chart1ref.delegateMethod('showLoading', 'Loading...')
        tab1chart2ref.delegateMethod('showLoading', 'Loading...')
        this.$store
          .dispatch('getContractVolumeHistory', {
            dunsnumber: parseInt(this.item.dunsnumber)
          })
          .then(res => {
            this.$store
              .dispatch('getCompanyAwardHistory', {
                dunsnumber: parseInt(this.item.dunsnumber)
              })
              .then(res => {
                self.renderTab1Charts()
                tab1chart1ref.hideLoading()
                tab1chart2ref.hideLoading()
              })
          })
      },
      loadTab2Charts () {
        this.subtab1 = 'tab-2'

        const tab2chart1ref = this.$refs.tab2chart1ref
        const tab2chart2ref = this.$refs.tab2chart2ref
        var self = this
        tab2chart1ref.delegateMethod('showLoading', 'Loading...')
        tab2chart2ref.delegateMethod('showLoading', 'Loading...')
      /* this.$store.dispatch('getAwardAmountAgency', { dunsnumber: parseInt(this.item.dunsnumber) })
                    .then(res => {
                        self.renderTab2Charts()
                        tab2chart1ref.hideLoading()

                    }) */
        this.$store
          .dispatch('fetchTopNAICSCodes', {
            dunsnumber: parseInt(this.item.dunsnumber)
          })
          .then(res => {
            self.renderTab2Chart1()
            tab2chart1ref.hideLoading()
          })
        this.$store
          .dispatch('fetchTopPSCCodes', {
            dunsnumber: parseInt(this.item.dunsnumber)
          })
          .then(res => {
            self.renderTab2Chart2()
            tab2chart2ref.hideLoading()
          })
      },
      renderTab1Charts () {
        var self = this
        const tab1chart1ref = this.$refs.tab1chart1ref
        const tab1chart2ref = this.$refs.tab1chart2ref

        tab1chart1ref.removeSeries()
        tab1chart2ref.removeSeries()

        tab1chart1ref
          .getChart()
          .xAxis[0].setCategories(
            Object.keys(self.awardAmountHistory.amount_history)
          )
        tab1chart2ref
          .getChart()
          .xAxis[0].setCategories(
            Object.keys(self.contractVolumeHistory.contract_volume_history)
          )
        tab1chart1ref.addSeries({
          data: Object.values(self.awardAmountHistory.amount_history)
        })
        tab1chart2ref.addSeries({
          data: Object.values(self.contractVolumeHistory.contract_volume_history)
        })
      },
      renderTab2Chart2 () {
        const tab2chart2ref = this.$refs.tab2chart2ref

        var data = this.topPSCCodes
        var topPscLabels = []
        var topPscData = []
        for (var i in data.content) {
          topPscLabels.push(data.content[i]['psc_code'])
          topPscData.push(data.content[i]['award_amount'])
        }

        tab2chart2ref.removeSeries()

        tab2chart2ref.getChart().xAxis[0].setCategories(topPscLabels)

        tab2chart2ref.addSeries({
          data: Object.values(topPscData)
        })
      },
      renderTab2Chart1 () {
        const tab2chart1ref = this.$refs.tab2chart1ref

        var data = this.topNAICSCodes
        var topNaicsLabels = []
        var topNaicsData = []
        for (var i in data.content) {
          topNaicsLabels.push(data.content[i]['naics_code'])
          topNaicsData.push(data.content[i]['award_amount'])
        }

        tab2chart1ref.removeSeries()

        tab2chart1ref.getChart().xAxis[0].setCategories(topNaicsLabels)

        tab2chart1ref.addSeries({
          data: topNaicsData
        })
      }
    },
    computed: {
      dialogFetch () {
        this.openModal = this.dialog
        this.active = 'info-1'
        var self = this
        setTimeout(() => {
          this.loadTab1Charts()
        }, 500)
        self.companyUsers = []
        this.contractActivityLink =
          'https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?&filter[filters][0][field]=dunsnumber&filter[filters][0][operator]=like&filter[filters][0][value]=' +
          this.item.dunsnumber +
          '&filter[logic]=and'
        return this.dialog
      },
      screenWidth () {
        return Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        )
      },
      styles () {
        return this.$store.getters.getStyles
      },
      userDetails () {
        return this.$store.getters.getUserDetails
      },
      awardAmountHistory () {
        return this.$store.getters.getCompanyAwardHistory
      },
      contractVolumeHistory () {
        return this.$store.getters.getContractVolumeHistory
      },
      awardAmountAgency () {
        return this.$store.getters.getAwardAmountAgency
      },
      topNAICSCodes () {
        return this.$store.getters.getTopNAICSCodes
      },
      topPSCCodes () {
        return this.$store.getters.getTopPSCCodes
      },
      shareLink () {
        return window.location
      }
    }
  }
</script>
<style scoped>
.tabs__wrapper--scrollable {
  overflow: hidden;
}
.vue-highcharts {
  border: none;
  box-shadow:none;
}
.tabs__content {
  height: 500px;
  overflow-x:hidden;
  overflow-y: scroll;
}
</style>
