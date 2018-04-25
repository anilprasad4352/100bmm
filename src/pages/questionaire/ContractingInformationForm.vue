<template>

  <v-form @submit.prevent="onNext()">
    <v-layout row wrap>
      <v-flex xs6 sm3 md3>
        <v-text-field
          label="DUNS Number"
          class="pr-2"
          :rules="[() => ContractingInfoForm.dunsnumber.length > 9 ? 'You can only add 9 characters' : true, () => ContractingInfoForm.dunsnumber.length < 9 ? 'Must be of 9 digits' : true]"
          v-model="ContractingInfoForm.dunsnumber"
          required
          :disabled="readonly"
          placeholder="DUNS">

        </v-text-field>
      </v-flex>
      <v-flex xs6 sm3 md3>
        <v-text-field
          label="CAGE ID"
          class="pr-2"
          v-model="ContractingInfoForm.cagecode"
          required
          :disabled="readonly"
          placeholder="CAGE ID">
        </v-text-field>
      </v-flex>
      <v-flex xs6 sm3 md3>
        <v-select
          v-bind:items="['Yes','No']"
          class="pr-2 mt-0"
          v-model="ContractingInfoForm.fedcontractor"
          required
          :disabled="readonly"
          label="Federal Contractor?"
        ></v-select>
      </v-flex>
      <v-flex xs6 sm3 md3>
        <v-select
          v-bind:items="federalContractorType"
          class="pr-2 mt-0"
          v-model="ContractingInfoForm.fedcontractortype"
          required
          :disabled="readonly"
          label="Federal Contractor Type"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm3 md3>
        <v-select
          v-bind:items="['None','TOP SECRET','SECRET','CONFIDENTIAL','FACILITY','Q Clearance','L Clearance']"
          class="pr-2 mt-0"
          v-model="ContractingInfoForm.securityclearance"
          required
          :disabled="readonly"
          label="Security Clearance"
        ></v-select>
      </v-flex>
      <v-flex xs6 sm4 md9>
        <v-select
          v-bind:items="certifications"
          class="pr-2 mt-0"
          multiple
          chips
          :rules="[() => ContractingInfoForm.companycertifications.length > 5 ? 'You can only add five certifications' : true]"
          v-model="ContractingInfoForm.companycertifications"
          required
          :disabled="readonly"
          label="Small Busines (SBA) Certifications"
        />
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6 sm4 md4>
        <v-select
          v-bind:items="primaryIndustry"
          class="pr-2 mt-0"
          no-data-text='Type to add data'
          v-if="!otherPrimaryIndustry.length"
          v-model="ContractingInfoForm.companyprimaryindustry"
          required
          :disabled="readonly"
          label="Primary Industry"
        >
        </v-select>
        <v-text-field
          label="Enter Primary Industry"
          class="pr-2"
          no-data-text='Type to add data'
          v-show="ContractingInfoForm.companyprimaryindustry === 'Other'"
          v-model="otherPrimaryIndustry"
          :disabled="readonly"
          placeholder="Primary Industry">
        </v-text-field>
      </v-flex>
      <v-flex xs6 sm4 md4>
        <v-select
          :items="naicscodes"
          cache-items
          :loading="loading"
          no-data-text='Type to add data'
          :search-input.sync="naicsSearch"
          autocomplete
          class="pr-2 mt-0"
          v-model="ContractingInfoForm.primarynaicscode"
          required
          :disabled="readonly"
          label="Primary NAICS Codes"
        >
        </v-select>
      </v-flex>
      <v-flex xs6 sm4 md4>
        <v-select
          :disabled="readonly"
          v-bind:items="psccodes"
          cache-items
          :loading="loading"
          no-data-text='Type to add data'
          :search-input.sync="pscSearch"
          autocomplete
          class="pr-2 mt-0"
          v-model="ContractingInfoForm.primarypsccode"
          required
          label="Primary PSC Codes"
        >
        </v-select>
      </v-flex>
       <v-flex xs6 sm4 md3>
        <v-select
          :items="naicscodes"
          cache-items
          :loading="loading"
          no-data-text='Type to add data'
          :search-input.sync="additionalNaicsSearch"
          autocomplete
          :rules="[() => ContractingInfoForm.additionalnaicscodes.length > 5 ? 'You can only add five codes' : true]"
          multiple
          :disabled="readonly"
          class="pr-2 mt-0"
          v-model="ContractingInfoForm.additionalnaicscodes"
          label="Additional NAICS Codes"
          chips
        >
        </v-select>
      </v-flex>
      <v-flex xs6 sm4 md3>
        <v-select
          v-bind:items="psccodes"
          cache-items
          :loading="loading"
          no-data-text='Type to add data'
          multiple
          :disabled="readonly"
          :rules="[() => ContractingInfoForm.additionalpsccodes.length > 5 ? 'You can only add five codes' : true]"
          autocomplete
          :search-input.sync="additionalPscSearch"
          v-model="ContractingInfoForm.additionalpsccodes"
          label="Additional PSC Codes"
          class="pr-2 mt-0"
          chips
        >
        </v-select>
      </v-flex>
    </v-layout>
    <v-btn success @click.native="onPrevious">Previous</v-btn>
    <v-btn primary id="next" v-if ="saved" @click="$emit('next')">Next</v-btn>
    <v-btn primary secondary type="submit" v-if="!readonly">Save</v-btn>
  </v-form>

