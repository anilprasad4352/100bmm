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
        { text: 'Roboto' },
        {text: 'Roboto Thin'},
        { text: 'Rosario' },
        { text: 'Oswald' }
      ]
    }
  },
  mounted () {
    this.filename = this.value
    this.font_type = this.styles.general.font_types
  },
  watch: {
    styles (val) {

    }
  },
  methods: {
    submitData () {
      const data = {
        type: 'general',
        data: {
          background_color: this.styles.general.background_color,
          background_image: this.styles.general.background_image,
          favicon: this.styles.general.favicon,
          font_color: this.styles.general.font_color,
          font_types: this.font_type,
          font_size: this.styles.general.font_size,
          logo: this.styles.general.logo,
          text: this.styles.general.text,
          theme_color_light: this.styles.general.theme_color_light,
          theme_color_dark: this.styles.general.theme_color_dark
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
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.styles.general[ref] = fileReader.result
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
