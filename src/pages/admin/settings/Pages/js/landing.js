import Block from '../sections/single_block.vue'
import MultipleBlock from '../sections/multiple_blocks.vue'
export default {
  components: {
    Block,
    MultipleBlock
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
      ex11: true,
      faq_items: ['block1', 'block2', 'block3', 'block4'],
      footer_items: ['block1', 'block2', 'block3'],
      casestudies_items: ['block1', 'block2', 'block3'],
      intro_items: ['block1', 'block2', 'block3'],
      info_items: ['Information Title and Text'],
      jumbotron_items: ['Jumbotron Title and Text']
    }
  },
  methods: {
    submitData (values, block) {
      values.from = 'landing_pages'
      this.$store.dispatch('savePageSettings', values)
    },
    onChange (data, type) {
      const payload = {
        data,
        type,
        from: 'landing_pages'
      }
      this.$store.dispatch('savePageSettings', payload)
    }
  }
}
