<template>
  <v-dialog :max-width="600" v-model="openModal" persistent>
      <v-card>
        <form @submit.prevent="createGroup">
          <v-card-title class="primary white--text" dark  style="position:relative;height:100px;" >
            <v-layout justify-center align-center >
              <v-btn icon><v-icon small dark>create</v-icon></v-btn>
              Group Cover Image
            </v-layout>
            <v-layout justify-center style=";position:absolute;bottom:-35px;left:20px;" @click.prevent="groupPhotoUploaded=true">
              <div style="height:65px;width:65px;border-radius:10px;" class="grey lighten-4 text-xs-center">
                <v-icon class="secondary--text vertical-center">assignment</v-icon>
              </div>
              <v-card v-if="groupPhotoFile!=''" class="mt-0 pt-0">
                <div style="width:100%">
                  <v-btn icon class="" id='close' @click.prevent="cancelGroupPhoto()">
                    <v-icon small style="font-size: 15px;" >close</v-icon>
                  </v-btn>
                  <img :src="groupPhotoFileURL" id="imgActivity" style="width: 50px; height: 50px;">
                </div>
              </v-card>
            </v-layout>
          </v-card-title>
          <v-card-text class="mt-5">
            <v-layout column>
              <v-flex xs12>
                <v-text-field required v-model="group.name" class="white--text title-input" label="Group Name" style="border: 1px solid rgba(255,255,255,0.2);" prepend-icon="create"></v-text-field>
              </v-flex>
              <v-flex xs12 >
                <v-text-field
                  v-model="group.description" style="margin-top: 0px;" :rows="3" required multi-line label="Type a decription for your group" prepend-icon="create"/>
                </v-flex>
              <v-flex xs12>
                <v-select v-model="group.category" label="Category" required prepend-icon="menu" :items="categories"></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="group.keywords"
                  label="Type keywords and press enter to add them"
                  prepend-icon="assignment"
                  :items="keywords"
                  chips
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text style="margin-top: -30px;">
            <v-layout wrap row> 
              <v-flex md12>
                <v-select
                  style="margin-top: 0;"
                  label="Select privacy"
                  required
                  return-object
                  v-model="group.privacy"
                  :items="[{ text: 'Public Group', value: 1 }, { text: 'Closed Group', value: 2 }]"
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="white--text" color="red darken-1" @click.prevent="closeCreateGroupModal()">Cancel</v-btn>
            <v-btn type="submit" class="white--text" color="blue darken-1">Create</v-btn>
          </v-card-actions>
          <file-upload :trigger.sync="groupPhotoUploaded" @cancel="cancel" :formats="['jpeg','png','jpg']" v-model="groupPhotoFile" @confirm="showGroupPhoto()"></file-upload>
        </form>
      </v-card>
  </v-dialog>
</template>
<script>
  import FileUpload from '../../components/FileUploadComponent'
  export default {
    props: ['dialog'],
    components: {
      FileUpload
    },
    data () {
      return {
        keywords: [],
        groupPhotoUploaded: false,
        groupPhotoFile: '',
        groupPhotoFileName: '',
        groupPhotoFileURL: '',
        categories: [
          'Construction',
          'Defense',
          'Finance',
          'Information Technology',
          'Logistics',
          'Manufacturing',
          'R&D',
          'Retail',
          'Service',
          'Surplus Dealer',
          'Telecommunications',
          'Wholesale',
          'Total Small Business',
          'Competitive 8(a)',
          'Veteran-Owned Small Business',
          'Service-Disabled Verteran-Owned Small Business',
          'Woman Owned Small Business',
          'Economically Disadvantaged Woman Owned Small Business'
        ],
        group: {
          name: '',
          members: {},
          coverPhoto: {
            url: 'https://static.pexels.com/photos/380769/pexels-photo-380769.jpeg',
            backgroundPosition: {
              x: '',
              y: ''
            }
          },
          category: null,
          privacy: null,
          description: '',
          admin: {},
          posts: [],
          notifications: [],
          keywords: []
        }
      }
    },
    computed: {
      openModal  () {
        return this.dialog
      },
      user () {
        return this.$store.getters.getUserDetails
      }
    },
    methods: {
      async createGroup () {
        let group = this.group
        group.adminId = this.user.uid
        group.members[this.user.uid] = Object.assign({}, {
          approvalStatus: 1,
          memberRole: 'admin',
          uid: this.user.uid,
          dateAdded: Date.now()
        })
        const newGroupKey = this.$firebase.database().ref().child('groups').push().key
        group.groupId = newGroupKey
        var storageRef = this.$firebase.storage().ref()
        var groupPhotoRef = storageRef.child(`groups/${newGroupKey}/group-photo/attachment.jpg`)
        try {
          if (this.groupPhotoFileName !== '') {
            await groupPhotoRef.put(this.groupPhotoFile[0])
          }
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          return null
        }
        var imageUrl = ''
        try {
          if (this.groupPhotoFileName !== '') {
            imageUrl = await storageRef.child(`groups/${newGroupKey}/group-photo/attachment.jpg`).getDownloadURL()
          }
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          return null
        }
        group.logo = imageUrl

        try {
          await this.$firebase.database().ref(`groups/${newGroupKey}`).set(group)
          this.content = ''
          this.cancelGroupPhoto()
          let snackbar = {
            active: true,
            text: 'Group was created successfully'
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          this.group = {
            name: '',
            members: {},
            coverPhoto: {
              url: 'https://static.pexels.com/photos/380769/pexels-photo-380769.jpeg',
              backgroundPosition: {
                x: '',
                y: ''
              }
            },
            privacy: {},
            description: '',
            admin: {},
            posts: [],
            notifications: [],
            keywords: []
          }
          this.$store.dispatch('toggleGroupModal', false)
        } catch (error) {
          let snackbar = {
            active: true,
            text: error.message
          }
          this.$store.dispatch('triggerSnackbar', snackbar)
          return null
        }
      },
      cancel () {
        this.groupPhotoUploaded = false
        this.groupPhotoFile = ''
      },
      closeCreateGroupModal () {
        this.$emit('closeCreateGroupModal')
      },
      showGroupPhoto () {
        if (FileReader && this.groupPhotoFile && this.groupPhotoFile.length) {
          var fr = new FileReader()
          fr.onload = function () {
            this.groupPhotoFileURL = fr.result
            document.getElementById('imgActivity').src = fr.result
          }
          fr.readAsDataURL(this.groupPhotoFile[0])
        }
        this.groupPhotoFileName = this.groupPhotoFile[0].name
        this.groupPhotoUploaded = false
      },
      cancelGroupPhoto () {
        this.groupPhotoUploaded = false
        this.groupPhotoFile = ''
        this.groupPhotoFileName = ''
        this.groupPhotoFileURL = ''
      }
    }
  }
</script>

<style scoped>

  .title-input ::-webkit-input-placeholder { /* Chrome */
    color: white;
    padding:10px;
  }
  .title-input :-ms-input-placeholder { /* IE 10+ */
    color: white;
    padding:10px;
  }
  .title-input :-moz-placeholder { /* Firefox 19+ */
    color: white;
    opacity: 1;
    padding:10px;
  }
  .title-input :-moz-placeholder { /* Firefox 4 - 18 */
    color: white;
    opacity: 1;
    padding:10px;
  } 
  .vertical-center {
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
