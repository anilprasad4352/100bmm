<template>
  <form @submit.prevent="onSave()">
    <v-layout row wrap>
      <v-flex x12 sm6 md4>
        <v-text-field label="Company Name:" readonly :placeholder="CompanyInfoForm.companylegalname" auto-grow class="pr-2" required></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="Address Line 1:" placeholder="Address1" v-model="CompanyInfoForm.addressline1" auto-grow class="pr-2" required :disabled="readonly"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="Address Line 2:" placeholder="Address2" v-model="CompanyInfoForm.addressline2" auto-grow class="pr-2" :disabled="readonly"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="City:" placeholder="city" v-model="CompanyInfoForm.city" auto-grow class="pr-2" required :disabled="readonly"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="County:" placeholder="county" v-model="CompanyInfoForm.county" auto-grow class="pr-2" required :disabled="readonly"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="Zip:" placeholder="zip" v-model="CompanyInfoForm.zip" auto-grow class="pr-2" required :disabled="readonly"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-select v-bind:items="['AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY']"
          class="pr-2 mt-0" v-model="CompanyInfoForm.state" required label="State:" :disabled="readonly"></v-select>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field :placeholder="CompanyInfoForm.businesswebsite" :disabled="readonly" label="Company Website:" v-model="CompanyInfoForm.businesswebsite" auto-grow required class="pr-2"></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="Public Contact Phone Number:" :disabled="readonly" placeholder="Phone Number" v-model="CompanyInfoForm.phonenumber" class="pr-2" required></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <v-text-field label="Public contact Email Address:" :disabled="readonly" :placeholder="user.email" class="pr-2" readonly required></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field label="Description:" placeholder="Description" :disabled="readonly" v-model="CompanyInfoForm.companydescription" class="pr-2" required></v-text-field>
      </v-flex>
      <v-flex xs12 id="await_p" style="display:none;">
        <p style="text-align:center;color:red;">You have already entered a company. It is awaiting moderation.</p>
      </v-flex>
    </v-layout>
    <v-btn primary id="next" v-if="saved" @click="onNext()">Next</v-btn>
    <v-btn primary secondary type="submit" id="savenext" v-if="!readonly">Save</v-btn>
  </form>
</template>

<script>
 import axios from "axios";
 import _ from "lodash";
  const googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyBCkHJdW4ChFLJ8cqJghc-LlhVU_FAl5G0"
  });
  export default {
    props: ['mode', 'element','readonly'],
    data() {
      return {        
      }
    },
    computed: {
      saved: {
        get() {
          const companyDetails = this.$store.getters.getUserCompanySubmission
          return companyDetails.companyinfo ? true: false
        },
        set(val) {
          return val
        }
      },
      user() {
        return this.$store.getters.getUserDetails
      },
      CompanyInfoForm() {
        let self = this
        const companyDetails = this.$store.getters.getCompanyDetails
        const userCompanySubmission = this.$store.getters.getUserCompanySubmission
        if (userCompanySubmission && userCompanySubmission.companyinfo && userCompanySubmission.submitted === true) {
          return userCompanySubmission
          alert('ads')
        }
        else if (companyDetails && companyDetails.companyinfo) 
          return companyDetails
        
        return {
          companylegalname: companyDetails ? companyDetails.companylegalname : '',
          addressline1: companyDetails.addressline1 ? companyDetails.addressline1 : '',
          addressline2: companyDetails.addressline2 ? companyDetails.addressline2 : '',
          city: companyDetails.city ? companyDetails.city : '',
          county: companyDetails ? companyDetails.county : '',
          zip: companyDetails.zip ? companyDetails.zip : '',
          state: companyDetails.state ? companyDetails.state : 'GA',
          businesswebsite: companyDetails.businesswebsite ? companyDetails.businesswebsite : '',
          phonenumber: companyDetails.phonenumber ? companyDetails.phonenumber : '',
          email: this.user.email,
          companydescription: companyDetails.companydescription ? companyDetails.companydescription : '',
        }
      }
    },
    methods: {
      onNext() {
        this.$emit('next')
      },
	  geocode(address, cb) {
        return googleMapsClient.geocode(
          {
            address
          },
          cb
        );
      },
      onSave() {
        var company = this.user.cid
        //console.log(this.user)
        var details = {
          companylegalname: this.CompanyInfoForm.companylegalname,
          addressline1: this.CompanyInfoForm.addressline1,
          addressline2: this.CompanyInfoForm.addressline2,
          city: this.CompanyInfoForm.city,
          county: this.CompanyInfoForm.county,
          zip: this.CompanyInfoForm.zip,
          state: this.CompanyInfoForm.state,
          businesswebsite: this.CompanyInfoForm.businesswebsite,
          phonenumber: this.CompanyInfoForm.phonenumber,
          email: this.CompanyInfoForm.email,
          companydescription: this.CompanyInfoForm.companydescription,
        }
        //details.companylegalname = this.user.companylegalname
        details.verified = false
        details.rejected = false
        details.submitted = false
        if (details.state === 'GA') {
          details.stateflag = 'https://firebasestorage.googleapis.com/v0/b/defense-exchange.appspot.com/o/misc%2Fga-green-sm.png?alt=media&token=f8d459ed-df9d-4dd4-8e38-cb52a678851e'
        }
        else {
          details.stateflag = ''
        }
        details.companyinfo = true
		    if(details.addressline2){
          details.streetaddress = details.addressline1 +', '+ details.addressline2 + ', '+details.city+', '+details.state+', '+details.zip
		    }else{
		      details.streetaddress = details.addressline1 + ', '+details.city+', '+details.state+', '+details.zip
    		}
              new Promise(resolve => {
                if (details.streetaddress != "") {
                  this.geocode(details.streetaddress, (err, res) => {
                    if (err) {
                      resolve({
                        lat: null,
                        lng: null
                      });
                    } else {
                      try {
                        const location = res.json.results[0].geometry.location;
                        resolve(location);
                      } catch (e) {
                        resolve({
                          lat: null,
                          lng: null
                        });
                      }
                    }
                  });
                } else {
                  resolve({
                    lat: null,
                    lng: null
                  });
                }
              }).then(locations => {
          details.longitude=locations.lng
		  details.latitude=locations.lat
        });
          
        
		
		 
        details.submitby = this.user.uid
        console.log(details)
        var updates = {}
        updates[`companies_submission/${company}/${this.user.uid}`] = details
        this.$firebase.database().ref().update(updates)
          .then(() => {
            this.saved = true
            this.$store.dispatch('fetchUserCompanySubmission')
            this.$emit('next')
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