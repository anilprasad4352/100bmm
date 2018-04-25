<template>
  <v-layout  wrap class="body-bgx  pb-5"  :style="{backgroundColor: styles.general.theme_color_light}">
    <v-flex md4 style="margin:0 auto;text-align:center;" >
      <form class="py-0 my-0 mt-5" @submit.prevent="handleSignUp" v-on-click-outside="close">
        <v-container column align-center>
          <br>
			    <br>
          <img :src="styles.general.logo" style="max-width:100%;max-height:70px;" />
          <br>
          <br>
          <h3 class="white--text">Sign-up</h3>
          <br>
          <v-layout row wrap>
            <v-flex xs12 md6 class="right-padding">
				      <input id="confirmation6" type="text" placeholder="Email" required v-model="signUp.email" class="form-control">    
            </v-flex>
            <v-flex xs12 md6 class="left-padding">
				      <input id="confirmation5" type="password" placeholder="Password" required v-model="signUp.password" class="form-control">     
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 md6 class="right-padding">
				      <input id="confirmation4" type="text" placeholder="First Name" required v-model="signUp.firstname" class="form-control">  
            </v-flex>

            <v-flex xs12 md6 class="left-padding">
				      <input id="confirmation3" type="text" placeholder="Last Name" required v-model="signUp.lastname" class="form-control"> 
            </v-flex>
          </v-layout>

          <v-layout row wrap>
				    <v-flex xs12 md6 class="right-padding">
              <input id="confirmation7" type="text" placeholder="Job Title" required v-model="signUp.jobtitle" class="form-control">                 
            </v-flex>

            <v-flex xs12 md6 class="left-padding">
				      <input id="confirmation2" type="text" placeholder="Department" required v-model="signUp.department" class="form-control"> 
            </v-flex>
          </v-layout>

          <v-layout row wrap>
				    <v-flex xs12 md12 >
			        <input v-if="notavailable"  autocomplete="off" id="confirmation1" style="margin-left:3px;margin-right:5px;width:99%;"  :loading="companyLoading" cache-items required  type="text" placeholder="Company | Organization" v-model="companySearch" class="form-control left-padding"> 
              <div class="list-search" v-if="startsearch" :style="{backgroundColor: styles.general.theme_color_light}">
                <ul id="myUL">
                  <li v-for="item in companydirectory" v-on:click="onClick(item[1],item[0])">{{item[0]}}</li>
                </ul>
              </div>
				      <input type="hidden" id="cid" v-model="signUp.cid"  />
            </v-flex>   
          </v-layout>
                 
          <v-layout cloumn align-center justify-center class="mt-2 mb-0 pb-6">
            <v-btn class="form-control white--text" style="margin:0px;" :style="{backgroundColor: styles.general.theme_color_dark}" type="submit" v-if="!error || !signUpProcess" :disable="loading" :loading="loading">
              Sign-Up
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
            <v-layout row v-if="error && errorCode === 'auth'">
              <alert :text="error" :error="true" :success="false"  @dismissed="onDismiss" class="py-2"></alert>
            </v-layout>
          </v-layout>
          <br>
          <br>
          <br>
          <br>
        </v-container>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'
import axios from 'axios'
import Alert from '../components/Alert.vue'
import { mixin as onClickOutside } from 'vue-on-click-outside'

