<template>
  <v-container style="padding-top: 100px" fluid :style="{backgroundColor: styles.general.background_color}">
    <v-layout row wrap>
      <v-flex xs12 md3 hidden-xs-only hidden-sm-only>
        <user-info keep-alive></user-info>
      </v-flex>
      <v-flex xs12 md6 class="feed-timeline pl-2">
        <v-flex xs12>
              <v-layout class="text-xs-center mb-4" style="height:150px;">
                <v-flex xs4 
                  style="background-size:cover;"
                  :style="{backgroundImage: 'url('+item.background+')'}"
                  class="mx-3 placeholder-thumb" 
                  @click="goTo(item.link);"
                  v-for="item in menuData"
                  :key="item.title"
                >
                  <span class="primary text-align-center">
                    <div class="vertical-center">
                      {{item.title}}
                    </div>
                  </span>
                </v-flex>
              </v-layout>

        </v-flex>
        <new-activity :firstname="user.firstname" :type="type" :extraData="extraData" :extraUrl="url" v-if="privileges.activity_stream && privileges.activity_stream.post_to_activity"></new-activity>
        <v-divider></v-divider>
		    <div id="feed-timeline-data">
          <timeline
            :item="item"
            :user="item.user"
            :itemKey="item.postKey" 
            v-for="item in feed"
            :key="item.postKey"
            :type="type"
            :extraUrl="url"></timeline>
    		</div>
		    <v-divider></v-divider>
		    <v-flex xs12 md12 class="load-data-div">
		      <button @click.prevent="counterPost()" class="btn btn--raised btn--round theme--dark primary load-more">Load More</button>
		    </v-flex>
      </v-flex>
      <v-flex xs12 md3 hidden-xs-only>
        <top5></top5>
        <TopEvents />
      </v-flex>
    </v-layout>
    <full-view-chat />
    <!-- <sidebox-chat /> -->
  </v-container>
</template>
<style scoped>

  .placeholder-thumb {
    -webkit-filter: contrast(80%);
    filter: contrast(80%);
    position:relative;
  }

  .placeholder-thumb:hover {
    -webkit-filter: contrast(100%);
    filter: contrast(100%);
    background-size:cover;
    position:relative;
    cursor: pointer;
  }

  .placeholder-thumb span {
    width:inherit;
    position: absolute;
    left:0;
    width:100%;
    color:white;
    height:40px;
    bottom: 0;
    opacity: 0.8;
    font-weight: 900;
  }
  .placeholder-thumb:hover span {
    opacity: 1;
  }

  
  .vertical-center {
    -webkit-transform: translateY(50%);
    -ms-transform: translateY(50%);
    transform: translateY(50%);
  }

  .content{
    background: #fff;
    height:100%;
  }
  .load-more{
    padding:7px;
  }
  .load-data-div{
    text-align:center;
  }
  .post-msg{
    color: #4caf50;
    font-size: 20px;

    padding-left: 20px;
    padding-right: 40px;
    margin-top: 10px;
    border-radius: 4px;
	}
  #alert-div, #alert-div-post{
  display:none;
  }
  .close-btn{
      color: #ffffff;
      text-decoration: none;
  }

  ul.info-list li a{
    font-size:13px !important;
    color:#929292 !important;
  }
  .award-ytd{

    font-weight:700;
    padding-top:15px;
  }
  .light-blue{
    background:#31572c !important;
  }
  .highcharts-color-1 {
    fill:#577194 ;
  }
  .highcharts-legend, .highcharts-credits{
    display:none;
    height:0px !important;
  }
