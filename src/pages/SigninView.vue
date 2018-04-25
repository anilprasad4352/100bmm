<template>
  <v-layout  wrap class="body-bgx  pb-5"  :style="{backgroundColor: styles.general.theme_color_light}">
    <v-flex md3 style="margin:0 auto;text-align:center;" >
      <form class="py-0 my-0 mt-5" @submit.prevent="handleSignIn">
        <v-container column align-center>
			    <br>
			    <br>
          <img :src="styles.general.logo" style="max-width:100%;max-height:70px;" />
          <br>
          <br>
          <h3 class="white--text">Sign-in</h3> 
          <br>
          <v-layout row wrap>
            <v-flex xs12 md12 >
				      <input id="confirmation6" type="text" placeholder="Email" required v-model="signIn.email" class="form-control">           
            </v-flex>
				    <input id="confirmation5" type="password" placeholder="Password" required v-model="signIn.password" class="form-control">      
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 md12 class="radio">
              <input id="radio-1" name="radio" type="radio" >
              <label for="radio-1" class="radio-label">Remember me</label>
            </v-flex>
          </v-layout>

          <v-layout cloumn align-center justify-center class="mt-2 mb-0 pb-0">
            <v-btn class="form-control white--text" style="margin:0px;" :style="{backgroundColor: styles.general.theme_color_dark}" type="submit" v-if="!error || !signInProcess" :disable="loading" :loading="loading">
              Sign-In
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
            <v-layout row v-if="error && errorCode === 'auth'">
              <alert :text="error" :error="true" :success="false"  @dismissed="onDismiss" class="py-2"></alert>
            </v-layout>
          </v-layout>
				  <v-layout row wrap>
            <v-flex xs12 md12 class="right-padding">
              <a href="/forgot" style="letter-spacing: 2px;text-decoration: none;" class="white--text">Forgot password?</a>
            </v-flex>
          </v-layout>
        </v-container>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
  import firebase from 'firebase'
  import moment from 'moment'
  import Alert from '../components/Alert.vue'
  export default {
    components: {
      Alert
    },
    props: ['activatorText', 'trigger', 'active'],
    data () {
      return {
        rules: {
          required: (value) => !!value || 'Required.',
          email: (value) => {
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
          companylegalname: '',
          createdAt: moment(new Date()).format('YYYY-MM-DD')
        },
        signIn: {
          email: '',
          password: ''
        },
        test: true,
        items: ['SIGN-UP', 'SIGN-IN'],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    methods: {
      onClick: function (company) {
        this.signUp.companylegalname = company
        this.companySearch = company
        this.startsearch = false
      },
      handleSignUp () {
        this.$store.dispatch('signUserUp', this.signUp)
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
      signUpWithGoogle () {
        const provider = new firebase.auth.GoogleAuthProvider()
        const store = this.$store
        return this.$firebase.auth().signInWithPopup(provider).then((result) => {
          store.dispatch('signUpViaGoogle', result.user)
        }).catch((error) => {
          store.commit('setError', error)
          console.log(error, 'user signup error')
        })
      },
      signInWithGoogle () {
        const provider = new firebase.auth.GoogleAuthProvider()
        const store = this.$store
        return this.$firebase.auth().signInWithPopup(provider).then((result) => {
          store.dispatch('signInViaGoogle', result.user)
        }).catch((error) => {
          store.commit('setError', error)
          console.log(error, 'user signup error')
        })
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
        return (this.$store.getters.getProcess === 'Sign In')
      },
      signUpProcess () {
        return (this.$store.getters.getProcess === 'Sign Up')
      },
      user () {
        return this.$store.getters.getUserDetails
      },
      fullscreen () {
        return true
        // return screen.availWidth < 600
      },
      screenWidth () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      },
      screenHeight () {
        return Math.max(document.documentElement.clientHeight, window.innerWidth || 0)
      }
    },
    watch: {
      companySearch (val) {
        if (val.length !== 0) {
          this.startsearch = true
        } else {
          this.startsearch = false
        }
        val = val.toUpperCase()
        this.companyLoading = true
        this.$store.dispatch('getContractors', { search: val }).then(res => {
          let i
          this.companydirectory = []
          for (i = 0; i < res.data.data.length; i++) {
            this.companydirectory.push(res.data.data[i].companylegalname)
          }
          if (res.data.data.length === 0) {
            this.companydirectory.push('No data found')
          }
          this.companyLoading = false
          this.signUp.companylegalname = val
        })
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

<style scoped>
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
  .body-bgx{
    position:absolute;
    height:100%;
    width:100%;
  }
  .content{
    height:100%;
  }
  .left-padding{
    padding-left:3px;
    padding-right:3px;
  }
  .right-padding{
    padding-left:3px;
    padding-right:3px;
  }
  .body-bgx .input-group--select .input-group__append-icon {
    color: #ffff61 !important;
  }
  .body-bgx .form-control{
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
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  }
  .body-bgx .form-control::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #fff;
    opacity: 1; /* Firefox */
  }

  .body-bgx .form-control:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #fff;
  }

  .body-bgx .form-control::-ms-input-placeholder { /* Microsoft Edge */
    color: #fff;
  }
  .body-bgx  .input-group--text-field label {
    position: absolute;
    top: 6px !important;
    left: 13px !important;
  }
  .application--light .input-group:not(.input-group--error) label {
    color: #ffffff61 !important;
  }
  .list-search{
    width: 15.2%;
    max-height: 300px;
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
  ul#myUL{
    padding-left:0px !important;
  }
  .list-search ul li{
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
  .body-bgx .radio {
    margin: 0.5rem;
    text-align:left;
    color:#fff;
  }
  .body-bgx .radio input[type="radio"] {
    position: absolute;
    opacity: 0;
  }
  .body-bgx .radio input[type="radio"] + .radio-label:before {
    content: '';
    background: #577b94;
    border-radius: 100%;
    /*border: 1px solid #b4b4b4;*/
    display: inline-block;
    width: 1.4em;
    height: 1.4em;
    position: relative;
    top: -0em;
    margin-right: 1em;
    vertical-align: top;
    cursor: pointer;
    text-align: center;
    transition: all 250ms ease;
  }
  .body-bgx .radio input[type="radio"]:checked + .radio-label:before {
    background-color: #577b94;
    box-shadow: inset 0 0 0 4px #f4f4f4;
  }
  .body-bgx .radio input[type="radio"]:focus + .radio-label:before {
    outline: none;
    border-color: #577b94;
  }
  .body-bgx .radio input[type="radio"]:disabled + .radio-label:before {
    box-shadow: inset 0 0 0 4px #f4f4f4;
    border-color: #b4b4b4;
    background: #b4b4b4;
  }
  .body-bgx .radio input[type="radio"] + .radio-label:empty:before {
    margin-right: 0;
  }
</style>
