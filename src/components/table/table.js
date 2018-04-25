import axios from 'axios'
import TableFilters from './TableFilters.vue'

export default {
  props: ['headers', 'url', 'filters'],
  components: {
    TableFilters
  },
  data () {
    return {
      search: '',
      totalItems: 0,
      items: [],
      loading: true,
      pagination: {}
    }
  },
  watch: {
    pagination: {
      handler () {
        this.getDataFromApi()
          .then(data => {
            this.loading = false
            this.items = data.data
            this.totalItems = Number(data.data[0].count)
          })
      },
      deep: true
    }
  },
  mounted () {
    console.log(this.filters, 'filters')
    this.getDataFromApi()
      .then(data => {
        this.loading = false
        this.items = data.items
        this.totalItems = Number(data.total)
      })
  },
  methods: {
    getDataFromApi () {
      const { sortBy, descending, page, rowsPerPage } = this.pagination

      return axios.get(`${this.url}?take=${rowsPerPage}&skip=${rowsPerPage * (page - 1)}&page=${page}&pageSize=${rowsPerPage}`)
    },
    getUsers () {
    }
  }
}
