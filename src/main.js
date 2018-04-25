import Vue from 'vue'
import moment from 'moment'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import vuex from 'vuex'
import VueClipboard from 'vue-clipboard2'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import VueFire from 'vuefire'
import { store } from './store/store.js'
import * as firebase from 'firebase'
import { config } from './database/firebase-config.js'
import authGaurd from './router/auth-gaurd.js'
import { statusFilter, sliceFilter } from './filters/filters'
// import meta from './router/meta.json'
import VueAnalytics from 'vue-analytics'

import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
Vue.prototype.$firebase = firebase.initializeApp(config)

Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})
Vue.use(vuex)
Vue.use(VueClipboard)

Vue.use(VueAnalytics, {
  id: 'UA-109500012-1',
  router
})

Vue.use(VueLodash, lodash)
Vue.use(VueFire)

Vue.filter('fromNow', (value) => {
  return moment(new Date(value)).fromNow()
})
let presenceRef = firebase.database().ref('.info/connected')
let myRef = ''

Vue.filter('actualDate', (value
) => {
  return moment(new Date(value)).format('MM/DD/YYYY')
})

Vue.filter('status', statusFilter)
Vue.filter('sliceText', sliceFilter)

Vue.config.productionTip = false

/* eslint-disable no-new */

router.afterEach((to, from) => {
  document.title = to.meta.title
  const exclude = ['/opportunuties']
  if (!exclude.includes(to.path)) {
    store.dispatch('setRouteDetails', { to, from })
  }
})
router.beforeEach(authGaurd)

new Vue({
  el: '#app',
  store,
  router,
  Vuetify,
  filters: {
  },
  async mounted () {
    store.dispatch('fetchFeedbacks')
    store.dispatch('setInitializing', true)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!user.emailVerified) {
          var alert = {
            header: 'Email verification',
            text: 'Please verify your email address.',
            active: true,
            okText: 'OK',
            cancelText: ''
          }
          store.dispatch('signUserOut', null)
          router.push('/')
          store.dispatch('triggerAlert', alert)
        } else {
          myRef = firebase.database().ref().child('/users/' + user.uid)
          presenceRef.on('value', function (snap) {
            if (snap.val()) {
              myRef.onDisconnect().update({ status: 'offline' })
              myRef.update({
                status: 'online',
                lastlogin: new Date()
              })
            }
          })
          firebase.database().ref('users/' + user.uid).on('value', function (snapshot) {
            const userDetails = snapshot.val()
            store.dispatch('autoSignIn', userDetails)
            firebase.database().ref(`level_priviledge/${userDetails.role}`).on('value', (snapshot) => {
              var levelPrivileges = snapshot.val()
              store.commit('setUserPrivilege', levelPrivileges)
            })
            if (snapshot.val().cid) {
              var companylegalname = snapshot.val().cid
              firebase.database().ref('companies/' + companylegalname).once('value')
                .then(
                  snapshot => {
                    let company = snapshot.val()
                    if (!company.otherinfo) {
                      let toolbarAlert = {
                        active: true,
                        type: 'warning',
                        message: `Please complete the <a href="/questionnaire"><b>company questionnaire<b></a> to take full advantage of the site`
                      }
                      store.commit('setToolbarAlert', toolbarAlert)
                    }
                    store.dispatch('setCompany', snapshot.val())
                  }
                )
            }
          })
        }
      }
    })

    let allPrivileges = await firebase.database().ref('level_priviledge').once('value')
    store.commit('setAllPriviledge', allPrivileges)

    let settings = await firebase.database().ref('/site_settings/').once('value')
    store.dispatch('loadSettings', settings.val())
    store.dispatch('addStyle')

    var fb = firebase.database().ref()
    await firebase.database().ref('/companies/').once('value', (snapshot) => {
      const allData = []
      snapshot.forEach((element) => {
        let value = {
          id: element.key,
          activeDialog: false,
          ...element.val()
        }
        if (value.submitby) {
          fb.child('users/' + value.submitby.toString()).once('value', function (mediaSnap) {
            var udata = mediaSnap.val()
            if (udata) {
              value.firstname = udata.firstname
              value.lastname = udata.lastname
            }
          })
        }
        allData.push(value)
      })
      store.dispatch('loadCompanies', allData)
      store.dispatch('setInitializing', false)
    })

    await firebase.database().ref('/users/').once('value')
      .then(
        snapshot => {
          const allData = []
          snapshot.forEach((element) => {
            let value = {
              id: element.key,
              activeDialog: false,
              ...element.val()
            }
            if (element.val().firstname && element.val().lastname && element.val().avatar) {
              allData.push(value)
            }
          })
          store.dispatch('loadUsers', allData)
          store.dispatch('setInitializing', false)
        }
      )
      .catch(
        error => {
          alert(error.message)
        }
      )
  },
  render: h => h(App)
})
