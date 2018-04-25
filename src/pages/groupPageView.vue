<template>
  <v-container fluid :style="{backgroundColor: styles.general.background_color}">
    <div style="width: 100%;">
      <div  style="z-index:-1;">
        <v-tabs style="top:280px;position:absolute;z-index:1;overflow-y:hidden;" fixed centered :scrollable="false" v-model="groupPageTab" grow>
          <v-layout  class="text-xs-center" justify-space-around style="">
            <v-flex sm12 md6 class="pr-2 text-xs-center"  style="overflow-y:hidden;">
              <v-card class="mx-0 mr-4" style="overflow-y:hidden;"  >
                <v-tabs-bar class="white" color="white" dark style=";height:65px;overflow-y:hidden;min-height:100%;" fixed>
                  <v-tabs-slider :color="styles.general.theme_color_dark"></v-tabs-slider>
                  
                  <v-tabs-item href="#tab-1" class="secondary--text" >
                    <div class="tabItem">
                      <v-icon class="secondary--text" >home</v-icon>
                      <span class="secondary--text">Home</span>
                    </div>
                  </v-tabs-item>
                  <v-tabs-item href="#tab-2" class="secondary--text" >
                    <div class="tabItem">
                      <v-icon class="secondary--text">date_range</v-icon>
                      Events
                    </div> 
                  </v-tabs-item>

                  <v-tabs-item href="#tab-3" class="secondary--text">
                    <div class="tabItem">
                      <v-icon class="secondary--text">group</v-icon>
                      Members
                    </div>
                  </v-tabs-item>

                  <v-tabs-item v-if="user && group && user.uid === group.adminId" href="#tab-4" class="secondary--text">
                    <div class="tabItem">
                      <v-icon class="secondary--text">notifications</v-icon>
                      Notifications 
                    </div>
                  </v-tabs-item>

                  <v-tabs-item v-if="user &&  user.uid === group.adminId" href="#tab-5" class="secondary--text">
                    <div class="tabItem">
                      <v-icon class="secondary--text">settings</v-icon>
                      Settings
                    </div>
                  </v-tabs-item>
                </v-tabs-bar>
                <v-divider></v-divider>
              </v-card>          
            </v-flex>
          </v-layout>
        </v-tabs>
      </div>

      <div id="group-cover-photo" :style="{
        'backgroundImage': `url(${tempImgUrl || coverPhoto})`,
        'backgroundSize': 'cover',
        }" style="margin-top: 39px; width: 103%; height: 250px;z-index:3;margin-left:-29px;margin-right:40px;;overflow-x:hidden;">
        <input class="hidden" type="file" @change="setTemp" ref="imgupload" />
        <div class="change-photo" v-if="!modify.changePhoto.hide && user.uid === group.adminId">
          <div class="btn" v-if="!modify.changePhoto.save" @click.prevent="handleModify('changePhoto')">Change Cover photo</div>
          <div class="btn" v-if="modify.changePhoto.save" @click.prevent="saveCoverPhoto">Save Cover Photo</div>
        </div>
        <div class="text-xs-center"></div>
        <div class="group-title" v-if="!modify.groupTitle">
          <v-layout justify-center align-center column>
            <v-flex xs12 md6>
              <h4 class="white--text text-outline" style="font-weight:900;">{{ this.group && this.group.name ? this.group.name : 'Loading...' }}</h4>
              <p class="white--text text-outline" style="font-weight:500;margin-top:-10px;margin-left:-10px;font-size:18px;">
                <v-icon color="white" medium>group</v-icon>
                {{Object.keys(this.group.members).length}} Members
              </p>
            </v-flex>
          </v-layout>
          <v-layout> 
          </v-layout>
        </div>
        <div class="position-photo" v-if="!modify.reposition.hide && user.uid === group.adminId">
          <div class="btn" v-if="!modify.reposition.save" @click.prevent="handleModify('reposition')">Reposition Cover photo</div>
          <div class="btn" v-if="modify.reposition.save" @click.prevent="savePosition">Save Position</div>
        </div>
          <br> 
      </div>
    </div>

    <div style="z-index:1;position:relative;" class="mt-5">
      <v-tabs style="" fixed centered :scrollable="false" v-model="groupPageTab" grow>
        <v-tabs-items>
          <v-tabs-content id="tab-1">
            <v-container style="" fluid>
              <v-layout row wrap>
                <v-flex xs12 md3 hidden-xs-only hidden-sm-only style="postion:relative;z-index:2;">
                  <v-card class="mr-3">
                    <v-card-text>
                      <v-layout justify-center class="mb-2">
                        <img :src="this.group.logo || '/static/images/group-icon.png'" style="height:100px;">
                      </v-layout>
                      <span style="font-size:18px;font-weight:600" :style="{color: styles.general.theme_color_dark}">About {{ this.group && this.group.name ? this.group.name : 'Loading...' }}</span>
                      <p>{{ this.group && this.group.description ? this.group.description : 'Loading...' }}</p>
                      <v-layout>
                        <v-flex xs6>
                          <span style="font-size:18px;font-weight:600" class="py-5" :style="{color: styles.general.theme_color_dark}">Members</span>
                        </v-flex>
                        <v-flex xs6 >
                          <div style="float:right;">
                            <a :style="{color:  styles.general.theme_color_dark}" style="cursor:pointer" @click="groupPageTab='tab-3'" >See All </a>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout v-if="this.group" class="mt-2">
                        <v-flex xs2 v-for="(user, index) in firstFiveMembers" :key="index">
                          <v-avatar v-if="user">
                            <img :src="user.avatar"/>
                          </v-avatar>
                        </v-flex>
                        <br>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md6>
                  <new-activity

                    v-if="(group.members[user.uid] && group.members[user.uid].approvalStatus==1 && privileges.groups && privileges.groups.post_to_group) || group.adminId === user.uid"
                    :firstname="user.firstname"
                    :type="type"
                    :extraData="setGroupPostData"
                    :extraUrl="extraUrl">
                  </new-activity>
                  <v-divider></v-divider>
                  <timeline
                    :item="item"
                    :user="item.user"
                    :itemKey="item.postKey"
                    v-for="item in feed"
                    :key="item.postKey"
                    :type="type"
                    :extraUrl="extraUrl">
                  </timeline>
                  <div v-if="!feed.length" style="text-align: center; padding-top: 40px">
                    <h5 class="black--text">No Group Activity yet</h5>
                  </div>
                  <v-divider></v-divider>
                  <v-flex xs12 md12 class="load-data-div">
                    <button @click.prevent="counterPost()" class="btn btn--raised btn--round theme--dark load-more" :color="styles.general.theme_color_light">Load More</button>
                  </v-flex>
                </v-flex>

                <v-flex xs12 md3 hidden-xs-only>
                  <!-- <invite-user :group="group" :groupId="groupId" style="display:none;"/> -->
                  <TopEvents :groupId="strippedGroupId" :add="group.members[user.uid].approvalStatus == 1"/>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tabs-content>
        </v-tabs-items>
        <v-tabs-items>
          <v-tabs-content id="tab-2">
            <v-container>
              <v-layout row wrap>
                <v-flex md12>
                  <events-tab :groupId="strippedGroupId" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-tabs-content>
        </v-tabs-items>
        <v-tabs-items>
          <v-tabs-content id="tab-3">
            <v-container>
              <v-layout>
                <members :group="group" :groupId="strippedGroupId" />
              </v-layout>
            </v-container>
          </v-tabs-content>
        </v-tabs-items>
        <v-tabs-items>
          <v-tabs-content id="tab-4">
            <notifications :groupId="strippedGroupId" />
          </v-tabs-content>
        </v-tabs-items>
        <v-tabs-items>
          <v-tabs-content id="tab-5">
            <settings :group="group" :groupId="strippedGroupId" />
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
    <full-view-chat />
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import NewActivity from '../components/CreateActivityComponent.vue'
  import EventsTab from './grouppage/events.vue'
  import Notifications from './grouppage/notifications.vue'
  import Top5 from './grouppage/top5/Top5.vue'
  import Timeline from '../components/Timeline.vue'
  import Settings from './grouppage/settings.vue'
  import TopEvents from './grouppage/events/Top5Events.vue'
  import InviteUser from './grouppage/inviteUser.vue'
  import Members from './grouppage/members.vue'
  import SideboxChat from '@/components/chat/sideboxChat.vue'
  import FullViewChat from '@/components/chat/fullviewChat.vue'
  import UserInfo from './grouppage/UserInfo.vue'

  let db = Vue.prototype.$firebase.database()

  export default {
    components: {
      NewActivity,
      Top5,
      Notifications,
      Settings,
      EventsTab,
      SideboxChat,
      InviteUser,
      Members,
      Timeline,
      FullViewChat,
      TopEvents,
      UserInfo
    },
    data () {
      return {
        groupPageTab: 'tab-1',
        firstFiveMembers: [],
        dialog: true,
        count: 0,
        items: [],
        tempImgUrl: null,
        tempFile: null,
        feed: [],
        counter: 10,
        disableCoverPhotoSaveButton: false,
        modify: {
          reposition: {
            hide: false,
            save: false
          },
          changePhoto: {
            hide: false,
            save: false
          },
          groupTitle: false
        },
        type: 'groupposts',
        groupUsers: []

      }
    },
    firebase() {
      return {
        getGroup: db.ref('groups').orderByKey().equalTo(`-${this.$route.params.id}`),
        groupPosts: db.ref('groupposts').child(`/-${this.$route.params.id}`),
        groupMembers: db.ref('groups').child(`-${this.$route.params.id}/members`)
      }
    },
    created() {
      this.getGroup
    },
    mounted() {
      this.getPostsWithUser
      this.getMembers
    },
    computed: {
      privileges () {
        return this.$store.getters.getUserPrivileges
      },
      group() {
        return this.getGroup[0]
      },
      groupId() {
        return this.getGroup[0].groupId
      },
      user () {
        return this.$store.getters.getUserDetails
      },
      strippedGroupId() {
        return this.group.groupId.replace('-', '')
      },
      groupName () {
        return this.group.name
      },
      coverPhoto () {
        return this.group.coverPhoto.url
      },
      coverBackgroundPosition () {
        return this.group.coverPhoto.backgroundPosition
      },
      styles () {
        return this.$store.getters.getStyles
      },
      setGroupPostData() {
        return {
          groupId: this.groupId,
        }
      },
      extraUrl() {
        return `/${this.getGroup[0].groupId}`
      },
      getPostsWithUser() {
        const self = this
        return this.$firebaseRefs.groupPosts.orderByChild("approvalStatus").equalTo(1).limitToLast(this.counter).on('value', function(result) {
          if (result.val()) {
            const results = result.val()
            const postKeys = Object.keys(results)
            const userIds = self._.uniq(postKeys.map(post => results[post].uid))
  
            const userInfo = userIds.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })
  
            Promise.all(userInfo)
              .then((users) => {
                self.items = []
                self.feeds = []
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
      },
      getMembers() {
        const self = this
        return this.$firebaseRefs.groupMembers.orderByChild("approvalStatus").equalTo(1).on('value', function(result) {
          if (result.val()) {
            const results = result.val()
            const membersKeys = Object.keys(results)
  
            const userInfo = membersKeys.map(id => {
              return self.$firebase.database().ref('users/' + id).once('value')
            })
  
            Promise.all(userInfo)
              .then((users) => {
                self.groupUsers = []
                self.firstMembers = []
                users.forEach((user) => {
                  self.groupUsers.push(user.val())
                })
                self.firstFiveMembers = self.groupUsers.slice(0, 5)
              })
          } else {
            self.firstFiveMembers = []
          }
        })
      }
    },
    methods: {
      pickFile () {
        this.$refs.imgupload.click()
      },
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
        self.feed = []
        this.getGroupPosts(this.counter)
      },
      getGroupPosts(counter) {
        let self = this
        this.$firebase.database().ref().child(`groupposts/${this.groupId}`).orderByChild("approvalStatus").equalTo(1).limitToLast(counter).once('value', function (snapshot) {
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
      setTemp () {
        const self = this
        const reader = new window.FileReader()
        const blob = this.$refs.imgupload.files[0]
        this.tempFile = blob
        reader.onload = (e) => {
          self.tempImgUrl = reader.result
        }
        reader.readAsDataURL(blob)
      },
      saveCoverPhoto () {
        const self = this
        const storageRef = this.$firebase.storage().ref(`group/${this.groupId}/coverPhoto.jpg`)
        this.disableCoverPhotoSaveButton = true
        storageRef.put(this.tempFile).then(res => {
          if (res.state === 'success') {
            self.$firebase.database().ref(`groups/${self.groupId}/coverPhoto/url`).set(res.downloadURL)
            self.disableCoverPhotoSaveButton = false
            self.modify = {
              reposition: {
                hide: false,
                save: false
              },
              changePhoto: {
                hide: false,
                save: false
              },
              groupTitle: false
            }
          }
        })
      },
      savePosition () {
        this.$firebase.database().ref(`groups/${this.groupId}/coverPhoto/backgroundPosition`).set(this.coverBackgroundPosition)
        window.$('#group-cover-photo').backgroundDraggable('disable')
        this.modify = {
          reposition: {
            hide: false,
            save: false
          },
          changePhoto: {
            hide: false,
            save: false
          },
          groupTitle: false
        }
      },
      handleModify (modifier) {
        if (modifier === 'reposition') {
          const self = this
          window.$('#group-cover-photo').backgroundDraggable({
            done () {
              const backgroundPosition = window.$('#group-cover-photo').css('background-position')
              self.coverBackgroundPosition.x = backgroundPosition.split(' ')[0]
              self.coverBackgroundPosition.y = backgroundPosition.split(' ')[1]
            }
          })
          this.modify = {
            reposition: {
              hide: false,
              save: true
            },
            changePhoto: {
              hide: true,
              save: false
            },
            groupTitle: true
          }
        } else if (modifier === 'changePhoto') {
          this.modify = {
            reposition: {
              hide: true,
              save: false
            },
            changePhoto: {
              hide: false,
              save: true
            },
            groupTitle: true
          }
          this.pickFile()
        } else if (modifier === 'groupTitle') {
          this.modify = {
            reposition: {
              hide: true,
              save: false
            },
            changePhoto: {
              hide: false,
              save: false
            },
            groupTitle: false
          }
        }
      }
    }
  }
</script>

<style>

  .tabItem
  {text-transform:capitalize;color:#000;font-size:19px;font-weight:500;margin-left:-20px;overflow-y: hidden;}

  .change-photo {
    padding-top: 15px;
    width: auto;
    float: right;
  }
  .position-photo {
    padding-top: 15px;
    width: auto;
    float: right;
  }
  #group-cover-photo .btn {
    padding: 8px;
    background: rgba(255, 255, 255, 0.22);
    border: 1px solid #fff;
    color: #fff;
    cursor: pointer;
  }
  #group-cover-photo .btn:hover {
    background: rgba(255, 255, 255, 0.55);
  }
  #group-cover-photo  {
    background: rgba(255, 255, 255, 0.55);
    -webkit-filter: grayscale()(60%); /* Safari 6.0 - 9.0 */
    filter: grayscale(65%);
  }
.load-more{
padding:7px;
}
.load-data-div{
text-align:center;
}
  .group-title {
    padding-top: 80px;
    /* width: 500px; */
    text-align: center;
    /* margin-left: auto;
    margin-right: auto; */
  }
  .tab-white-transparent {
    background: rgb(235,235,235);
    background: -moz-linear-gradient(top, rgba(235,235,235,1) 0%, rgba(230,230,230,1) 50%, rgba(223,223,223,1) 51%, rgba(254,254,254,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(235,235,235,1) 0%,rgba(230,230,230,1) 50%,rgba(223,223,223,1) 51%,rgba(254,254,254,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(235,235,235,1) 0%,rgba(230,230,230,1) 50%,rgba(223,223,223,1) 51%,rgba(254,254,254,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ebebeb', endColorstr='#fefefe',GradientType=0 );
  }
  .tabs__wrapper {
    overflow: hidden !important;
    overflow-y: hidden;
  }

  .text-outline {
    color: #fff;
    text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px,
                 #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;
    -webkit-font-smoothing: antialiased;
  }
</style>