export default {
  components: {
    Alert
  },
  mixins: [onClickOutside],
  props: ['activatorText', 'trigger', 'active'],
  data () {
    return {
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      mail: '',
      companySearch: null,
      companySearch1: null,
      companydirectory: [],
      companyLoading: false,
      startsearch: false,
      notavailable: true,
      signUp: {
        email: '',
        password: '',
        lastname: '',
        firstname: '',
        jobtitle: '',
        department: '',
        cid: '',
        createdAt: moment(new Date()).format('YYYY-MM-DD'),
        companylegalname: ''
      },
      signIn: {
        email: '',
        password: ''
      },
      test: true,
      items: ['SIGN-UP', 'SIGN-IN'],
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  methods: {
    async createComp (companylegalname, cid) {
      const newcomp = {
        companylegalname: companylegalname
      }
      let snapshot = await this.$firebase.database()
        .ref('companies')
        .child(cid.toString())
        .once('value')

      if (snapshot.val() == null) {
        await this.$firebase.database()
          .ref('companies')
          .child(cid.toString())
          .set(newcomp)
      }
    },
    onClick: function (cid, company) {
      this.signUp.companylegalname = company
      if (company != 'Create New') {
        if (cid != '') {
          this.signUp.cid = cid
          this.startsearch = false
        }
        this.companySearch = company
        this.startsearch = false
      } else {
        this.startsearch = false
      }
      return false
    },
    close () {
      this.startsearch = false
    },
    handleSignUp () {
      var self = this
      let companylegalname = document.getElementById('confirmation1').value
      this.signUp.companylegalname = companylegalname
      if (this.signUp.cid == '') {
        var postData = {
          companylegalname: document.getElementById('confirmation1').value
        }

        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
          }
        }
        
        axios
          .post(
            'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory',
            postData,
            axiosConfig
          )
          .then(res => {
            // alert(res.data._id)
            if (res.data._id != null && res.data._id != 'None') {
              this.signUp.cid = res.data._id
              this.createComp(
                document.getElementById('confirmation1').value,
                this.signUp.cid
              )
              this.$store.dispatch('signUserUp', this.signUp)
            }
          })
      } else {
        this.createComp(this.signUp.companylegalname, this.signUp.cid)

        this.$store.dispatch('signUserUp', this.signUp)
      }
    },
    onDismiss () {
      this.$store.dispatch('setError', null)
    },
    async handleSignIn () {
      await this.$store.dispatch('signUserIn', this.signIn)
    },
    cancel () {
      this.$emit('cancel')
      this.$router.push('/')
    },
    
   
    querySelections (v) {
      this.loading = true
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        this.loading = false
      }, 500)
    }
  },
  computed: {
    dialog () {
      return this.trigger
    },
    styles () {
      // $('.content').css('background',this.$store.getters.getStyles.styles.general.theme_color_light)
      return this.$store.getters.getStyles
    },
    error () {
      return this.$store.getters.getError
    },
    errorCode () {
      return this.$store.getters.getErrorCode
    },
    loading () {
      return this.$store.getters.getLoading
    },
    signInProcess () {
      return this.$store.getters.getProcess === 'Sign In'
    },
    signUpProcess () {
      return this.$store.getters.getProcess === 'Sign Up'
    },
    user () {
      return this.$store.getters.getUserDetails
    },
    fullscreen () {
      return true
      // return screen.availWidth < 600
    },
    screenWidth () {
      return Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      )
    },
    screenHeight () {
      return Math.max(
        document.documentElement.clientHeight,
        window.innerWidth || 0
      )
    }
  },
  watch: {
    companySearch (val) {
      if (val.length != 0) {
        if (this.signUp.cid == '') {
          this.startsearch = true
        } else {
          if (this.signUp.companylegalname == val) {
            this.startsearch = false
          } else {
            this.startsearch = true
            this.signUp.cid = ''
          }
          this.startsearch = false
        }
      } else {
        this.signUp.cid = ''
        this.startsearch = false
      }

      if (this.signUp.cid == '') {
        val = val.toUpperCase()
        this.companyLoading = true
        this.$store.dispatch('getContractors', { search: val }).then(res => {
          let i
          this.companydirectory = []
          var dat = []
          // dat.push("Create New")
          // dat.push("")
          // this.companydirectory.push(dat)
          for (i = 0; i < res.data.data.length; i++) {
            dat = []
            dat.push(res.data.data[i].companylegalname)
            dat.push(res.data.data[i]._id)
            this.companydirectory.push(dat)
          }

          this.companyLoading = false
          // this.signUp.companylegalname = val
        })
      }
    },
    user (value) {
      if (value.uid != null && value.uid !== undefined) {
        this.$router.push('/user/feed')
      }
    },
    fullscreen (value) {
      alert('fullscreen')
    },
    search (val) {
      val && this.querySelections(val)
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:900');
  .bold {
    font-family: 'Alegreya Sans SC', sans-serif;
  }

  .header {
    background-color: rgb(245, 245, 245);
    border-style: none;
    border-bottom: thin solid #d1d0cf;
    border-bottom-width: 2px;
  }
  .body-bgx {
    height: 100vh;
    width: 100%;
    padding-bottom: 30px;
  }

  .left-padding {
    padding-left: 3px;
    padding-right: 3px;
  }
  .right-padding {
    padding-left: 3px;
    padding-right: 3px;
  }
  .body-bgx .input-group--select .input-group__append-icon {
    color: #ffffff61 !important;
  }
  .body-bgx .form-control {
    display: block;
    width: 100%;
    height: 40px;
    padding: 6px 12px;
    font-size: 16px;
    line-height: 1.42857143;
    color: #fff;
    background-color: #9a949463;
    background-image: none;
    margin-bottom: 10px;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    -webkit-transition: border-color ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
  }
  .body-bgx .form-control::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #fff;
    opacity: 1; /* Firefox */
  }

  .body-bgx .form-control:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #fff;
  }

  .body-bgx .form-control::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #fff;
  }
  .body-bgx .input-group--text-field label {
    position: absolute;
    top: 6px !important;
    left: 13px !important;
  }
  .body-bgx .application--light .input-group:not(.input-group--error) label {
    color: #ffffff61 !important;
  }
  .body-bgx .input-group--select {
    margin-top: 0px !important;
  }
  .list-search {
    width: 30.9%;
    max-height: 160px;
    overflow-y: auto;
    position: absolute;
    background: #6d8fa9;
    z-index: 999;
    margin-top: -11px;
    color: white;
    border: 1px solid #6d8fa9;
  }
  .list-search ul li:hover {
    background: #576793;
    cursor: pointer;
  }
  ul#myUL {
    padding-left: 0px !important;
  }
  .list-search ul li {
    list-style: none;
    float: left;
    width: 100%;
    text-align: left;
    text-decoration: none;
    font-size: 16px;
    border-bottom: 1px solid #57769414 !important;
    padding-left: 9px !important;
    font-size: 18px !important;
  }
</style>