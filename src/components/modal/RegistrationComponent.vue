<template>

  <v-dialog v-model="dialog" lazy width="600px" persistent :fullscreen="screenWidth<600" transition="scale-transition" >


    <v-card>
      <v-tabs light fixed centered v-model="active">

        <v-tabs-bar class="header">

          <v-tabs-slider class="yellow"></v-tabs-slider>
          <v-tabs-item
            v-for="i in items"
            :key="i"
            :href="'#' + i"
            style="border:none; "
            router
          >
            <b>{{ i }}</b>
          </v-tabs-item>
          <v-btn icon @click.native="cancel()" style="float:right">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-tabs-bar>

        <v-tabs-content id="SIGN-UP" style="height:100%;border:none;">


            <v-card-text>

            <v-layout column align-center justify-center>
              <v-card-title primary-title class="bold title pb-1 mt-0 pt-1">CREATE AN ACCOUNT</v-card-title>
              <b class="caption pt-0 pb-2">continue with</b>
              <v-layout row wrap>
                <v-flex xs12 md6>
                  <v-btn class="red accent-4 white--text mr-1" @click.prevent="signUpWithGoogle" block>Sign up with Gmail</v-btn>
                </v-flex>
                <v-flex xs12 md6>
                  <v-btn class="green accent4 white--text ml-1" block>Sign up with LinkedIn</v-btn>
                </v-flex>
              </v-layout>
              <b class="caption mt-2 pb-0">or</b>
              <form class="py-0 my-0 mt-0" @submit.prevent="handleSignUp">
               <v-container column align-center>

                 <v-layout row wrap>
                   <v-flex xs12 md6>
                     <v-text-field
                       ref="confirmation"
                       v-model="signUp.email"
                       label="Email Address"
                       class="pr-2"
                       style="padding-bottom:0px;margin:0px;"
                       type="email"
                       required
                       :error="false"
                       hide-details
                     ></v-text-field>
                   </v-flex>
                   <v-flex xs12 md6>
                     <v-text-field
                      ref="confirmation"
                      v-model="signUp.password"
                      class="pr-2"
                      label="Password"
                      type="password"
                      style="padding-bottom:0px;"
                      hint="At least 6 characters"
                      required
                      counter="6"
                     ></v-text-field>
                   </v-flex>
                 </v-layout>

                 <v-layout row wrap>
                   <v-flex xs12 md6>
                     <v-text-field
                       v-model="signUp.firstname"
                       class="pr-2"
                       label="First Name"
                       style="padding-bottom:0px;"
                       required
                     ></v-text-field>
                   </v-flex>
                   <v-flex xs12 md6>
                     <v-text-field
                       v-model="signUp.lastname"
                       label="Last Name"
                       style="padding-bottom:0px;"
                       required
                     ></v-text-field>
                   </v-flex>
                 </v-layout>

                 <v-layout row wrap>
                   <v-flex xs12 md6>
                     <v-text-field
                       v-model="signUp.jobtitle"
                       class="pr-2"
                       label="Job Title"
                       style="padding-bottom:0px;"
                       required
                       :error="false"
                     ></v-text-field>
                   </v-flex>
                   <v-flex xs12 md6>
                     <v-text-field
                       v-model="signUp.department"
                       class="pr-2"
                       label="Department"
                       style="padding-bottom:0px;"
                       required
                     ></v-text-field>
                   </v-flex>
                 </v-layout>

                 <v-layout row wrap>
                   <v-flex xs12 md6>
                     <v-select
                       v-if="notavailable"
                       v-model="signUp.companylegalname"
                       class="pr-2 mt-0"
                       label="Company Name"
                       cache-items
                       :loading="companyLoading"
                       :items="companydirectory"
                       :search-input.sync="companySearch"
                       autocomplete
                       style="padding-bottom:0px;"
                       required
                     ></v-select>
                      <v-text-field v-else
                       v-model="signUp.companylegalname"
                       class="pr-2 mt-0"
                       label="Company Name"
                       style="padding-bottom:0px;"
                       required
                     ></v-text-field>
                   </v-flex>
                   <v-flex xs12 md6>
                     <v-text-field
                       v-model="signUp.businesswebsite"
                       label="Company Website"
                       class="pr-2"
                       style="padding-bottom:0px;"
                       required
                     ></v-text-field>
                   </v-flex>
                 </v-layout>
                 <v-layout>
                   <v-flex xs12>
                     <input id="terms" type="checkbox" class="mr-2" required>
                     <label for="terms">Agree to the Terms & Conditions</label>
                   </v-flex>
                   <v-flex xs12 sm6>

                     <label for="terms">Privacy Policy</label>
                   </v-flex>

                 </v-layout>
                 <v-layout cloumn align-center justify-center class="mt-2 mb-0 pb-0">
                  <v-btn class="blue accent-4 white--text" type="submit" v-if="!error || !signUpProcess" :disable="loading" :loading="loading">
                    Create Account
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                   <v-layout row v-if="error && signUpProcess">
                     <alert :text="error" :error="true" :success="false"  @dismissed="onDismiss" class="py-2"></alert>
                   </v-layout>
                 </v-layout>
               </v-container>

              </form>
            </v-layout>
            </v-card-text>


        </v-tabs-content>

        <v-tabs-content id="SIGN-IN">

            <v-card-text>
              <v-layout column align-center justify-center>
                <v-card-title primary-title class="bold title pb-1">SIGN IN TO YOUR ACCOUNT</v-card-title>
                <b class="caption pt-0 pb-2">continue with</b>
                <v-layout class="mt-0" row wrap>
                  <v-flex xs12 md6>
                    <v-btn @click.prevent="signInWithGoogle" class="red accent-4 white--text mr-1" block>Sign in with Google</v-btn>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-btn class="green accent-4 white--text ml-1" block>Sign in with LinkedIn</v-btn>
                  </v-flex>
                </v-layout>
                <b class="caption mt-2 mb-0">or</b>
                <form class="py-0 my-0" @submit.prevent="handleSignIn">
                  <v-container column align-center>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-text-field
                          v-model="signIn.email"
                          label="Email Address"
                          style="padding-bottom:0px;margin:0px;"
                          type="email"
                          class="pr-2"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-text-field
                          v-model="signIn.password"
                          label="Password"
                          type="password"
                          class="pr-2"
                          style="padding-bottom:0px;"
                          required
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout cloumn align-center justify-center>
                      <v-btn class="blue accent-4 white--text" type="submit" v-if="!error || !signInProcess" :disable="loading" :loading="loading">
                        Log In
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                      <v-layout row v-if="error && signInProcess">
                        <alert :text="error" :error="true" :success="false" @dismissed="onDismiss" class="py-2"></alert>
                      </v-layout>
                    </v-layout>
                  </v-container>
                </form>
              </v-layout>
            </v-card-text>

        </v-tabs-content>
      </v-tabs>
    </v-card>
  </v-dialog>

</template>

<script>
  import firebase from 'firebase'
  import Alert from '../Alert.vue'
 import moment from 'moment'
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
        companydirectory: [],
        companyLoading: false,
        notavailable: true,
        signUp: {
          email: '',
          password: '',
          lastname: '',
          firstname: '',
          jobtitle: '',
          department: '',
          companylegalname: '',
          businesswebsite: '',
		  createdAt:moment(new Date()).format('YYYY-MM-DD')
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
          console.log(result.user, 'user result')
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
          console.log(result.user, 'user result')
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
      error () {
        return this.$store.getters.getError
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
      }
    },
    watch: {
      companySearch (val) {
        val = val.toUpperCase()
        this.companyLoading = true
        this.$store.dispatch('getContractors', { search: val }).then(res => {
          let i
          this.companydirectory = []
          for (i = 0; i < res.data.data.length; i++) {
            this.companydirectory.push(res.data.data[i].companylegalname)
          }
          if (this.companydirectory.length === 0 && val.length >= 2) { this.notavailable = false }
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

</style>
