import Vue from 'vue'
import Router from 'vue-router'

import meta from './meta.json'
import authGaurd from './auth-gaurd.js'
import adminGaurd from './admin-gaurd'
Vue.use(Router)

function route (path, view) {
  return {
    name: view,
    path: path,
    meta: meta[path],
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `../pages/${view}View.vue`
    ),
  }
}

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    return position
  }
}
function adminRoute (path, view) {
  return {
    path: path,
    meta: meta[path],
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `../pages/admin/settings/${view}View.vue`
      ),
    props: meta[path],
    beforeEnter: adminGaurd
  }
}

export default new Router({
  routes: [
    route('/contractors', 'Contractors'),
    route('/recoveryfilter', 'recoveryfilter'),
    route('/forecastfilter', 'forecastfilter'),
    route('/contract-history', 'ContractsHistory'),
    route('/opportunities', 'Opportunities'),
    route('/groups', 'groups'),
    route('/groups/:id', 'groupPage'),
    route('/opportunities/awarded', 'AwardedOpportunities'),
    adminRoute('/admin/settings/home', 'Index'),
    adminRoute('/admin/settings/appearance', 'Appearance'),
    adminRoute('/admin/settings/pages', 'Pages'),
    adminRoute('/admin/settings/users', 'Useradmin'),
    adminRoute('/admin/settings/priviledges', 'Priviledges'),
    adminRoute('/admin/settings/requests', 'Request'),
    adminRoute('/admin/settings/support', 'Support'),
    adminRoute('/admin/settings/gareport', 'Gareport'),
    route('/', 'Index'),
    route('/signup', 'Signup'),
    route('/forgot', 'Forgot'),
    route('/signin', 'Signin'),
    route('/user/profile', 'Profile'),
    route('/user/feed', 'HomePage'),
    route('/questionnaire', 'Questionnaire'),
    route('/company/:name', 'Company'),
    route('/favorites', 'Favorites'),
    route('/tracking', 'Tracking'),
    route('/events', 'Events'),
    route('/404', 'NotFound'),
    { path: '*', redirect: '/404' }

  ],
  scrollBehavior,
  mode: 'history',
  beforeEach: authGaurd
})
