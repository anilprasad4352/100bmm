<template>
  <div id="landing-page" v-on:scroll="handleScroll">
    <v-parallax class="no-parallax" :src="site_settings.styles.landing.background_image" :height="parallaxHeight">
      <v-layout id="header-block" row class="header-block">
        <v-flex xs12 class="landing-header">
          <div class="logo-div"><img :src="site_settings.styles.general.logo"></div>
          <div>
            <a @click.prevent="goTo('/signup')" class="btn btn--flat btn--raised theme--dark auth-button">Sign Up</a>
            <a @click.prevent="goTo('/signin')" class="btn btn--flat btn--raised theme--dark auth-button">Sign In</a>
          </div>
        </v-flex>
      </v-layout>
      <v-layout class="parallax-card">
        <v-flex dark class="card-item">
          <div><h3 style="text-align: center; margin-bottom: 15px;">THE ONE-STOP SHOP FOR <br/>YOUR NEXT DEFENSE CONTRACT</h3></div>
          <div><h5 style="text-align: center">SEARCH NEW OPPORTUNITIES, RESEARCH <br/>EXISTING CONTRACTS AND CONNECT NEW <br/>BUSINESS PARTNERS THROUGH THE <br/>GEORGIA DEFENSE EXCHANGE</h5></div>
        </v-flex>
      </v-layout>
      <v-layout class="parallax-buttons">
        <v-flex md6 xs12 sm12 class="get-started-button">
          <v-btn class="signup-button" large block @click.prevent="goTo('/signup')"><span class="button-text">GET STARTED</span></v-btn>
        </v-flex>
        <v-flex md6 xs12 sm12 class="returning-users-button">
          <v-btn class="signin-button" large block @click.prevent="goTo('/signin')"><span class="button-text">RETURNING USERS</span></v-btn>
        </v-flex>
      </v-layout>
    </v-parallax>
    <v-container fluid>
      <v-layout row class="gdx-area">
        <v-flex md9 sm12 class="gdx-area-text">
          <div class="gdx-area-text-div">
            <h3 style="text-align:center; font-size: 1.5rem; margin-bottom: 10px;">INTRODUCING THE ONE-STOP SHOP FOR YOUR NEXT DEFENSE CONTRACT</h3>
            <p class="gdx-paragraph" style="text-align:center">Our directory of Georgia defense contractors provides detailed company profile and contract history. First time user would need to create an account, while returning users just need to sign in.
              Your Company does not need to be a defense contractor yet to search active contract opportunities.</p>
            <v-btn class="signup-button" style="margin: auto;" large @click.prevent="goTo('/signup')"><span class="button-text">SIGN UP</span></v-btn>
          </div>
        </v-flex>
        <v-flex md3 sm12 class="gdx-mid-logo">
          <div class="img-div">
            <img src="/static/images/gdx-logo-white.png">
          </div>
        </v-flex>
      </v-layout>
      <v-layout row class="row-divider">
        <v-divider class="dashed-divider"></v-divider>
      </v-layout>
      <v-layout class="info-text">
        <v-flex><h5 style="text-align: center; color: #303131;">GET STARTED ON THE GEORGIA DEFENSE EXCHANGE</h5></v-flex>
      </v-layout>
      <v-layout row class="info-area">
        <v-flex xs12 class="action-item">
          <v-flex class="action-icon"><i class="fa fa-plus fa-5x"></i></v-flex>
          <v-flex sm12 xs12 class="info-header-container"><h5 class="info-area-header">ADD YOUR COMPANY</h5></v-flex>
          <v-flex sm6 xs12 class="text-div">
            <p class="info-area-text">If you do not see your company in the lookup while creating your account, create a company listing to join the exchange.</p>
          </v-flex>
          <v-flex md6 xs12 class="full-button">
            <v-btn class="signin-button" block large @click.prevent="goTo('/signup')"><span class="button-text">SUBMIT COMPANY</span></v-btn>
          </v-flex>
        </v-flex>
        <v-flex xs12 class="action-item">
          <v-flex class="action-icon"><i class="fa fa-comments fa-5x"></i></v-flex>
          <v-flex sm12 xs12 class="info-header-container"><h5 class="info-area-header">CONNECT AND COLLABORATE</h5></v-flex>
          <v-flex md6 xs12 class="text-div">
            <p class="info-area-text">Connect with other contractors in Georgia. Once your account is approved, you will be able to communicate online.</p>
          </v-flex>
          <v-flex md6 xs12 class="full-button">
            <v-btn class="signin-button" block large @click.prevent="goTo('/signup')"><span class="button-text">LEARN MORE</span></v-btn>
          </v-flex>
        </v-flex>
        <v-flex xs12 class="action-item">
          <v-flex class="action-icon"><i class="fa fa-share-alt fa-5x"></i></v-flex>
          <v-flex sm12 xs12 class="info-header-container"><h5 class="info-area-header">SHARE YOUR FEEDBACK</h5></v-flex>
          <v-flex md6 xs12 class="text-div">
            <p class="info-area-text">Once you have tried the Georgia exchange, share your ideas for updates. We are always looking for new ways to serve the defense industry.</p>
          </v-flex>
          <v-flex md6 xs12 class="full-button">
            <v-btn class="signin-button" large block @click.prevent="goTo('/')"><span class="button-text">PROVIDE INPUT</span></v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
      <v-layout row class="row-divider footer-divider-first">
        <v-divider class="dashed-divider"></v-divider>
      </v-layout>
      <v-layout row class="row-divider footer-divider-second">
        <v-divider class="dashed-divider"></v-divider>
      </v-layout>
    </v-container>
    <v-layout row>
      <v-expansion-panel>
        <v-container>
          <v-expansion-panel-content>
            <div slot="header">
              <h5 class="privacy-header">Legal, Privacy &amp; Copyright Information</h5>
            </div>
            <v-card>
              <v-card-text>
                The Georgia Defense Exchange is compiled from third party sources and is provided “as is” without warranty of any kind. The Georgia Defense Exchange is provided for informational purposes only and the Georgia Department of Economic Development in no way guarantees the accuracy or veracity of the information contained herein nor does the Georgia Department of Economic Development accept any liability for the accuracy, content, completeness, legality, or reliability of the information contained on this website.
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-container>
      </v-expansion-panel>
    </v-layout>
    <site-footer></site-footer>
  </div>
