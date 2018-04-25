import * as firebase from 'firebase'
import axios from 'axios'

export const getClientID = ({commit}) => {
}

export const getAdminSettings = ({commit}) => {
}

export const toggleGroupModal = ({ commit }, val) => {
  commit('toggleGroupModal', val)
}
export const getContractHistoryAnalyticsData = ({ commit }, payload) => {
  // eslint-disable-next-line
  let api = 'https://fed-exchange-api.herokuapp.com/api/v2.0/analytics/'
  api += `${payload.type}`
  let query = '' // eslint-disable-line
  if (payload && payload.type) {
    query += `?dunsnumber=${payload.dunsnumber}`
  }

  api += query

  return axios.get(api)
    .then(res => {
      commit('contractHistoryAnalytics', res.data)
      return res
    })
}
export const getContractHistoryAnalytics = ({ commit }, payload) => {
  // eslint-disable-next-line
  let api = 'https://fed-exchange-api.herokuapp.com/api/v2.0/charts/history?'
  let query = '' // eslint-disable-line
  if (payload && payload.naics) {
    query += `&naics=${payload.naics}`
  }
  if (payload && payload.psc) {
    query += `&psc=${payload.psc}`
  }
  api += query
  return axios.get(api)
    .then(res => {
      commit('contractHistoryAnalytics', res.data)
      return res
    })
}

export const getOpportunitiesAnalytics = ({ commit }, payload) => {
  // eslint-disable-next-line
  let api = 'https://fed-exchange-api.herokuapp.com/api/v2.0/charts/opportunities?'
  let query = '' // eslint-disable-line
  if (payload && payload.naics) {
    query += `&naics=${payload.naics}`
  }
  if (payload && payload.psc) {
    query += `&psc=${payload.psc}`
  }
  api += query
  return axios.get(api)
    .then(res => {
      commit('OpportunitiesAnalytics', res.data)
      return res
    })
}

export const fetchPublicGroups = ({commit}, payload) => {
  let publicgroups = {}
  let createdGroups = {}
  firebase.database().ref('groups/').on('child_added', snap => {
    const group = snap.val()
    if (group.members && (Object.keys(group.members).includes(payload.userId) || group.privacy.value === 1)) {
      const groupId = snap.key.replace('-', '')
      publicgroups[groupId] = Object.assign({}, group, { groupId })
      commit('setPublicGroups', publicgroups)
    }
    if (group.adminId === payload.userId) {
      const groupId = snap.key.replace('-', '')
      createdGroups[groupId] = Object.assign({}, group, { groupId })
      commit('setUserCreatedGroups', createdGroups)
    }
  })
}

export const joinGroup = ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  firebase.database().ref().child(`groups/${payload.groupId}/members/${payload.userId}`).set(payload.member)
  commit('setLoading', false)
  let snackbar = {
    active: true,
    text: 'Join request sent. Awating approval by group admin'
  }
  commit('triggerSnackbar', snackbar)
}

export const getContractors = ({ commit }, payload) => {
  // eslint-disable-next-line
  let contractorsApi = `https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory?`
  let query = '' // eslint-disable-line
  if (payload && payload.skip) {
   // contractorsApi += `&skip=${payload.skip}`
  }
  if (payload && payload.search) {
    contractorsApi += `&companylegalname=${payload.search}`
  }

  if (payload.search === undefined) {
    let state = payload.state
    contractorsApi += `&state=` + state
  }
  return axios({
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false,
    method: 'GET',
    url: contractorsApi
  }).then((res) => {
    commit('setContractors', res.data)
    return res
  }).catch(err => {
    return err
  })
}

export const signInViaGoogle = ({ commit }, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', 'Sign Up')

  firebase.database().ref(`users/${payload.uid}`).once('value')
    .then(snapshot => {
      commit('setLoading', false)
    })
}