</template>

<script>
  import axios from 'axios'
export default {
    props: ['mode', 'element', 'company','readonly'],
    data () {
       return {
        otherPrimaryIndustry: '',
        naicscodes: [],
        psccodes: [],
        naicsSearch: null,
        additionalPscSearch: null,
        pscSearch: null,
        additionalNaicsSearch: null,
        loading: false,
        federalContractorType: [
          'Prime',
          'Sub',
          'Both'
        ],
        certifications: [
          'Total Small Business',
          'Competitive 8(a)',
          'Veteran-Owned Small Business',
          'Service-Disabled Veteran-Owned Small Business',
          'Woman Owned Small Business',
          'Economically Disadvantaged Woman Owned Small Business',
          'Indian Small Business Economic Enterprises',
          'Indian Economic Enterprises',
          'Emerging Small Business',
          'Partial Small Business',
          'Very Small Business',
          'Partial HBCU / MI',
          'Total HBCU / MI'
        ],
        primaryIndustry: [
          'Aerospace',
          'Agribusiness',
          'Construction',
          'Defense',
          'Finance',
          'Information Technology',
          'Logistics',
          'Manufacturing',
          'R&D',
          'Retail',
          'Service',
          'Surplus Dealer',
          'Telecommunications',
          'Wholesale',
          'Other'
        ],
        additionalnaicscodes: [],
        primarynaicscode: []
      }
    },
	watch: {
      otherPrimaryIndustry (val) {
        if (val.length) {
          this.ContractingInfoForm.primaryIndustry = val
        }
      },
      pscSearch (val) {
        val && this.queryPscCodes(val)
      },
      additionalPscSearch (val) {
        val && this.queryPscCodes(val)
      },
      naicsSearch (val) {
        val && this.queryNaicsCodes(val)
      },
      additionalNaicsSearch (val) {
        val && this.queryNaicsCodes(val)
      }
    },
    computed: {
      saved: {
	      get () {
          const companyDetails = this.$store.getters.getUserCompanySubmission
          return companyDetails.contractinginfo ? true : false
        },
        set (val) {
          return val
        }
       },
      user () {
        return this.$store.getters.getUserDetails
      },
      ContractingInfoForm () {
	      
          const companyDetails = this.$store.getters.getCompanyDetails
          const userCompanySubmission = this.$store.getters.getUserCompanySubmission
          if (userCompanySubmission && userCompanySubmission.contractinginfo && userCompanySubmission.submitted === true) {
            const data = Object.assign({}, userCompanySubmission, {
              companycertifications: userCompanySubmission.companycertifications.split(','),
              additionalnaicscodes: userCompanySubmission.additionalnaicscodes.split(','),
              additionalpsccodes: userCompanySubmission.additionalpsccodes.split(','),
              primarynaicscode: userCompanySubmission.primarynaicscode
            })
            this.queryNaicsCodes(userCompanySubmission.primarynaicscode)
            userCompanySubmission.additionalnaicscodes.split(',').forEach(value => {
              this.queryNaicsCodes(value)
            })
            this.queryPscCodes(userCompanySubmission.primarypsccode)
            userCompanySubmission.additionalpsccodes.split(',').forEach(value => {
              this.queryPscCodes(value)
            })
            return data
          }
          else if (companyDetails && companyDetails.contractinginfo) {
            const data = Object.assign({}, companyDetails, {
              companycertifications: companyDetails.companycertifications.split(','),
              additionalnaicscodes: companyDetails.additionalnaicscodes.split(','),
              additionalpsccodes: companyDetails.additionalpsccodes.split(','),
              primarynaicscode: companyDetails.primarynaicscode
            })
            this.queryNaicsCodes(companyDetails.primarynaicscode)
            companyDetails.additionalnaicscodes.split(',').forEach(value => {
              this.queryNaicsCodes(value)
            })
            this.queryPscCodes(companyDetails.primarypsccode)
            companyDetails.additionalpsccodes.split(',').forEach(value => {
              this.queryPscCodes(value)
            })
            return data
          }
          return {
            dunsnumber: '',
            cagecode: '',
            companycertifications: [],
            fedcontractor: '',
            fedcontractortype: '',
            companyprimaryindustry: '',
            primarypsccode: '',
            securityclearance: '',
            smallbusiness: false,
            womanowned: false,
            additionalpsccodes: [],
            minorityowned: false,
            certified8a: false,
            additionalnaicscodes: [],
            veteranowned: false,
            primarynaicscode: []
          }
		  }
      
    },
    methods: {
      queryNaicsCodes (val) {
        this.loading = true
        const self = this
        return axios.get(`https://fed-exchange-api.herokuapp.com/api/v2.0/codes?type=naics&search=${val}`)
          .then(res => {
            // eslint-disable-next-line
            let i 
            this.loading = false
            for (i = 0; i < res.data.count; i++) {
              self.naicscodes.push(res.data.data[i].naicscode)
            }
          })
      },
      queryPscCodes (val) {
        this.loading = true
        const self = this
        return axios.get(`https://fed-exchange-api.herokuapp.com/api/v2.0/codes?type=psc&search=${val}`)
          .then(res => {
            let i
            this.loading = false
            for (i = 0; i < res.data.count; i++) {
              self.psccodes.push(res.data.data[i].psccode)
            }
          })
      },
      onPrevious () {
        this.$emit('previous')
      },
      onNext() {
        if (!this.readonly) {
          this.onSave()
        }
        this.$emit('next')
      },
      onSave () {       
       var company = this.user.cid.toString()
        var details = {
          dunsnumber: this.ContractingInfoForm.dunsnumber,
          cagecode: this.ContractingInfoForm.cagecode,
          fedcontractor: this.ContractingInfoForm.fedcontractor,
          fedcontractortype: this.ContractingInfoForm.fedcontractortype,
          companyprimaryindustry: this.ContractingInfoForm.companyprimaryindustry,
          securityclearance: this.ContractingInfoForm.securityclearance,
          smallbusiness: this.ContractingInfoForm.smallbusiness,
          companycertifications: this.ContractingInfoForm.companycertifications.toString(),
          womanowned: this.ContractingInfoForm.womanowned,
          primarypsccode: this.ContractingInfoForm.primarypsccode,
          minorityowned: this.ContractingInfoForm.minorityowned,
          additionalpsccodes: this.ContractingInfoForm.additionalpsccodes.toString(),
          certified8a: this.ContractingInfoForm.certified8a,
          additionalnaicscodes: this.ContractingInfoForm.additionalnaicscodes.toString(),
          veteranowned: this.ContractingInfoForm.veteranowned,
          primarynaicscode: this.ContractingInfoForm.primarynaicscode
        }
        details.verified = false
        details.submitted = false
        details.rejected = false
        details.contractinginfo = true
        details.submitby = this.user.uid
		 var updates = {}
		// updates[] = 
        this.$firebase.database().ref(`companies_submission/${company}/${this.user.uid.toString()}/`).update(details)
          .then(() => {
            this.saved = true
            this.$store.dispatch('fetchUserCompanySubmission')
            let snackbar = {
              active: true,
              text: 'Saved data'
            }
            this.$store.dispatch('triggerSnackbar', snackbar)
            setTimeout(() => {
              let snackbar = {
                active: false,
                text: ''
              }
            
              this.$store.dispatch('triggerSnackbar', snackbar)
            }, 2000)
          })
          .catch(
            error => {
              console.log(error)
            }
          )
      }
    }
  }
</script>
