<template>

  <v-container fluid style="padding-top: 100px">
    <v-layout row wrap style="margin-bottom: 30px;" class="mx-5">
      <v-flex xs12 >
        <v-layout row wrap>
          <v-flex xs12 class="ml-4 mt-2">
            <h2 style="color:#4a4a4a;font-size:29px;font-weight:bolder;text-justify:auto;" class="page-header">{{ pages.header }}</h2>
          </v-flex>
          
          <v-flex xs12 style="color:#4a4a4a;font-size:18px;font-weight:400;margin:0px;" class="ml-4 page-header">
            <div style="margin-top:-10px;padding-top:0px;">
              <p style="text-justify:auto;line-height:22px;">
                {{ pages.sub_text }}
              </p>
            </div>
          </v-flex>
         
          <v-flex xs12>
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step step="1" :complete="e1 > 1" >Company Information</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="e1 > 2" >Contracting Information</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Other Information</v-stepper-step>
              </v-stepper-header>
              <v-stepper-content step="1">
      
                <company-information :element="e1" class="mx-2 my-2" @next="e1 = 2" :mode="'edit'" :readonly="readonly"></company-information>
              </v-stepper-content>
              <v-stepper-content step="2">
                <contracting-information :element="e1" class="mx-2 my-2" @previous="e1 = 1" @next="e1 = 3" :readonly="readonly"></contracting-information>

              </v-stepper-content>
              <v-stepper-content step="3">
                <other-information :element="e1" @previous="e1 = 2" class="mx-2 my-2" :readonly="readonly"></other-information>
              </v-stepper-content>
            </v-stepper>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- <sidebox-chat /> -->
    <full-view-chat />
  </v-container>
</template>


<script>
  import SideboxChat from '@/components/chat/sideboxChat.vue'
  import FullViewChat from '@/components/chat/fullviewChat.vue'
  import CompanyInformation from './questionaire/CompanyInformationForm.vue'
  import ContractingInformation from './questionaire/ContractingInformationForm.vue'
  import OtherInformation from './questionaire/OtherInformation.vue'
  export default {
    components: {
      SideboxChat,
      FullViewChat,
      CompanyInformation,
      OtherInformation,
      ContractingInformation
    },
    data () {
      return {
        mode: 'edit',
        e1: 1,
        snackbar: {
          active: false,
          text: ''
        },
        readonly: false,
        load: this.$store.getters.getInitializing,
        alerted: false
      }
    },
    computed: {
      company: {
        get: function () {
          return this.$store.getters.getUserDetails.cid
        }
      },
      userCompanySubmission () {
        return this.$store.getters.getUserCompanySubmission
      },
      getCid (){
        return this.$store.getters.getUserDetails.cid
      },
      pages() {
        return this.$store.getters.getPages.questionnaire;
      },
      companyDetails () {
        return this.$store.getters.getCompanyDetails
      }
    },
    watch: {
      userCompanySubmission (val) {
        if (val && val.submitted === true && val.verified === false && val.rejected === false) {
            this.readonly = true
        }
        if (this.alerted) {
          return;
        }
        let message = ''
        if (val.rejected === true)
          message = 'Your submission was rejected by the admin.'
        else if (val.submitted === true && val.verified === false)
          message = 'Your submission is awaiting approval by the admin.'
        else if (!val.otherinfo && !val.companyinfo && !val.contractinginfo)
          message = 'You have no submission for this company.'
        else if ((val.otherinfo || val.companyinfo || val.contractinginfo) && val.submitted == false && val.verified == false )
          message = 'You have a pending submission to this company. Please fill the questionnaire to complete the process'
        else
          message = 'Your submission has been approved by the admin.'
        let snackbar = {
            active: true,
            text:  message
        }
        if (message !='')
        this.$store.dispatch('triggerSnackbar', snackbar)
        setTimeout(() => {
            let snackbar = {
              active: false,
              text: ''
            }
           
            this.$store.dispatch('triggerSnackbar', snackbar)
          }, 2000)
        this.alerted = true
      },
      companyDetails (val) {
      }
    },
    mounted () {
      this.$store.dispatch('fetchUserCompanySubmission')
      const payload = {
        meta: {
          'h1': 'Company Questionnaire',
          'title': 'Company Questionnaire',
          'description': 'Company Questionnaire',
          'keywords': 'company, questionaire',
          'requiresAuth': true
        }
      }
      document.title = payload.meta.title
      this.$store.commit('setHeaderInfo', payload)
    },
    methods: {
    },
  }
</script>
<style>
  #questionaire_info {
    margin-top: 60px;
  }
</style>
