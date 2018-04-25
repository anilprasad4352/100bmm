<template>
<div>
  <v-dialog v-model="openModal" lazy max-width="700px" persistent :fullscreen="screenWidth<600" transition="scale-transition">
    <v-card>
      <v-tabs class="pd-0" dark fixed centered v-model="active">
          <v-tabs-bar class="header primary">
            <v-tabs-slider class="white"></v-tabs-slider>
             <v-tabs-item
              href="#info-1"
            >
              Basic details
            </v-tabs-item>
            <v-tabs-item
              href="#info-2"
            >
              Description
            </v-tabs-item>
            <v-btn icon @click.native="cancel" style="float:right">
                <v-icon dark>cancel</v-icon>
            </v-btn>
          </v-tabs-bar>
        <v-card-text style="max-height:500px;overflow:auto;">
          <v-tabs-content id="info-1">
            <v-layout row wrap>
                <v-flex md12 xs12 class="mb-3">
                    <span style="font-size: 16px"><b>{{ item && item.title ? item.title : '' }}</b></span>
                </v-flex> 
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Created: </b>{{ item ?  formatDate(item.created): '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Requirement : </b>{{ item ? item.new_requirement : '' }}</span>
                    </div>
                </v-flex>
               <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Agency: </b>{{ item ? item.agency : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Type : </b>{{ item ? item.contract_type : '' }}</span>
                    </div>
                </v-flex>
               <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Organization : </b>{{ item ? item.organization : '' }}</span>
                    </div>
                </v-flex>
                 <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Contract Type : </b>{{ item ? item.contract_type : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Award status		 : </b>{{ item ? item.award_status		 : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Funding Source : </b>{{ item ? item.funding_source : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Incumbent Name : </b>{{ item ? (item.incumbent_name != 'null'? item.incumbent_name: 'N/A ') : '' }}</span>
                    </div>
                </v-flex>
                
                
                  <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>NAICS Code	 : </b>{{ item ? item.naicscode	 : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md12 xs12 class="mb-3">
                    <div>
                        <span><b>Dollar value min : </b>{{ item ? '$' + item.dollar_value_min : '' }}</span>
                    </div>
                </v-flex>
                 <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Dollar value max	 : </b>{{ item ?'$' + item.dollar_value_max	 : '' }}</span>
                    </div>
                </v-flex>
                 <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Point of contact name : </b>{{ item ? item.point_of_contact_name		 : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Estimated fiscal year : </b>{{ item ? item.estimated_fiscal_year			 : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Point of contact email	: </b>{{ item ? item.point_of_contact_email			 : '' }}</span>
                    </div>
                </v-flex>
                <v-flex md12 xs12 class="mb-3">
                    <div>
                        <span><b>Estimated fiscal year quarter	: </b>{{ item ? item.estimated_fiscal_year_quarter			 : '' }}</span>
                    </div>
                </v-flex>
                 
                
              <v-flex md6 xs12 class="mb-3">
                <div>
                  <span><b>Estimated Fiscal year: </b>{{ item && item.estimated_fiscal_year ? item.estimated_fiscal_year : ''  }}</span>
                </div>
              </v-flex>
              
                  <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Place of performance city	: </b>{{ item ? item.place_of_performance_city	 : '' }}</span>
                    </div>
                </v-flex>
                  <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>Advisor name	: </b>{{ item ? item.advisor_name	 : '' }}</span>
                    </div>
                </v-flex>
                  <v-flex md6 xs12 class="mb-3">
                    <div>
                        <span><b>place of performance state	: </b>{{ item ? item.place_of_performance_state	 : '' }}</span>
                    </div>
                </v-flex>

            </v-layout>
          </v-tabs-content>
          <v-tabs-content
            id="info-2"
          >
            <v-layout row wrap>
                <v-flex md12 xs12 class="mb-3">
                    <span style="font-size: 16px"><b>{{ item && item.title ? item.title: '' }}</b></span>
                </v-flex>
              <v-flex md6 xs12 class="mb-3">
                <span><b>id: </b>{{ item && item.id	  ? item.id	 : '' }}</span>
                </v-flex>
              <v-flex md12 xs12 class="mb-3">
                <div>
                  <span><b>Description: </b>{{ item && item.description  ? item.description : '' }}</span>
                </div>
              </v-flex>

            </v-layout>
          </v-tabs-content>
        </v-card-text>
      </v-tabs>
      <v-card-actions class="grey lighten-2">
        <v-layout justify-space-around >
            <span class="group">
                <!--<v-tooltip top v-if="!tracked">
                    <v-btn flat slot="activator" @click.prevent="trackItem(true)" v-if="!tracked"><v-icon medium>notifications</v-icon></v-btn>
                    <span>Track</span>
                </v-tooltip>

                <v-tooltip top v-if="tracked">
                    <v-btn flat slot="activator"><v-icon medium color="grey" @click.prevent="trackItem(false)">notifications</v-icon></v-btn>
                    <span>Remove Track</span>
                </v-tooltip>
                -->
                <share-button :link="shareLink"></share-button>
            
                <v-tooltip top v-if="item && item.point_of_contact_email	 && item.point_of_contact_email	.length > 6">
                    <v-btn :href="'mailto:' + item.point_of_contact_email	" flat slot="activator"><v-icon medium>email</v-icon></v-btn>
                    <span>Contact Contract Officer</span>
                </v-tooltip>
                <v-tooltip top v-if="item && item.point_of_contact_email.length <= 5">
                    <v-btn disabled flat slot="activator"><v-icon medium>email</v-icon></v-btn>
                    <span>Contract Officer email not available</span>
                </v-tooltip>
                <v-tooltip top>
                    <v-btn flat slot="activator" @click.native="find"><v-icon medium>search</v-icon></v-btn>
                    <span>Find Contractor</span>
                </v-tooltip>
            </span>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <find-contractor-modal :item="item" :dialog="findContractorDialog"></find-contractor-modal>
</div>
</template>

<style>
    .group {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -ms-flex-pack: distribute;
        justify-content: space-around;
    }
</style>


<script>
import 'mdi/css/materialdesignicons.min.css'
import ShareButton from '@/components/ShareButton.vue'
import FindContractorModal from '@/components/modal/findContractorModal.vue'
    export default {
        components : {
            ShareButton,
            FindContractorModal
        },
        props: ['dialog', 'item'],
        data () {
            return {
                openModal: this.$props.dialog,
                active: '',
                items: [
                    {
                        id: 1,
                        text: 'Basic details'
                    },
                    {
                        id: 2,
                        text: 'Description'
                    }
                ],
                shareLink: '',
                findContractorDialog: false,
            }
        },
        watch: {
            dialog () {
                this.openModal = this.dialog
                this.active = 'info-1'
            }
        },
        methods: {
            cancel () {
                this.openModal = false
                this.$parent.$emit('cancel')
            },
            trackItem (val) {
                var self= this
                var id = this.item.solicitationnumber
                var payload = {
                    type: 'forecast',
                    id: id,
                    uid: this.userDetails.uid,
                    value: !self.tracked,
                    keyword: 'track'
                }

                this.$store.dispatch('favoriteItem', payload)
            },
            formatDate(val) {
                var d = (new Date(val))
                return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
            },
            find() {
                this.findContractorDialog = true
                this.dialog = false
            }
        },
        mounted () {
            var self = this
            this.$on('cancel', () => {
                self.findContractorDialog = false
                self.dialog = true

            })
        },
        computed: {
            screenWidth () {
                return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
            }
        }
    }
</script>
