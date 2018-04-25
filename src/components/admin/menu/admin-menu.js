export default {
  data () {
    return {
      items: [
        {title: 'Home', icon: 'home'},
        {title: 'Users', icon: 'person'},
        {title: 'Analytics', icon: 'trending_up'},
        {title: 'Settings', icon: 'settings'}
      ],
      mini: true,
      dark: true,
      right: null,
      clipped: false
    }
  },
  computed: {
    client () {
      return this.$store.getters.getClientDetails
    },
    user () {
      return this.$store.getters.getUserDetails
    },
    isActive: {
      get () {
        return this.$store.getters.getSidebar.active
      },
      set (val) {
        this.$store.commit('toggleSidebar', val)
      }
    },
    isMini: {
      get () {
        return this.$store.getters.getSidebar.mini
      },
      set (val) {
        this.$store.commit('minimizeSidebar', val)
      }
    }

  }
}
