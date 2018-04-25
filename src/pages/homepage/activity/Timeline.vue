<template>
  <div >
    <v-card class="my-3">
      <v-list two-line dense class=""> 
        <v-list-tile avatar>
          <v-list-tile-avatar >
            <img :alt="item && item.avatar ? item.avatar : 'default-avatar.gif'" :src="item && item.avatar ? item.avatar : require('@/assets/images/default-avatar.gif')">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title :style="{color: styles.general.theme_color_dark}" style="font-size:15px;font-weight:900;text-transform:capitalize;">{{ item.firstname + ' ' + item.lastname}}</v-list-tile-title>
            <v-list-tile-sub-title ><div style="color:#000;font-size:15px;">{{ item.jobtitle }} <span v-if="item.jobtitle">|</span> {{ item.companylegalname }} </div></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
              <v-icon class="secondary--text" style="cursor:pointer" v-if="likes[item.postKey] && likes[item.postKey].includes(getUserDetails.uid)" @click.prevent="unLikePost(item, itemKey)">fa-thumbs-up</v-icon>
              <v-icon style="cursor: pointer" v-else @click.prevent="likePost(item, itemKey)">fa-thumbs-o-up</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-layout class="px-3 mb-3">
        <span style="white-space: pre-wrap;">{{item.content}}</span>
        
       
      </v-layout>
      <v-layout row wrap>
        <v-flex v-if="item.video" :class="{ 'xs12': true, 'md6': item.video && item.attatchmentUrl, 'md12': item.video && !item.attatchmentUrl}">
          <iframe allowfullscreen style="width: 100%; height: 260px;border:0px" :src="item.video.embedUrl"></iframe>
        </v-flex>
        <v-flex v-if="item.attatchmentUrl" :class="{ 'xs12': true, 'md6': item.attatchmentUrl && item.video, 'md12': item.attatchmentUrl && !item.video  }" class="text-xs-center">
          <img :src="item.attatchmentUrl" style="width: 100%; height: auto;" class="py-2"/>
        </v-flex>
      </v-layout>
      <v-layout>
      </v-layout>
      <v-layout row>
        <v-flex md12 style="font-size: 13px;" >
          <v-subheader class="pl-0"><span class="pl-3" style="font-weight: 900;" :style="{color: styles.general.theme_color_dark}"><a :style="{color: styles.general.theme_color_dark}"  style="cursor: pointer;font-weight:900;font-size:15px;" @click.prevent="toggleComments">Comments ({{ item.comments.length || 0 }})</a> <span>·</span> Likes ({{ item.likes.length }})</span></v-subheader>
          <v-divider class="mt-0 px-2"></v-divider>
        </v-flex>
      </v-layout>
      <!-- <v-layout>
        <v-flex md12 class="pt-2 pr-2">
          
        </v-flex>
      </v-layout> -->
      <v-list three-line dense style="" :class="{ 'hidden': !showComments }" v-if="item.comments.length > 0">
        <v-list-tile avatar v-for="comment in  item.comments" v-bind:key="comment.comment + comment.date + comment.user">
          <v-list-tile-avatar>
            <img :alt="comment && comment.user.avatar ? comment.user.avatar : 'default-avatar.gif'" :src="comment && comment.user.avatar ? comment.user.avatar : require('@/assets/images/default-avatar.gif')">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title :style="{color: styles.general.theme_color_dark}" style="font-size:15px;font-weight:900;text-transform:capitalize;">{{ comment.user.firstname + ' ' + comment.user.lastname}}</v-list-tile-title>
            <v-list-tile-sub-title>{{ comment.comment }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
             <span>{{ comment.date | fromNow }}</span>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider :class="{ 'hidden': !showComments }" v-if="item.comments.length > 0"></v-divider>
      <v-layout row wrap>
        <v-flex md9 xs12 sm12>
          <v-text-field class="mt-0" full-width single-line label="Leave a comment" v-model="comment" style="padding-bottom: 0px;height:100%">
          </v-text-field>
        </v-flex>
        <v-flex md3 xs12 sm12>
          <div class="text-xs-center pt-2" style="float: right">
            <v-btn @click.prevent="postComment(item.postKey)" round :style="{color: styles.general.theme_color_dark}" flat style="font-weight:900;font-size:22px;" dark>Post</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import 'mdi/css/materialdesignicons.min.css'

  export default {
    props: ['item', 'itemKey', 'likes'],
    data () {
      return {
        comment: '',
        showComments: false,
        count: 0,
        items: [],
        feed: [],
        user: this.getUserDetails,
		divcount: 0
      }
    },
    computed: {
      ...mapGetters([
        'getUserDetails'
      ]),
      styles () {
	 console.log(this.item,'pagechae')
        return this.$store.getters.getStyles
      }
    },
    methods: {
      likePost (item, key) {
        const self = this

        this.$firebase.database().ref(`posts/${item.postKey}/likes/${this.getUserDetails.uid}`).set(this.getUserDetails.uid).then((snap) => {
          self.likes[item.postKey].push(this.getUserDetails.uid)
        })
      },
      unLikePost (item, key) {
        const self = this

        this.$firebase.database().ref(`posts/${item.postKey}/likes/${this.getUserDetails.uid}`).remove().then((snap) => {
          for(var i = self.likes[item.postKey].length - 1; i >= 0; i--) {
            if(self.likes[item.postKey][i] === self.getUserDetails.uid) {
              self.likes[item.postKey].splice(i, 1);
            }
          }
          
        })
      },
      async postComment (postKey) {
        if (this.comment === '') {
          let snackbar = {
            active: true,
            text: 'Please enter something'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          return null
        }
        var self = this
        const comment = {
          user: this.getUserDetails,
          comment: this.comment,
          date: Date.now()
        }
        await this.$firebase.database().ref(`posts/${postKey}/comments`).push().set(comment).then((snapshot) => {
          this.comment = ''
          this.$emit('postComment', {comment: comment, key: self.itemKey})
        })
      },
      toggleComments () {
        if (this.showComments) {
          this.showComments = false
          return false
        }
        this.showComments = true
        return true
      },
      async getPhotoUrl (uid, index) {
        try {
		   let self = this
          let user = await this.$firebase.database().ref('users/' + uid).once('value')
          user = user.val()
          this.items[index]['avatar'] = user.avatar
		  self.divcount = self.divcount + 1
          this.items[index]['divcount'] = self.divcount
        } catch (error) {
          console.log(error)
          this.items[index]['avatar'] = 'https://randomuser.me/api/portraits/men/88.jpg'
        }
      }
    }
  }

</script>
<style>
  .background-image {
    background-position-y: center;
    background-size: cover;
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    bottom: 0;
  }

  .icon-red i {
    color: #ff1b00 !important;
  }

  .icon-blue i {
    color: #0388d1 !important;
  }

  .com-like {
    background: rgb(66, 66, 66);
    color: #fff;
    padding-top: 6px;
    border-radius: 0px 20px 20px 0px;
    padding-right: 17px;
    padding-bottom: 6px;
  }
  .hidden {
    display: none;
  }
</style>


