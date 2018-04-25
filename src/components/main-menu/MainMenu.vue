<template>
  <div class="text-xs-center">
    <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="200"
      v-model="menu"
      full-width
      allow-overflow
      min-width="375px"
      style="color: #606060;"
    >

      <v-btn icon large  slot="activator">
        <v-icon style="height:60px;" x-large class="hidden-sm-and-down" >apps</v-icon>
      </v-btn>    
          
      <v-card>
        <v-card-text>
          <p class="subheading" style="color: #606060;"><b>Explore</b></p>
          <v-divider></v-divider>
          <br>
          <v-layout>    
            <v-flex xs4 @click="goTo('/contractors')">
              <v-btn large flat class="menu-item" >
              <div style="color:#606060">Directory</div>
              </v-btn>
            </v-flex>

            <v-flex xs4  @click="goTo('/opportunities')">
              <v-btn flat large class="menu-item" >
              <div style="color:#606060">Opportunities</div>
              </v-btn>
            </v-flex>

            <v-flex xs4 >
              <v-btn flat class="menu-item" @click="goTo('/contract-history')">
              <div style="color:#606060">History</div>
              </v-btn>
            </v-flex>
                
          </v-layout>
          <v-layout>
            <v-flex xs4 >
              <v-btn large flat class="menu-item" >
              <div style="color:#606060">Data<br>Exploration</div>
              </v-btn>
            </v-flex>

            <v-flex xs4 >
              <v-btn large flat class="menu-item" >
              <div style="color:#606060">Economic<br>Impact</div>
              </v-btn>
            </v-flex>

            <v-flex xs4 >
              <v-btn flat class="menu-item" @click="goTo('/user/feed')">
              <div style="color:#606060">Home</div>
              </v-btn>
            </v-flex>
          </v-layout>
          <br>
          <p class="subheading"  style="color: #606060;"><b>Other Features</b></p>
          
          <v-divider></v-divider>
          <br>

          <v-layout>
            <!-- <v-flex xs4 >
              <v-btn flat class="menu-item" @click="goTo('/groups')">
              <div style="color:#606060">Groups</div>
              </v-btn>
            </v-flex> -->

            <v-flex xs4 v-if="isAdmin">
              <v-btn flat class="menu-item" @click="goTo('/admin/settings/home/')">
              <div style="color:#606060">Admin<br>Module</div>
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn flat class="menu-item" @click="goTo('/questionnaire')">
              <div style="color:#606060">Add Your<br>Company</div>
              </v-btn>
            </v-flex>
            <!-- <v-flex xs4 >
              <v-btn flat class="menu-item" @click="goTo('/opportunities/awarded')">
              <div style="color:#606060">Awarded<br>Opportunities</div>
              </v-btn>
            </v-flex>

            <v-flex xs4 >
              <v-btn flat class="menu-item" @click="goTo('/recoveryfilter')">
              <div style="color:#606060">Recovery<br>Opportunities</div>
              </v-btn>
            </v-flex>-->    
          </v-layout>
          <!--<v-layout>
            <v-flex xs4 >
              <v-btn flat class="menu-item" @click="goTo('/forecastfilter')">
              <div style="color:#606060">Opportunities<br>Forecast</div>
              </v-btn>
            </v-flex>
          </v-layout>-->
        </v-card-text> 
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
          scrolled: false,
          menu: false
      }
    },
    computed: {
      user () {
        return this.$store.getters.getUserDetails
      },
      isAdmin() {
        if (this.$store.getters.getUserDetails.role === 1) {
          return true
        }
        return false
      }
    },
    watch: {
      scrolled (val) {
        if(val) {
          this.menu = false
        }
      }
    },
    methods: {
      handleScroll () {
        this.scrolled = window.scrollY > 0;
      },
      goTo (link) {
        this.menu = false
        this.$router.push(link)
      }
    },
    created () {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
  
</script>

<style>
  .menu-item { 
    width: 120px;
    border: 1px solid #bcbcbc;
    
    color: #606060;
    height: 70px;
    
    font-size: 14px;
    font-weight: 600;
    overflow-wrap: break-word;
    text-transform: capitalize;
      
  }
</style>