export const signUpViaGoogle = ({ commit }, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', 'Sign Up')
  const firstname = payload.displayName.split(' ')[0]
  const lastname = payload.displayName.split(' ')[1]

  var newUser = {
    uid: payload.uid,
    avatar: payload.photoURL,
    firstname,
    lastname,
    email: payload.email,
    jobtitle: '',
    department: '',
    companylegalname: '',
    businesswebsite: '',
    social: {
      likes: [],
      comments: [],
      events: [],
      posts: []
    },
    role: 4
  }
  firebase.database().ref(`users/${payload.uid.toString()}`).update(newUser)
    .then(
      snapshot => {
        commit('setUser', snapshot.val())
        commit('setLoading', false)
      }
    )
    .catch()
  commit('setLoading', false)
}
export const getForecastOpportunities = ({ commit }, payload) => {
  let query = '' // eslint-disable-line
  let getForecastOpportunitiesApi = `https://fed-exchange-api.herokuapp.com/api/v2.0/forecastfilter?take=${payload && payload.limit ? payload.limit : 10}`

  if (payload && payload.type) {
    query += `&type=${payload.type}`
  }
  if (payload && payload.psc) {
    query += `&psc=${payload.psc}`
  }
  if (payload && payload.skip) {
    query += `&skip=${payload.skip}`
  }
  if (payload && payload.naics) {
    query += `&naics=${payload.naics}`
  }
  if (payload && payload.startdate && payload.enddate) {
    query += `&daterange=${payload.startdate}to${payload.enddate}`
  }
  if (payload && payload.search) {
    query += `&keywords=${payload.search}`
  }
  return axios.get(getForecastOpportunitiesApi).then((res) => {
    commit('setForecastOpportunities', res.data)
    return res
  })
}
export const getRecoveryOpportunities = ({ commit }, payload) => {
  let query = '' // eslint-disable-line
  let getRecoveryOpportunitiesApi = `https://fed-exchange-api.herokuapp.com/api/v2.0/recoveryfilter?take=${payload && payload.limit ? payload.limit : 10}`

  if (payload && payload.type) {
    query += `&type=${payload.type}`
  }
  if (payload && payload.psc) {
    query += `&psc=${payload.psc}`
  }
  if (payload && payload.skip) {
    query += `&skip=${payload.skip}`
  }
  if (payload && payload.naics) {
    query += `&naics=${payload.naics}`
  }
  if (payload && payload.startdate && payload.enddate) {
    query += `&daterange=${payload.startdate}to${payload.enddate}`
  }
  if (payload && payload.search) {
    query += `&keywords=${payload.search}`
  }
  return axios.get(getRecoveryOpportunitiesApi).then((res) => {
    commit('setRecoveryOpportunities', res.data)
    return res
  })
}
export const getOpportunities = ({ commit }, payload) => {
  let query = '' // eslint-disable-line
  let getOpportunitiesApi = `https://fed-exchange-api.herokuapp.com/api/v2.0/solicitationfilter?take=${payload && payload.limit ? payload.limit : 10}`

  if (payload && payload.type) {
    query += `&type=${payload.type}`
  }
  if (payload && payload.psc) {
    query += `&psc=${payload.psc}`
  }
  if (payload && payload.skip) {
    query += `&skip=${payload.skip}`
  }
  if (payload && payload.naics) {
    query += `&naics=${payload.naics}`
  }
  if (payload && payload.startdate && payload.enddate) {
    query += `&daterange=${payload.startdate}to${payload.enddate}`
  }
  if (payload && payload.search) {
    query += `&keywords=${payload.search}`
  }

  getOpportunitiesApi += query
  return axios.get(getOpportunitiesApi).then((res) => {
    commit('setOpportunities', res.data)
    return res
  })
}

export const getCompanyAwardHistory = ({ commit }, payload) => {
  var dunsnumber = payload.dunsnumber

  var companyAwardApi = 'https://fed-exchange-api.herokuapp.com/api/v2.0/analytics/award_amount_history?dunsnumber=' + dunsnumber

  return axios.get(companyAwardApi).then((res) => {
    commit('setCompanyAwardHistory', res.data)
    return res
  })
}