</style>
<script>
  import Vue from 'vue'

  import NewActivity from '../components/CreateActivityComponent.vue'
  import Top5 from './homepage/top5/Top5.vue'
  import Timeline from '../components/Timeline.vue'
  import TopEvents from './homepage/events/Top5Events.vue'
  import Footer from './homepage/events/Footer.vue'
  import SideboxChat from '@/components/chat/sideboxChat.vue'
  import FullViewChat from '@/components/chat/fullviewChat.vue'
  import UserInfo from './homepage/UserInfo.vue'

  let db = Vue.prototype.$firebase.database()
  export default {
    data () {
      return {
        dialog: true,
        count: 0,
        items: [],
        likes: {},
        feed: [],
        counter: 10,
        type: 'posts',
        extraData: {},
        url: '',
        menuData: [
          {
            background: '/static/images/planes.jpg',
            link: '/contractors',
            title: 'CONTRACTOR DIRECTORY'
          },
          {
            background: '/static/images/mechanic.jpg',
            link: '/contract-history',
            title: 'CONTRACT HISTORY'
          },
          {
            background: '/static/images/cybersecurity.jpg',
            link: '/opportunities',
            title: 'CONTRACT OPPORTUNITIES'
          }
        ]
      }
    },
    components: {
      NewActivity,
      Top5,
      SideboxChat,
      Timeline,
      FullViewChat,
      TopEvents,
	    Footer,
      UserInfo
    },
    firebase() {
      return {
        posts: db.ref('posts')
      }
    },
    computed: {
      privileges () {
        return this.$store.getters.getUserPrivileges
      },
      user () {
        return this.$store.getters.getUserDetails
      },
      styles() {
        return this.$store.getters.getStyles
      },
      getPostsWithUser() {
        const self = this
        return this.$firebaseRefs.posts.orderByChild("approvalStatus").equalTo(1).limitToLast(this.counter).on('value', function(result) {
          if (result.val()) {
            const results = result.val()
            const postKeys = Object.keys(results)
            const userIds = self._.uniq(postKeys.map(post => results[post].uid))
            self.items = []
  
            const userInfo = userIds.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })
  
            Promise.all(userInfo)
              .then((users) => {
                users.forEach((user) => {
                  postKeys.forEach((post) => {
                    if (results[post].uid === user.val().uid) {
                      let item = results[post]
                      self.$firebase.database().ref('companies/' + user.val().cid).once('value').then((company) => {
                        item.company = {}
                        Object.assign(item.company, company.val())
                        item.postKey = post
                        item.avatar = user.val().avatar
                        item.user = {}
                        Object.assign(item.user, user.val())
                        self.items.push(item)
                        self.feed = self.items.sort((d1, d2) => new Date(d2.posteddate).getTime() - new Date(d1.posteddate).getTime())
                      })
                    }
                  })
                })
              })
          } else {
            self.feed = []
          }
        })
      }
    },
    mounted() {
      this.getPostsWithUser
    },
    methods: {
      getUserInfo (uid, index) {
        return this.$firebase.database().ref('users/' + uid).once('value')
      },

      getCompanyInformation(cid, index) {
        return this.$firebase.database().ref('companies/' + cid).once('value');
      },

      counterPost () {
        let self = this
        self.counter = self.counter + 10
        self.items = []
        self.count = 0
        self.getPosts(self.counter)
      },

      getPosts(counter) {
        let self = this
        this.$firebase.database().ref().child('posts').orderByChild("approvalStatus").equalTo(1).limitToLast(counter).once('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key
            var childData = childSnapshot.val()
            self.getUserInfo(childData.uid, self.count)
            .then((result) => {
              childData.user = result.val()
              childData.avatar = childData.user.avatar
            })
            .then(() => {
              if (childData.user.cid) {
                return self.getCompanyInformation(childData.user.cid, self.count)
              }
            })
            .then((value) => {
              if (value) {
                childData.company = value.val()
              }
            })
            .then(() => {
              self.items.push(childData)
              self.items[self.count]['postKey'] = childKey
              self.count += 1
              self.feed = self.items.sort((d1, d2) => new Date(d2.posteddate).getTime() - new Date(d1.posteddate).getTime())
            })
          })
        })
      },

      goTo (link) {
        this.$router.push(link)
      }
    }
  }
</script>
