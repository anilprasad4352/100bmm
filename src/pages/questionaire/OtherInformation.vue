<template>
  <v-form @submit.prevent="onSave()">
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field
          label="Specialties:"
          placeholder="Enter Specialties:"
          v-model="OtherInfoForm.specialties"
          required
          :disabled="readonly"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
          label="Capabilities:"
          placeholder="Enter Capabilities:"
          v-model="OtherInfoForm.capabilities"
          required
          :disabled="readonly"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <p style="font-size: medium">Upload Capibilities Statement
          <v-btn
            label="Upload"
            :disabled="readonly"
            @click.prevent = "statementUploaded = true"
            class="ml-5"
          >Upload</v-btn>
          <caption style="width:auto">{{statementFileName}}</caption>


          <file-upload :trigger="statementUploaded" @cancel="statementUploaded=false;statementFile=''"
                       :formats="['docx','doc','pdf']" v-model="statementFile"
                       @confirm="statementFileName=statementFile[0].name;statementUploaded=false"></file-upload>

        </p>


      </v-flex>

      <v-flex xs12>
        <p style="font-size: medium">Upload Company Logo
          <v-btn
            label="Upload"
            :disabled="readonly"
            @click.prevent = "logoUploaded = true"
            class="ml-5"
          >Upload</v-btn>
          <caption>{{logoFileName}}</caption>

          <file-upload :trigger="logoUploaded" @cancel="logoUploaded=false;logoFile=''" :formats="['jpeg','png','jpg']" v-model="logoFile" @confirm="logoFileName=logoFile[0].name;logoUploaded=false"></file-upload>
        </p>

      </v-flex>
    </v-layout>
    <v-btn success @click.native="onPrevious">Previous</v-btn>
    <v-btn type="submit" secondary success v-if="!readonly">Save</v-btn>
    <v-btn @click="submitCompany()" primary v-if="!readonly && this.userCompanySubmission.companyinfo && this.userCompanySubmission.contractinginfo && this.userCompanySubmission.otherinfo ">Submit</v-btn>
  </v-form>
</template>

<script>
  import FileUpload from '../../components/FileUploadComponent.vue'
  import moment from 'moment'
  export default {
    components: {
      FileUpload
    },
    data () {
      return {
        logoUploaded: false,
        statementUploaded: false,
        logoFile: '',
        statementFile: '',
        statementFileName: '',
        logoFileName: ''
      }
    },
    watch: {
      userCompanySubmission (val) {
      }
    },
    computed: {
      userCompanySubmission () {
        return this.$store.getters.getUserCompanySubmission
      },	
      OtherInfoForm () {
        const companyDetails = this.$store.getters.getCompanyDetails
        
        if (this.userCompanySubmission && this.userCompanySubmission.otherinfo && this.userCompanySubmission.submitted === true) {
          let data = {}
          data.specialties = this.userCompanySubmission.specialties
          data.capabilities = this.userCompanySubmission.capabilities
          return data
        }
        else if (companyDetails && companyDetails.otherinfo ) {
          let data = {}
          data.specialties = companyDetails.specialties
          data.capabilities = companyDetails.capabilities
          return data
        }
        return {
          specialties: '',
          capabilities: '',
          companylogo: '',
          capabilitiesstatement: ''
        }        
      },
      user () {
        return this.$store.getters.getUserDetails
      }
    },
    props: ['readonly'],
    methods: {
      async submitCompany() {
        let details = this.$store.getters.getUserCompanySubmission
        if (!details.companyinfo && !details.contractinginfo && !details.otherinfo)
        {
          let snackbar = {
            active: true,
            text: 'Please Fill the complete questionnaire to submit the company'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return
        }
        details.submitted = true
        details.verified = false
        details.rejected = false
        await this.$firebase.database().ref(`companies_submission/${this.user.cid}/${this.user.uid}`).update(details)
        window.location.reload()
      },
      onPrevious () {
        this.$emit('previous')
      },
      async onSave () {
        var company = this.user.cid.toString()
        var details = this.OtherInfoForm
        details.submitted = false
        details.verified = false
        details.rejected = false
        details.otherinfo = true
		details.submitdate = moment(new Date()).format('YYYY-MM-DD')
        if (this.logoFileName === '') {
          let snackbar = {
            active: true,
            text: 'Upload a valid image file for logo'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return
        }
        if (this.statementFileName === '') {
          let snackbar = {
            active: true,
            text: 'Upload a valid file for  statements'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return
        }

        details.companylogo = await this.uploadLogo(company)
        if (details.companylogo == null) {
          return
        }

        details.capabilitiesstatement = await this.uploadStatement(company)
       
        if (details.capabilitiesstatement == null) {
          return
        }
		
     
        this.$firebase.database().ref(`companies_submission/${company}/${this.user.uid}`).update(details)
          .then(() => {
            this.$store.dispatch('fetchUserCompanySubmission')
      //window.location.reload()
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
            }
          )
      },
      async uploadLogo (company) {
        var storageRef = this.$firebase.storage().ref()
        var logoRef = storageRef.child(`companies/${company}/logo.jpg`)
        try {
          await logoRef.put(this.logoFile[0])
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return null
        }
        try {
          var logoUrl = await storageRef.child(`companies/${company}/logo.jpg`).getDownloadURL()
          return logoUrl
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return null
        }
      },
      async uploadStatement (company) {
        var storageRef = this.$firebase.storage().ref()
        var ext = '.pdf'
        var type = this.statementFile[0].type.split('/')[1].toLowerCase()
        if (type === 'msword') {
          ext = '.doc'
        }
        var statementRef = storageRef.child(`companies/${company}/statement${ext}`)
        try {
          await statementRef.put(this.statementFile[0])
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return null
        }
        try {
          var statementUrl = await storageRef.child(`companies/${company}/statement${ext}`).getDownloadURL()
          return statementUrl
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
          return null
        }
      }
    }
  } 
</script>