export const fetchTopNAICSCodes = ({commit}, payload) => {
  var dunsnumber = payload.dunsnumber
  var topNAICSCodesApi = 'https://georgia-defense-exchange.herokuapp.com/topAwardAmountByNaics?dunsNumber=' + dunsnumber
  return axios.get(topNAICSCodesApi).then((res) => {
    commit('setTopNAICSCodes', res.data)
    return res
  })
}

export const fetchTopPSCCodes = ({commit}, payload) => {
  var dunsnumber = payload.dunsnumber
  var topPSCCodesApi = 'https://georgia-defense-exchange.herokuapp.com/topAwardAmountByPsc?dunsNumber=' + dunsnumber
  return axios.get(topPSCCodesApi).then((res) => {
    commit('setTopPSCCodes', res.data)
    return res
  })
}

export const favoriteItem = ({commit, state}, payload) => {
  var val = {}
  val[payload.id] = payload.value
  // var user = state.user
  var keyword = payload.keyword
  var capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1)
  var msg = payload.value ? `Item ${capitalized}d Successfully` : `Removed ${capitalized} Successfully`
  commit('setLoading', true)
  const databaseRef = firebase.database().ref('users/' + payload.uid + `/${keyword}s/` + payload.type + '/')
  databaseRef.update(val).then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: msg
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const submitFeedback = ({commit, state}, payload) => {
  // var user = state.user
  var module = payload.module
  let feedback = payload.feedback
  feedback.uid = state.user.uid
  var msg = 'Your feedback has been submitted to the Management, we appreciate your input'
  commit('setLoading', true)
  feedback.submitdate = Date.now()
  const databaseRef = firebase.database().ref('feedback/' + module + `/`)
  databaseRef.push(feedback).then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: msg
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const submitHelp = ({commit, state}, payload) => {
  // var user = state.user
  let help = payload.help
  help.reviewed = false
  help.uid = state.user.uid
  var msg = 'Your help request has been submitted to the Management, we appreciate your input'
  commit('setLoading', true)
  help.submitdate = Date.now()
  const databaseRef = firebase.database().ref('help/')
  databaseRef.push(help).then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: msg
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const getContractVolumeHistory = ({ commit }, payload) => {
  var dunsnumber = payload.dunsnumber

  var companyAwardApi = 'https://fed-exchange-api.herokuapp.com/api/v2.0/analytics/contract_volume_history?dunsnumber=' + dunsnumber

  return axios.get(companyAwardApi).then((res) => {
    commit('setContractVolumeHistory', res.data)
    return res
  })
}

export const getAwardAmountAgency = ({commit}, payload) => {
  var dunsnumber = payload.dunsnumber

  var companyAwardApi = 'https://fed-exchange-api.herokuapp.com/api/v2.0/analytics/amount_agency?dunsnumber=' + dunsnumber

  return axios.get(companyAwardApi).then((res) => {
    commit('setAwardAmountAgency', res.data)
    return res
  })
}

export const getContractHistory = ({ commit }, payload) => {
  // eslint-disable-next-line
  let query = ''
  let contractHistoryAPI = `https://fed-exchange-api.herokuapp.com/api/v2.0/contractsfilter?take=${payload && payload.limit ? payload.limit : 10}`
  if (payload && payload.psc) {
    query += `&psc=${payload.psc}`
  }
  if (payload && payload.search) {
    query += `&keywords=${payload.search}`
  }
  if (payload && payload.subcontractplan && payload.subcontractplan.length && payload.subcontractplan !== 'All') {
    const subcontractplan = payload.subcontractplan.split(': ')[0]
    query += `&subcontractplan=${subcontractplan}`
  }
  if (payload && payload.setaside) {
    const setaside = payload.setaside.toLowerCase().split(' ').join('')
    query += `&setaside=${setaside}`
  }
  if (payload && payload.daterangetype && payload.daterangetype.length && payload.daterangetype !== 'Fiscal Year') {
    const daterangetype = payload.daterangetype.toLowerCase().split(' ').join('')
    query += `&daterangetype=${daterangetype}&daterange=${payload.startdate}to${payload.enddate}`
  }
  if (payload && payload.daterangetype === 'Fiscal Year') {
    const startyear = new Date(payload.startdate).getFullYear()
    const endyear = new Date(payload.enddate).getFullYear()
    query += `&daterangetype=fiscalyear&daterange=${startyear}to${endyear}`
  }
  contractHistoryAPI += query
  this.url = contractHistoryAPI
}

export const forgotUser = ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', 'Sign Up')
  firebase.auth().sendPasswordResetEmail(payload.email)
    .then(function () {
      commit('setLoading', false)
      alert('Email Sent')
    })
    .catch(
      error => {
        commit('setLoading', false)
        commit('setError', error.message)
        commit('setErrorCode', 'auth')
      }
    )
}
export const signUserUp = async ({state, commit, dispatch}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', 'Sign Up')
  try {
    let user = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    user.sendEmailVerification()
    const newUser = {
      uid: user.uid,
      avatar: '/static/img/default-user.png',
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: user.email,
      jobtitle: payload.jobtitle,
      department: payload.department,
      createdAt: payload.createdAt,
      cid: payload.cid,
      social: {
        likes: [],
        comments: [],
        events: [],
        posts: []
      },
      role: 4,
      usergroup: 1
    }
    let newcomp = {
      submitby: user.uid
    }
    await firebase.database().ref('users').child(user.uid.toString()).set(newUser)
    await firebase.database().ref('companies').child(payload.cid.toString()).update(newcomp)
    dispatch('signUserOut', null)
    commit('setError', null)
  } catch (error) {
    commit('setErrorCode', 'auth')
    commit('setError', error.message)
  } finally {
    commit('setLoading', false)
  }
}

export const fetchUserCompanySubmission = async ({state, commit}, payload) => {
  let user = state.user
  commit('setLoading', true)
  try {
    let submission = {}
    let snapshot = await firebase.database()
      .ref(`companies_submission/${user.cid.toString()}`)
      .child(user.uid.toString())
      .once('value')
    if (snapshot.val() !== null && snapshot.val() !== undefined) {
      submission = snapshot.val()
      commit('setUserCompanySubmission', submission)
      commit('setError', null)
    }
  } catch (error) {
    commit('setError', error.message)
  } finally {
    commit('setLoading', false)
  }
}

export const fetchCompanySubmissions = async ({state, commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  try {
    let ref = firebase.database().ref('companies_submission')
    let data = []
    let snapshot = await ref.once('value')
    for (var key of Object.keys(snapshot.val())) {
      let snap = await ref.child(key.toString()).once('value')
      for (var e of Object.entries(snap.val())) {
        let value = {
          id: key,
          activeDialog: false,
          ...e[1]
        }
        if (value.submitby) {
          let user = await firebase.database().ref('users').child(value.submitby.toString()).once('value')
          user = user.val()
          if (user !== null) {
            value.firstname = user.firstname
            value.lastname = user.lastname
            value.uid = user.uid
          }
        }
        if (value.submitted === true) {
          data.push(value)
        }
      }
    }
    commit('setCompanySubmissions', data)
  } catch (error) {
    debugger
  }
}

export const signUserIn = async ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setErrorCode', null)
  commit('setProcess', 'Sign In')
  try {
    await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
  } catch (error) {
    commit('setError', error.message)
    commit('setErrorCode', 'auth')

  } finally {
    commit('setLoading', false)
  }
 
}

export const approveCompanySubmission = async ({state, commit, dispatch}, payload) => {
  commit('setLoading', true)
  try {
    let cid = payload.cid
    let uid = payload.uid
    let submission = await firebase.database().ref(`companies_submission/${cid.toString()}/${uid.toString()}/`).once('value')
    if (submission.val()) {
      submission = submission.val()
    } else {
      throw new Error({message: 'Error reading database'})
    }
    submission.verified = true
    await firebase.database().ref('companies').child(cid.toString()).set(submission)
    submission.rejected = false
    await firebase.database().ref(`companies_submission/${cid.toString()}/${uid.toString()}/`).set(submission)
    for (var value in state.companySubmissions) {
      if (state.companySubmissions[value]['id'] === cid) {
        state.companySubmissions[value]['verified'] = true
      }
    }
    let api = 'https://fed-exchange-api.herokuapp.com/api/v2.0/companydirectory'
    submission.id = cid
    await axios.post(api, submission)
    let snackbar = {
      active: true,
      text: 'Settings Saved'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  } catch (error) {
    commit('setError', error.message)
  } finally {
    commit('setLoading', false)
  }
}

export const rejectCompanySubmission = async ({commit, dispatch}, payload) => {
  commit('setLoading', true)
  try {
    let cid = payload.cid
    let uid = payload.uid
    let submission = await firebase.database().ref(`companies_submission/${cid.toString()}/${uid.toString()}/`).once('value')
    if (submission.val()) {
      submission = submission.val()
    } else {
      throw new Error({message: 'Error reading database'})
    }
    submission.verified = false
    submission.rejected = true
    await firebase.database().ref(`companies_submission/${cid.toString()}/${uid.toString()}/`).set(submission)
    let snackbar = {
      active: true,
      text: 'Settings Saved'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  } catch (error) {
    commit('setError', error.message)
  } finally {
    commit('setLoading', false)
  }
}

export const autoSignIn = async ({commit, dispatch}, payload) => {
  localStorage.setItem('uid', payload.uid)
  await dispatch('fetchCompanyDetails')
  commit('setUser', payload)
}

export const loadUsers = ({ commit }, payload) => {
  commit('saveUsers', payload)
}

export const setError = ({commit}, payload) => {
  commit('setError', payload)
}

export const setProcess = ({commit}, payload) => {
  commit('setProcess', payload)
}

export const loadSettings = ({commit}, payload) => {
  commit('setSettings', payload)
  commit('setPageSettings', payload)
}

export const loadPosts = ({commit}, payload) => {
  commit('savePosts', payload)
}

export const loadGroupPosts = ({commit}, payload) => {
  commit('saveGroupPosts', payload)
}

export const loadEvents = ({commit}, payload) => {
  commit('saveEvents', payload)
}

export const loadGroupEvents = ({commit}, payload) => {
  commit('saveGroupEvents', payload)
}

export const loadCompanies = ({commit}, payload) => {
  commit('saveCompanies', payload)
}

export const updateProfile = async ({commit, dispatch}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  if (payload.tempFile) {
    const storageRef = firebase.storage().ref(`users/${payload.uid}/profile-pic.jpg`)
    try {
      await storageRef.put(payload.tempFile)
    } catch (error) {
      let snackbar = {
        active: true,
        text: error.message
      }
      dispatch('triggerSnackbar', snackbar)
      return null
    }
    try {
      payload.avatar = await storageRef.getDownloadURL()
    } catch (error) {
      let snackbar = {
        active: true,
        text: error.message
      }
      dispatch('triggerSnackbar', snackbar)
    }
  }
  firebase.database().ref('/users/' + payload.uid).set(payload)
    .then(
      value => {
        commit('setProcess', 'Profile Update')
        commit('setLoading', false)
      }
    )
    .catch(
      error => {
        commit('setError', error.message)
      }
    )
}

export const updateHelpRequest = async ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  try {
    const databaseRef = firebase.database().ref(`help/${payload.help_id}`)
    await databaseRef.update({
      reviewed: payload.reviewed
    })
    let snackbar = {
      active: true,
      text: 'Updated'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
    commit('setLoading', false)
    commit('setError', null)
  } catch (errror) {
    commit('setLoading', false)
    commit('setError', errror)
  }
}

export const deleteHelpRequest = async ({state, commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  try {
    const databaseRef = firebase.database().ref(`help/${payload.help_id}`)
    await databaseRef.remove()
    const index = state.helpRequests.indexOf(payload)
    state.helpRequests.splice(index, 1)
    let snackbar = {
      active: true,
      text: 'Deleted the request'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
    commit('setLoading', false)
    commit('setError', null)
  } catch (errror) {
    commit('setLoading', false)
    commit('setError', errror)
  }
}

export const deleteFeedback = async ({state, commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  try {
    const databaseRef = firebase.database().ref(`feedback/${payload.module.toLowerCase()}/${payload.feedback_id}`)
    await databaseRef.remove()
    const index = state.feedbacks.indexOf(payload)
    state.feedbacks.splice(index, 1)
    let snackbar = {
      active: true,
      text: 'Deleted the feedback'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
    commit('setLoading', false)
    commit('setError', null)
  } catch (errror) {
    commit('setLoading', false)
    commit('setError', errror)
  }
}

export const fetchHelpRequests = async ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  try {
    let helpRequests = []
    let helpRequestsData = await firebase.database().ref('/help').once('value')
    if (!helpRequestsData.val()) {
      commit('setHelpRequests', helpRequests)
      commit('setLoading', false)
      commit('setError', null)
      return
    }
    Object.entries(helpRequestsData.val()).forEach(async ([key, value]) => {
      let user = await firebase.database().ref('users/' + value['uid']).once('value')
      user = user.val()
      let company = await firebase.database().ref('companies/' + user.cid.toString()).once('value')
      company = company.val()
      user.companylegalname = company.companylegalname
      user.name = user.firstname + ' ' + user.lastname
      value.user = user
      value.help_id = key
      value.submitdate = (new Date(value.submitdate)).toUTCString()
      helpRequests.push(value)
    })
    commit('setHelpRequests', helpRequests)
    commit('setLoading', false)
    commit('setError', null)
  } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
  }
}

export const fetchFeedbacks = async ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  try {
    let feedbackData = []
    let userFeedbacks = []
    let feedbacksHistory = await firebase.database().ref('/feedback/history').once('value')
    let feedbacksDirectory = await firebase.database().ref('/feedback/directory').once('value')
    let feedbacksOpportunities = await firebase.database().ref('/feedback/opportunities').once('value')
    if (feedbacksHistory) {
      Object.entries(feedbacksHistory.val()).forEach(async ([key, value]) => {
        value.module = 'History'
        value.feedback_id = key
        feedbackData.push(value)
      })
    }
    if (feedbacksOpportunities) {
      Object.entries(feedbacksDirectory.val()).forEach(async ([key, value]) => {
        value.module = 'Directory'
        value.feedback_id = key
        feedbackData.push(value)
      })
    }
    if (feedbacksDirectory) {
      Object.entries(feedbacksOpportunities.val()).forEach(async ([key, value]) => {
        value.module = 'Opportunities'
        value.feedback_id = key
        feedbackData.push(value)
      })
    }
    feedbackData.forEach(async (value) => {
      let user = await firebase.database().ref('users/' + value['uid']).once('value')
      user = user.val()
      let company = await firebase.database().ref('companies/' + user.cid.toString()).once('value')
      company = company.val()
      user.companylegalname = company.companylegalname
      user.name = `${user.firstname} ${user.lastname}`
      value.submitdate = (new Date(value.submitdate)).toUTCString()
      value.user = user
      userFeedbacks.push(value)
    })
    commit('setFeedbacks', userFeedbacks)
    commit('setLoading', false)
    commit('setError', null)
  } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
  }
}

export const uploadImage = ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', `${payload.type} upload`)
  const storageRef = firebase.storage().ref(`site_settings/styles/${payload.type}`)
  let updates = {}
  const task = storageRef.put(payload.file)
  return new Promise((resolve, reject) => {
    task.on('state_changed',
      (snapshot) => {
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      () => {
        commit('setError', 'An error occured, file was not uploaded! Try again')
      },
      () => {
        const photoURL = task.snapshot.downloadURL
        updates[payload.type] = photoURL
        commit('setImage', updates)
        commit('setLoading', false)
        setTimeout(() => {
          let snackbar = {
            active: false,
            text: ''
          }
          commit('setProcess', null)
          commit('triggerSnackbar', snackbar)
        }, 2000)
      })
  })
}

export const addStyle = ({commit, dispatch, state}) => {
  var color = state.settings.styles.general.theme_color_light
  var darkColor = state.settings.styles.general.theme_color_dark
  var primary = `.primary {
    background-color: ${color} !important;
    border-color: ${color} !important;
  }
  .primary--text {
    color: ${color} !important;
  }
  .primary--text input,
  .primary--text textarea {
    caret-color: ${color} !important;
  }
  .primary--after:after {
    background: ${color} !important;
  }
  .application--light {
    color: ${color};
  }
  .k-grid a {
    color: ${color}
  }
`
  var secondary = `.secondary {
      background-color: ${darkColor} !important;
      border-color: ${darkColor} !important;
    }
    .secondary--text {
      color: ${darkColor} !important;
    }
    .secondary--text input,
    .secondary--text textarea {
      caret-color: ${darkColor} !important;
    }
    .secondary--after:after {
      background: ${darkColor} !important;
    }
    .application--dark {
      color: ${darkColor};
    }
  `

  document.getElementById('fav').setAttribute('href', state.settings.styles.general.favicon)
  document.getElementById('fav1').setAttribute('href', state.settings.styles.general.favicon)
  var highcharts = `.highcharts-fill-color rect {
    fill: ${color}
  `
  var style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = primary
  style.innerHTML += secondary
  style.innerHTML += highcharts
  document.getElementsByTagName('head')[0].appendChild(style)
}

export const saveSettings = ({commit, dispatch}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', 'Settings Saved')
  const databaseRef = firebase.database().ref(`site_settings/styles/${payload.type}`)
  databaseRef.set(payload.data)
    .then(
      value => {
        commit('setLoading', false)
        let snackbar = {
          active: true,
          text: 'Settings Saved'
        }
        commit('triggerSnackbar', snackbar)
        commit('setStyles', payload)
        dispatch('addStyle')
        setTimeout(() => {
          let snackbar = {
            active: false,
            text: ''
          }
          commit('setProcess', null)
          commit('triggerSnackbar', snackbar)
        }, 2000)
      }
    ).catch(
      error => {
        commit('setLoading', false)
        let snackbar = {
          active: true,
          text: error.message
        }
        commit('triggerSnackbar', snackbar)
        commit('setError', error.message)
        setTimeout(() => {
          let snackbar = {
            active: false,
            text: ''
          }
          commit('setProcess', null)
          commit('triggerSnackbar', snackbar)
        }, 2000)
      }
  )
}

export const changeStatus = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref(`${payload.type}/${payload.postId}`)
  databaseRef.update({
    approvalStatus: payload.status
  }).then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'Settings Saved'
    }
    commit('changeStatus', payload)
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const updatePriviledge = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref(`level_priviledge/${payload.level}`)
  databaseRef.update(payload.priviledges)
  .then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'Settings Saved'
    }
    // commit('changeStatus', payload)
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const addPriviledge = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref('level_priviledge')
  .child(payload.level.toString())
  databaseRef.set(payload.priviledges)
  .then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'New Role have been added Successfully'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const verifyCompany = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref(`${payload.type}/${payload.postId}`)
  const newUpdate = {
    verified: payload.status
  }
  if (payload.id && payload.id !== 'None') {
    newUpdate.cid = payload.id
  }
  databaseRef.update(newUpdate).then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'Settings Saved'
    }
    commit('verifyCompany', payload)
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const deletePost = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref(`${payload.type}/${payload.postId}`)
  databaseRef.remove().then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'Deleted Successfully'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
    commit('deletePost', payload)
  })
}

