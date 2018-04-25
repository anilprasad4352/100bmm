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
  data: function () {
    return {
      status: '',
      items: ['Edit Opportunities Page Text']
    }
  },
  methods: {
    submitData (values) {
      this.$store.dispatch('savePageSettings', values)
    }
  }
}
