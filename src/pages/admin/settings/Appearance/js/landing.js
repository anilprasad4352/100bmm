export default{
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
      background_image: null,
      log: null,
      status: '',
      message: '',
      font_type: { text: '' },
      font_types: [
        { text: 'Arial' },
        {text: 'Calibri'},
        { text: 'Open Sans' },
        { text: 'Helvetica' },
        { text: 'Times New Roman' },
        { text: 'Courier' },
        { text: 'Courier New' },
        { text: 'Verdana' },
        { text: 'Georgia' },
        { text: 'Palatino' },
        { text: 'Garamond' },
        { text: 'Bookman' },
        { text: 'Comic Sans Ms' },
        { text: 'Trebuchet MS' },
        { text: 'Impact' },
        { text: 'PT Sans' },
        { text: 'Montserrat' },
        { text: 'League Gothic' },
        { text: 'Signika' },
        { text: 'Josephin Slab' },
        { text: 'Roboto Slab' },
        {text: 'Roboto Thin'},
        { text: 'Rosario' },
        { text: 'Oswald' }
      ]
    }
  },
  watch: {
    value (v) {
      this.filename = v
    }
  },
  mounted () {
    this.filename = this.value
    this.font_type = this.styles.landing.font_types
  },

  methods: {
    submitData () {
      const data = {
        type: 'landing',
        data: {
          background_color: this.styles.landing.background_color,
          background_image: this.styles.landing.background_image,
          font_color: this.styles.landing.font_color,
          font_types: this.font_type,
          font_size: this.styles.landing.font_size,
          text: this.styles.landing.text
        }
      }
      this.$store.dispatch('saveSettings', data)
    },
    selectFile (refId) {
      this.$refs[refId].click()
    },
    onFileChange (event) {
      const ref = event.target.id
      const files = event.target.files
      // let filename = files[0].name
      console.log(files[0].type, 'type')
      if (!files[0].type.match('image.*')) {
        // return message please upload a valid file
        console.log('Please upload a valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.styles.landing[ref] = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      const type = `general/${ref}`
      const payload = {
        type,
        file: files[0]
      }
      this.$store.dispatch('uploadImage', payload)
    }
  }
}
