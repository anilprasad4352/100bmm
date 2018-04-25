import Block from '../sections/single_block.vue'

export default{
  components: {
    Block
  },
  props: ['settings'],
  computed: {
    styles () {
      return this.$store.getters.getStyles
    },
    loading () {
      return this.$store.getters.getLoading
    },
    error () {
      return this.$store.getters.getError
    },
    updateProcess () {
      return this.$store.getters.getProcess === 'Settings Saved'
    },
    process () {
      return this.$store.getters.getProcess
    }
  },
  data () {
    return {
      status: '',
      items: ['Edit Favorites Page Text']
    }
  },
  methods: {
    submitData (values) {
      this.$store.dispatch('savePageSettings', values)
    }
  }
}
