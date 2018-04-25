<template>
  <v-container fluid style="padding:0px;"> 
    <v-layout row wrap>
      <v-flex md6 sm12 xs12 class="new-info-table">
        <v-expansion-panel  >
          <v-expansion-panel-content class="white--text" :style="{backgroundColor: styles.general.theme_color_light}"   v-for="(item,i) in 1" :key="i" v-bind:value="item === 1">
            <div slot="header" style="text-transform:uppercase;" ><h5 style="margin-bottom: 0px; font-size:18px;">New Users</h5></div>
            <v-card>
              <v-card-text class="grey lighten-3" style="padding:0px">
                <table class="datatable table table_data">
                  <thead>
                    <tr>
                      <th>Image </th>
                      <th>Name </th>
                      <th>Company</th>
                      <th>Email by</th>
                      <th>Job title</th>
                    </tr>
                  </thead>
                  <tr v-for="(user, index) in topusers" :key="index" class="listx">
                    <td style="width: 10%;"><img :src="user.avatar" class="avatar img-avatar"/></td>
                    <td style="width: 10%;"><span> {{ user.firstname }} {{ user.lastname }}</span></td>
                    <td style="width: 30%;"><span> {{ user.companylegalname }} </span></td>
                    <td style="width: 25%;"><a :href="user.email" :style="{color: styles.general.theme_color_light}">{{ user.email }}</a></td>
                    <td style="width: 25%;">{{ user.jobtitle }}</td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex md6 sm12 xs12 style="padding-left:10px;">
        <v-expansion-panel >
          <v-expansion-panel-content class="white--text" :style="{backgroundColor: styles.general.theme_color_light}"  v-for="(item,i) in 1" :key="i" v-bind:value="item === 1">
            <div slot="header" style="text-transform:uppercase;"><h5 style="margin-bottom: 0px;font-size:18px;">New Companies</h5></div>
            <v-card>
              <v-card-text class="grey lighten-3" style="padding:0px">
                <table class="datatable table table_data">
                  <thead>
                    <tr>
                      <th>Logo </th>
                      <th>Company </th>
                      <th>State</th>
                      <th>Submitted by</th>
                      <th>Approval date</th>
                    </tr>
                  </thead>
                  <tr v-for="(user, index) in topcompanies" :key="index" class="listx">
                    <td class="company-logo" style="width: 35%;"><img :src="user.companylogo" class="avatar img-avatar"/></td>
                    <td style="width: 30%;"><span> {{ user.companylegalname }}</span></td>
                    <td style="width: 5%;"><span> {{ user.state }}</span> </td>
                    <td style="width: 20%;"> {{ user.firstname }} {{ user.lastname }} </td>
                    <td style="width: 10%;">{{ user.submitdate }}</td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    computed: {
      events () {
        return this.$store.getters.fetchEvents
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
      allEvents () {
        if (this.currentStatus || this.currentStatus === 0 || this.currentDate) {
          return this.events.filter((event) => event.approvalstatus === this.currentStatus || event.date < this.currentDate)
        }
        return this.events
      },
	   styles () {
        return this.$store.getters.getStyles
      }
    },
    data () {
      return {
        search: '',
        e1: '',
        pagination: {},
        dialog: false,
        currentStatus: '',
        currentEventId: '',
        currentDate: '',
        view_dialog: false,
		topusers: [],
		topcompanies: [],
        headers: [
          {
            text: 'Submit Date',
            align: 'left',
            sortable: false,
            value: 'eventdate'
          },
          {
            text: 'Company',
            value: 'user',
            align: 'center',
            sortable: false
          },
          {
            text: 'Event Title',
            value: 'title',
            align: 'center',
            sortable: false
          },
          {
            text: 'Event Date',
            align: 'center',
            sortable: false,
            value: 'posteddate'
          },
          {
            text: 'Status',
            value: 'status',
            align: 'center',
            sortable: false
          },
          {
            text: 'Actions',
            value: 'action',
            align: 'center',
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
            text: 'Option 1'
          },
          {
            text: 'Option 2'
          },
          {
            text: 'Option 3'
          }
        ],
        items: []
      }
    },
    methods: {
	 async getPhotoUrl (uid, index) {
          let user = await this.$firebase.database().ref('users/' + uid).once('value')
          return user
        },
      changeStatus (status, postId) {
        const payload = {
          type: 'events',
          status,
          postId
        }
        this.$store.dispatch('changeStatus', payload)
      },
      filterStatus (status) {
        this.currentStatus = status
      },
	  
      deleteRow () {
        const payload = {
          type: 'events',
          postId: this.currentEventId
        }
        this.$store.dispatch('deletePost', payload)
      },
      assignId (postId) {
        this.currentEventId = postId
      }
    },
	mounted () {
	  var self = this
	  var fb = this.$firebase.database().ref()
	  self.topusers = []
	  self.topcompanies = []
      this.$firebase.database().ref().child('users').orderByChild('createdAt').limitToLast(5).on('value', function (snapshot) {
	  self.topusers = []
        snapshot.forEach(function (childSnapshot) {         
          var childKey = childSnapshot.key
          var childData = childSnapshot.val()	
          fb.child('companies/'+childData.cid.toString()).on('value', function (snapshot) {
		  var cdata = snapshot.val()
		  childData.companylegalname = cdata.companylegalname
		   })
		     self.topusers.push(childData)		
        })
       
      })
	
        
		
	   fb.child('companies').orderByChild('submitdate').limitToLast(5).on('value', function (snapshot) {
	   self.topcompanies = []
        snapshot.forEach(function (childSnapshot) {
          const comments = []
          let i
          let j
          const likes = []
          var childKey = childSnapshot.key
          var childData = childSnapshot.val()	
		  var showdata = {}
		  showdata.companylegalname = childData.companylegalname
		  if(childData.companylogo==null){
		 showdata.companylogo = '/static/img/default-user.png'
		   
		  }else{
		  showdata.companylogo = childData.companylogo
		  
		  }
		  showdata.phonenumber = childData.phonenumber
		  showdata.state = childData.state
		  showdata.primarynaicscode = childData.primarynaicscode
		  if(childData.submitdate!='' && childData.submitdate!=null){
		  showdata.submitdate = childData.submitdate
		  }else{
		  showdata.submitdate = " "
		  }
		  if(childData.submitby!=null && childData.submitby!=''){
        fb.child('users/' + childData.submitby.toString()).once('value', function(mediaSnap) {
        var udata=mediaSnap.val()
		showdata.firstname = udata.firstname
		showdata.lastname = udata.lastname
		showdata.email = udata.email
    });
	}
		     self.topcompanies.push(showdata)		
        })
       
      })
	}
  }
</script>
<style lang="scss" scoped>
  #right {
    float: right !important;
  }
  .listx {
    height: 70px;
    padding: 10px 0;
  }
  td {
    text-align: center;
  }
  thead {
    text-align: center;
  }
  .img-avatar {
    height: 50px;
  }
  .new-info-table {
    margin-bottom: 20px;
  }
  .new-info-table:first-child {
    @media (max-width: 767px) {
      margin-right: 20px;
    }
  }
</style>
