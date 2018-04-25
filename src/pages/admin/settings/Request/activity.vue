<template>
  <v-container fluid>
    <v-layout row wrap> 
      <v-flex xs12 sm12>
        <v-card>
          <v-card-title>
            <v-flex xs2 class="mr-4">
              <v-card flat>
                <v-select
                  :items="status_filter"
                  v-model="currentStatus"
                  label="Status"
                  single-line
                  bottom
                ></v-select>
              </v-card>
            </v-flex>
            <v-flex xs2 class="mr-4">
              <v-card flat>
                <v-select
                  :items="default_filter"
                  v-model="dateRange"
                  label="Date Range"
                  single-line
                  bottom
                ></v-select>
              </v-card>
            </v-flex>
            <v-flex xs3 class="mr-4">
              <v-card flat>
                <v-text-field
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                  v-model="search"
                ></v-text-field>
              </v-card>
            </v-flex>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="feeds"
            v-bind:search="search"
            :pagination.sync="pagination"
            :rows-per-page-items="[15, 25, 50, 100]"
          >
          <!-- <template slot="headers" scope="props">
            <tr>

              <th v-for="header in props.headers" :key="header.text"
                  :class="[pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
              >
                {{ header.text }}
              </th>
              <th>
                Actions
              </th>
            </tr>
          </template> -->
            <template slot="items" slot-scope="props">
              <td style="width: 5%;">{{ props.item.posteddate | actualDate }}</td>
              <td style="width: 20%;">
                <span class="avatar ml-2" style="height: 24px; width: 24px;">
                  <img :src="returnLogo(props.item.avatar)">
                </span>
                <span>{{ props.item.firstname }} {{ props.item.lastname }}</span>
              </td>
              <td style="width: 15%;">{{ props.item.companylegalname }}</td>
              <td style="width: 30%;">{{ props.item.content | sliceText }}</td>
              <td style="width: 10%;">{{ props.item.approvalStatus | status }}</td>
              <td style="width: 20%;">
                <v-layout row wrap>
                  <v-flex md4 sm6 xs6>
                    <v-tooltip top>
                      <v-btn
                        @click.prevent="changeStatus(1, props.item.id)"
                        slot="activator"
                        :disabled="props.item.approvalStatus === 1"
                        icon class="green--text">
                        <v-icon>done</v-icon>
                      </v-btn>
                      <span>Approve</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex md4 sm6 xs6>
                    <v-tooltip top>
                      <v-btn
                        @click.prevent="changeStatus(2, props.item.id)"
                        slot="activator"
                        :disabled="props.item.approvalStatus === 2"
                        icon class="red--text">
                        <v-icon>clear</v-icon>
                      </v-btn>
                      <span>Reject</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex md4 sm3 xs6>
                    <v-dialog v-model="props.item.activeDialog" lazy absolute max-width="790px">
                      <v-btn slot="activator" icon class="blue--text">
                        <v-icon>remove_red_eye</v-icon>
                      </v-btn>
                      <v-card>
                        <v-layout row>
                          <v-flex xs12 sm12>
                            <v-card>
                              <v-toolbar card color="white" prominent>
                                <v-toolbar-title class="body-2 grey--text">Post Details</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-tooltip top>
                                  <v-btn slot="activator" class="red--text darken-1" icon @click.native="props.item.activeDialog = false">
                                    <v-icon>clear</v-icon>
                                  </v-btn>
                                  <span>Close</span>
                                </v-tooltip>
                              </v-toolbar>
                              <v-divider></v-divider>
                              <v-list two-line dense class="pa-3">
                                <v-list-tile-content>
                                  <v-list-tile-title>{{ props.item.firstname + ' ' + props.item.lastname}}</v-list-tile-title>
                                  <v-list-tile-sub-title>{{ props.item.jobtitle }} <span v-if="props.item.jobtitle">|</span> {{ props.item.companylegalname }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <!-- <v-list-tile-action v-bind:class="{ 'icon-red': likes[item.postKey] && likes[item.postKey].includes(getUserDetails.uid) }">
                                    <v-icon style="cursor: pointer" @click.prevent="likePost(item, key)">mdi-thumb-up</v-icon>
                                </v-list-tile-action> -->
                              </v-list>
                            </v-card>
                            <v-card-text style="height: 100px;">{{ props.item.content }}</v-card-text>
                            <v-divider class="mt-0 px-2"></v-divider>
                            <v-card class="pa-3">
                              <v-layout row wrap>
                                <v-flex v-if="props.item.video" :class="{ 'xs12': true, 'md6': props.item.video && props.item.attatchmentUrl, 'md12': props.item.video && !props.item.attatchmentUrl}">
                                  <iframe allowfullscreen style="width: 100%; height: 260px;border:0px" :src="props.item.video.embedUrl"></iframe>
                                </v-flex>
                                <v-flex v-if="props.item.attatchmentUrl" :class="{ 'xs12': true, 'md6': props.item.attatchmentUrl && props.item.video, 'md12': props.item.attatchmentUrl && !props.item.video  }" class="background-image" :style="{ 'backgroundImage': `url(${props.item.attatchmentUrl})` }">
                                </v-flex>
                              </v-layout>
                            </v-card>
                            <v-card-actions></v-card-actions>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 sm3>
                    <v-dialog v-model="dialog" lazy absolute>
                      <v-btn
                        slot="activator"
                        icon
                        @click.prevent="assignId(props.item.id)"
                        class="red--text">
                        <v-icon>delete_forever</v-icon>
                      </v-btn>
                      <v-card>
                        <v-card-title>
                          <div class="headline">Really delete?</div>
                        </v-card-title>
                        <v-card-text>Are you sure you want to delete '{{ props.item.name }}'?</v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn class="blue--text darken-1" flat="flat" @click.native="dialog = false">No</v-btn>
                          <v-btn class="blue--text darken-1" flat="flat" @click.native="deleteRow()">Yes</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                </v-layout>
              </td>
            </template>
            <template slot="pageText" slot-scope="{ pageStart, pageStop }">
              From {{ pageStart }} to {{ pageStop }}
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import moment from 'moment'

  export default {
    computed: {
      posts () {
        return this.$store.getters.fetchFeeds
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
      },
      feeds () {
        if (this.currentStatus || this.currentStatus === 0 || this.dateRange !== 0) {
          let dateAfter = moment().clone().subtract(this.dateRange, 'days').startOf('day')
          return this.posts.filter((post) => {
            if (this.currentStatus) {
              return post.approvalStatus === this.currentStatus
            }
            if (this.dateRange !== 0) {
              return moment(post.posteddate).isAfter(dateAfter)
            }
          }).sort((d1, d2) => new Date(d2.submitdate).getTime() - new Date(d1.submitdate).getTime())
        } else {
          return this.posts.sort((d1, d2) => new Date(d2.posteddate).getTime() - new Date(d1.posteddate).getTime())
        }
      }
    },
    data () {
      return {
        search: '',
        e1: '',
        currentPostId: '',
        pagination: {
          rowsPerPage: 15
        },
        dialog: false,
        currentStatus: '',
        dateRange: 0,
        view_dialog: false,
        headers: [
          {
            text: 'Post Date',
            align: 'left',
            sortable: false,
            value: 'posteddate'
          },
          {
            text: 'User',
            value: 'user',
            align: 'left',
            sortable: false
          },
          {
            text: 'Company',
            value: 'companylegalname',
            align: 'left',
            sortable: false
          },
          {
            text: 'Content',
            value: 'content',
            align: 'left',
            sortable: false
          },
          {
            text: 'Status',
            value: 'status',
            align: 'left',
            sortable: false
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'left',
            sortable: false
          }
        ],
        status_filter: [
          {
            text: 'All',
            value: ''
          },
          {
            text: 'Approved',
            value: 1
          },
          {
            text: 'Pending',
            value: 0
          },
          {
            text: 'Rejected',
            value: 2
          }
        ],
        default_filter: [
          {
            text: 'All',
            value: 0
          },
          {
            text: 'Last 24hrs',
            value: 1
          },
          {
            text: 'Last 7 days',
            value: 7
          },
          {
            text: 'Last 30 days',
            value: 30
          }
        ],
        items: []
      }
    },
    methods: {
      changeStatus (status, postId) {
        const payload = {
          type: 'posts',
          status,
          postId
        }
        this.$store.dispatch('changeStatus', payload)
      },
      returnLogo (logo) {
        if (!logo) {
          return '/static/images/default_company_logo.png'
        }
        return logo
      },
      filterStatus (status) {
        this.currentStatus = status
      },
      assignId (postId) {
        this.currentPostId = postId
      },
      deleteRow () {
        const payload = {
          type: 'posts',
          postId: this.currentPostId
        }
        this.$store.dispatch('deletePost', payload)
        this.dialog = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .background-image {
    background-position-y: center;
    background-size: cover;
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    right: 0;
    height: 260px;
    bottom: 0;
  }
</style>