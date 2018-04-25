
import { store } from '../store/store.js'
import firebase from 'firebase'
import Vue from 'vue'
Vue.use(firebase)
export default async (to, from, next) => {
  let user = store.getters.getUserDetails
  if (user.uid !== null && store.getters.getUserDetails.uid !== undefined && store.getters.getUserDetails.role !== 1) {
    var fb = firebase.database().ref()
    user = await fb.child('users/' + user.uid.toString()).once('value')
    user = user.val()
    if (parseInt(user.role) !== 1) {
      let alertData = {
        active: true,
        header: 'Access denied',
        text: "You don't have access to this page",
        okText: 'Ok',
        cancelText: ''
      }
      store.dispatch('triggerAlert', alertData)
      next({
        path: '/user/feed'
      })
    } else {
      next()
    }
  } else {
    next()
  }
}
