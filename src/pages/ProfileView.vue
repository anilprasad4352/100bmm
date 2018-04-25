<template>
  <v-container class="px-5 pa-4">
    <v-card class="mt-5">
        <v-tabs class="pd-0" dark fixed>
          <v-tab class="header primary" href="#account-settings">Account Settings</v-tab>
          <v-tab class="header primary" href="#security-settings">Security Settings</v-tab>
          <v-tab-item id="account-settings">
            <form @submit.prevent="handleUpdateProfile">
              <input class="hidden" type="file" @change="setTemp" ref="imgupload" />
              <v-layout row wrap class="pl-3 pt-3">
                <div class="profile-pic round">
                  <img :src="tempImgUrl || user.avatar" :alt="user.firstname" />
                  <v-layout justify-center row align-center @click="pickFile" class="profile-upload-overlay">
                    <div>
                      <v-icon dark>mdi-camera</v-icon><br/>
                      <span>Upload image</span>
                    </div>
                  </v-layout>
                </div>
              </v-layout>
              <v-layout row wrap class="pt-3">
                <v-flex xs6 md12 class="text-align-left" >
                    <alert v-if="error && updateProcess" :text="error" color="error" @dismissed="onDismiss" class="py-2"></alert>
                    <alert v-if="updateProcess && !error" :text="'Successfully updated profile details'" color="success"  @dismissed="onDismiss" class="py-2"></alert>
                </v-flex>
                <v-flex xs6 md3 class="text-align-left mx-4">
                  <v-text-field
                    label="Email"
                    v-model="user.email"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 md3 class="text-align-left mx-4">
                  <v-text-field
                    label="First Name"
                    v-model="user.firstname"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 md3 class="text-align-left mx-4">
                  <v-text-field
                    label="Last name"
                    v-model="user.lastname"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 md3 class="text-align-left mx-4">
                    <v-text-field
                      label="Job Title"
                      v-model="user.jobtitle"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 md3 class="text-align-left mx-4">
                    <v-text-field
                      label="Department"
                      v-model="user.department"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 md3 class="text-align-left mx-4">
                  <v-text-field
                    label="Company Name"
                    v-model="companylegalname"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 md3 class="text-align-left mx-4">
                  <v-text-field
                    label="Website"
                    v-model="businesswebsite"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs7 class="text-align-right mx-0">
                  <v-layout right>
                    <v-btn dark class="primary tex-align-right" type="submit" :disable="loading" :loading="loading">
                      Update
                      <span slot="loader" class="custom-loader">
                            <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </form>
          </v-tab-item>
          <v-tab-item id="security-settings">
            <form @submit.prevent="changePassword">
              <v-layout class="px-3 pt-3" row wrap>
                <v-flex md12>
                  <alert v-if="passwordUpdatedError.length" :text="passwordUpdatedError" color="error"  @dismissed="removePasswordAlert" class="py-2"/>
                  <alert v-if="passwordUpdated" :text="'Successfully updated password'" color="success"  @dismissed="removePasswordAlert" class="py-2"/>
                </v-flex>
                <v-flex md12>
                  <h6>Change password</h6>
                </v-flex>
                <v-flex md4>
                  <v-text-field
                    class="pt-0"
                    type="password"
                    placeholder="New Password"
                    v-model="newPassword"
                  />
                </v-flex>
                <v-flex md12>
                  <v-btn type="submit" primary class="ml-0">
                    Change Password
                  </v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-tab-item>
        </v-tabs>
    </v-card>
    <!-- <sidebox-chat /> -->
    <full-view-chat />
  </v-container>
</template>
<style>
  .profile-pic.round {
    position: relative;
    border-radius: 100%;
    height: 200px;
  }
  .profile-pic.round > .profile-upload-overlay {
    width: 100%;
    cursor: pointer;
    display: none;
    border-radius: 100%;
    height: 200px;
    position: absolute;
    top: 0;
    background: rgba(62, 58, 58, 0.9)
  }
  .profile-upload-overlay div {
    margin-right: auto;
    margin-left: auto;
    width: 90px;
    text-align: center;
    margin-top: 80px;
    color: #fff
  }
  .profile-pic.round:hover > .profile-upload-overlay {
    display: block;
  }
  .profile-pic.round img {
    border-radius: 100%;
    width: 200px;
    height: 200px;

  }
</style>


<script>
  import SideboxChat from '@/components/chat/sideboxChat.vue'
  import FullViewChat from '@/components/chat/fullviewChat.vue'
  import 'mdi/css/materialdesignicons.min.css'
  import MainMenu from '../components/main-menu/MainMenuComponent.vue'
  import UserToolbar from '../components/Toolbar.vue'
  import Alert from '../components/Alert.vue'
  export default {
    components: {
      MainMenu,
      SideboxChat,
      FullViewChat,
      UserToolbar,
      Alert
    },
    data () {
      return {
        drawer: true,
        h1: window.title,
        tempImgUrl: null,
        newPassword: '',
        passwordUpdatedError: '',
        passwordUpdated: false,
        tempFile: null,
		businesswebsite:'',
		companylegalname:''
      }
    },
    mounted () {
      this.h1 = document.title
    },
    computed: {
      user () {
	  let self = this
	  var udata = this.$store.getters.getUserDetails
	  this.$firebase.database().ref('companies/'+udata.cid.toString()).once('value')
        .then(
          snapshot => {
            var cdata = snapshot.val()
			self.businesswebsite = cdata.businesswebsite
			self.companylegalname = cdata.companylegalname
          }
        )
        return udata
      },
      client () {
        return this.$store.getters.getClientDetails
      },
      loading () {
        return this.$store.getters.getLoading
      },
      error () {
        return this.$store.getters.getError
      },
      updateProcess () {
        return this.$store.getters.getProcess === 'Profile Update'
      }
    },
    methods: {
      changePassword () {
        const user = this.$firebase.auth().currentUser
        user.updatePassword(this.newPassword).then(res => {
          this.passwordUpdated = true
          this.newPassword = ''
        }).catch(err => {
          this.passwordUpdatedError = err
          this.newPassword = ''
        })
      },
      removePasswordAlert () {
        this.passwordUpdatedError = ''
        this.passwordUpdated = false
      },
      handleUpdateProfile () {
        const update = Object.assign({}, this.user, { tempFile: this.tempFile })
        this.$store.dispatch('updateProfile', update)
      },
      pickFile () {
        this.$refs.imgupload.click()
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
      onDismiss () {
        this.$store.dispatch('setError', null)
        this.$store.dispatch('setProcess', 'null')
      },
      triggerDrawer () {
        this.drawer = !this.drawer
      }
    }
  }
</script>