export const deleteRole = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref(`level_priviledge/${payload.title}`)
  databaseRef.remove().then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'Deleted Successfully'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
  })
}

export const deleteUser = ({commit}, payload) => {
  commit('setLoading', true)
 // firebase.auth().delete(payload.uid)
  // admin.auth().deleteUser(payload.uid)
  const databaseRef = firebase.database().ref('users/' + payload.uid)
  databaseRef.remove().then(() => {
    commit('setLoading', false)

    let snackbar = {
      active: true,
      text: 'User Deleted Successfully'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
    commit('deleteUser', payload)
  })
}
export const updateUser = ({commit}, payload) => {
  commit('setLoading', true)
  const databaseRef = firebase.database().ref('users/' + payload.uid)
  databaseRef.update({'role': payload.role}).then(() => {
    commit('setLoading', false)
    let snackbar = {
      active: true,
      text: 'User Updated Successfully'
    }
    commit('triggerSnackbar', snackbar)
    setTimeout(() => {
      let snackbar = {
        active: false,
        text: ''
      }
      commit('setProcess', null)
      commit('triggerSnackbar', snackbar)
    }, 2000)
    commit('updateUser', payload)
  })
}
export const savePageSettings = ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  // commit('setProcess', 'Settings Saved')
  const ref = payload.from ? `${payload.from}/${payload.type}` : `${payload.type}`
  const databaseRef = firebase.database().ref(`site_settings/pages/${ref}`)
  databaseRef.set(payload.data)
    .then(
      value => {
        commit('setLoading', false)
        let snackbar = {
          active: true,
          text: 'Settings Saved'
        }
        commit('triggerSnackbar', snackbar)
        commit('setStyles', payload)
        setTimeout(() => {
          let snackbar = {
            active: false,
            text: ''
          }
          commit('setProcess', null)
          commit('triggerSnackbar', snackbar)
        }, 2000)
      }
    ).catch(
      error => {
        commit('setLoading', false)
        let snackbar = {
          active: true,
          text: error.message
        }
        commit('triggerSnackbar', snackbar)
        commit('setError', error.message)
      }
  )
}