</template>

<script>
  import RegistrationComponent from '../components/modal/RegistrationComponent.vue'
  import 'mdi/css/materialdesignicons.min.css'
  import SiteFooter from '../components/SiteFooter.vue'

  export default {
    components: {
      RegistrationComponent,
      SiteFooter
    },
    data () {
      return {
        parallaxHeight: 600,
        dialog: false,
        active: 'SIGN-UP',
        showHeaderBackground: false
      }
    },
    beforeMount () {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll);
    },
    mounted () {
      document.getElementById('app').style.backgroundColor = this.site_settings.styles.landing.background_color || '#fff'
      document.getElementById('app').style.fontSize = this.site_settings.styles.landing.font_size
    },
    methods: {
      openRegistartionModal () {
        this.trigger = !this.trigger
      },
      goTo (link) {
        this.$router.push(link)
      },
      handleScroll() {
        if (window.scrollY >= 500) {
          document.getElementById('header-block').classList.add('active-background')
        } else {
          document.getElementById('header-block').classList.remove('active-background')
        }
      }
    },
    computed: {
      loading () {
        return this.$store.getters.getLoading
      },
      site_settings () {
        return this.$store.getters.getSettings
      },
      landing_page () {
        return this.$store.getters.getSettings.pages.landing_pages
      },
      sections () {
        return this.$store.getters.getLandingPage
      }
    },
    watch: {
      hash (value) {
        alert(value)
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:900');
  .nav-colored {
    background-color: rgba(0, 0, 0, 0.5);
  }
  h3 {
    font-size: 2rem;
     @media(max-width: 768px) {
       font-size: 1.5rem;
     }
    font-stretch: condensed;
    font-family: 'Roboto';
  }
  h5 {
    font-size: 1.5rem;
    @media(max-width: 768px) {
       font-size: 1rem;
     }
    font-stretch: condensed;
    font-family: 'Roboto';
  }
  .card-item {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: auto;
    padding: 20px 0px;
    background-color: rgba(0,0,0,0.5);
    flex: 0.3 1 auto;
  }
  .row-divider {
    margin: 30px auto;
    @media (min-width: 767px) {
      width: 85%;
    }
  }
  .footer-divider-first {
    margin: 70px auto auto auto;
  }
  .footer-divider-second {
    margin: 100px auto auto auto;
  }
  .dashed-divider { 
    border-top:1px dashed;
    background-color: #bbbbbb;
  }
  .auth-button {
    font-size: 16px;
    font-stretch: condensed;
    color: #FFFFFF;
  }
  .signup-button{
    background-color: #FFFFFF!important;
    color: #049DED;
    font-stretch: condensed;
    border-radius: 5px;
    &:hover {
      color: #049DED;
    }
  }
  .signin-button{
    background-color:#049DED!important;
    color: #FFFFFF;
    font-stretch: condensed;
    border-radius: 5px;
    &:hover {
      background-color: #299b47!important;
    }
  }
   .action-button{
    background-color:#999999!important;
    color: #049DED;
    font-stretch: condensed;
    border-radius: 5px;
  }
  .feedback{
    background-color: #ffa500!important;
    color: #FFFFFF;
  }
  p {
    font-family: 'Roboto';
  }
  .button-text {
    font-family: 'Roboto';
    font-weight: bold;
    font-size: 20px;
  }
  .landing-page {
    height: 100%;
    margin: 0;
  }
  .no-parallax .parallax__image-container .parallax__content{
    padding: 0 !important;
  }
  .header-block {
    max-height: 80px;
    padding: 10px 0 10px 10px;
    position: fixed;
    margin-left: -16px;
    top: 0;
    width: 100%;
  }
  .active-background {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .parallax-card {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    max-height: 400px;
  }
  .parallax-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media(min-width: 768px) {
      width: 30%;
      flex-direction: row;
    }
    width: 100%;
    margin: 50px auto;
    .get-started-button {
      display:flex;
      justify-content: flex-end;
      flex-direction: row;
      margin-top: 10px;
      flex: 1 1 50%;
      @media(min-width: 768px) {
        margin-left: auto;
        margin-right: 5px;
      }
    }
    .returning-users-button {
      display:flex;
      justify-content: flex-start;
      flex-direction: row;
      margin-top: 10px;
      flex: 1 1 50%;
      @media(min-width: 768px) {
        margin-right: auto;
        margin-left: 5px;
      }
    }
  }
  .landing-header {
    padding: 10px 15px 0px 15px; 
    height: 60px;
    display: flex;
    justify-content: row;
    width: 100%;
    div {
      flex: 0 0 auto;
    }
    .logo-div {
      width: 30%;
      height: 100%;
      margin-right: auto;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .gdx-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 767px) {
      width: 80%;
      flex-direction: row;
      margin: 70px auto 80px auto;
    }
    .gdx-area-text {
      background-color: #e4e3e4;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .gdx-area-text-div {
        min-height: 173px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 60px 30px;
        .gdx-paragraph {
          text-align: center;
          font-size: 14px;
          font-family: "Verdana", sans-serif;
          color: #303131;
        }
      }
    }
    .gdx-mid-logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #5d5d5d;
      .img-div {
        height: 173px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 60px 20px;
        img {
          max-height: 100%;
          max-width: 100%;
          vertical-align: middle;
        }
      }
    }
  }
  .info-area {
    display: flex;
    @media(min-width: 768px) {
      margin: 20px auto 50px auto;
    }
  }
  .info-text {
    @media(min-width: 768px) {
      margin: 70px auto 0 auto;
    }
    display: flex;
    justify-content: center;
    color: #303131;
  }
  .info-area-header {
    font-family: 'Roboto';
    font-stretch: condensed;
    font-size: 14px;
    text-transform: uppercase;
    color: #666666;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .info-area-text {
    font-family: 'Verdana';
    font-size: 14px;
    line-height: 20px;
    color: #666666;
  }
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .full-button {
      width: 100%;
    }
    &:last-child {
      @media (min-width: 767px) {
        // margin-right: -9%;
      }
    }
    &:nth-child(1) {
      @media (min-width: 767px) {
        // margin-left: -9%;
      }
    }
    .info-header-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .text-div {
      min-height: 100px;
    }
  }
  .content-area {
    height: 100%;
    margin-bottom: 20px;
    .info-area {
      @media (max-width: 767px) {
        flex-direction: column;
      }
    }
  }
  .privacy-header {
    font-family: 'Roboto';
    font-stretch: condensed;
    font-size: 14px;
    text-transform: uppercase;
    color: #666666;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .bold {
    font-family: 'Alegreya Sans SC', sans-serif;
  }
  .body-bg {
    background: #fff;
  }
  #top {
    position: absolute;
    top: 15px;
    right: 50px;
    color: #fff;
  }
  #footer {
    background: #eeeeee;
    background-color: #e0e0e0;
  }

  .no-box-shadow {
    box-shadow: none;
  }

  .text-uppercase {
    text-transform: uppercase;
  }

  .case-study {
    height: 270px !important;
  }

  .footer-bg {
    background: #f3f3f3;
    height: auto;
  }
</style>