export const fetchSettings = ({commit}, payload) => {
  commit('setLoading', true)
  commit('setError', null)
  commit('setProcess', 'Settings Update')
  firebase.database().ref('/settings/').set(payload)
    .then(
      value => {
        commit('setLoading', false)
      }
    )
    .catch(
      error => {
        commit('setLoading', false)
        let snackbar = {
          active: true,
          error: error.message
        }
        commit('triggerSnackbar', snackbar)
        commit('setError', error.message)
        setTimeout(() => {
          let snackbar = {
            active: false,
            text: ''
          }
          commit('setError', null)
          commit('triggerSnackbar', snackbar)
        }, 2000)
      }
    )
}

export const setInitializing = ({commit}, payload) => {
  commit('setInitializing', payload)
}

export const setRouteDetails = ({commit}, payload) => {
  commit('setRouteDetails', payload)
}

export const setHeaderInfo = ({commit}, payload) => {
  commit('setHeaderInfo', payload)
}

export const triggerSnackbar = ({commit}, payload) => {
  commit('triggerSnackbar', payload)
}

export const triggerAlert = ({commit}, payload) => {
  commit('triggerAlert', payload)
}

export const signUserOut = async ({commit}, payload) => {
  localStorage.removeItem('uid')
  await firebase.auth().signOut()
  localStorage.clear()
  sessionStorage.clear()
  indexedDB.deleteDatabase('firebaseLocalStorageDb')
  window.location.reload()
}

export const setCompany = ({commit}, payload) => {
  commit('setCompanyDetails', payload)
}

export const fetchCompanyDetails = ({commit, state}, payload) => {
  let companyLegalName = state.user.cid
  if (companyLegalName) {
    var companylegalname = companyLegalName

    firebase.database().ref(`companies/${companylegalname}`).once('value')
    .then(snapshot => {
      commit('setCompanyDetails', snapshot.val())
    })
  } else {
    commit('setCompanyDetails', {})
  }
}

export const setUrlHash = ({commit}, payload) => {
  var hashUrl = ''
  var values = payload.values
  var keys = Object.keys(values)
  for (var i in keys) {
    if (values && values[keys[i]]) {
      hashUrl += `&${keys[i]}=${values[keys[i]]}`
    }
  }
  history.replaceState(null, null, `#${hashUrl}`)
}
