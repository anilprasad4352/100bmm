<template>
  <div class="footer-item">
    <v-layout row wrap class="before-footer-content">
      <v-container></v-container>
    </v-layout>
    <v-divider style="background-color: #d5e14d"></v-divider>
    <v-layout row wrap>
      <v-container>
        <v-layout row wrap>
          <v-flex md4 hidden-sm-down class="vertical-divider">
            <v-flex md12 class="column">
              <h3>INDUSTRIES IN GEORGIA</h3>
              <v-flex>
                <ul class="industry-item">
                  <li v-for="(industry, index) in industries" :key="index"><a :href="industry.link" target="blank">{{industry.name}}</a></li>
                </ul>
              </v-flex>
            </v-flex>
          </v-flex>
          <v-flex md4 hidden-sm-down class="vertical-divider">
            <v-flex md12 class="column">
              <h3>COMPETITIVE ADVANTAGE</h3>
              <a v-for="(advantage, index) in competitiveAdvantages" :key="index" :href="advantage.link" target="blank">{{advantage.name}}</a>
            </v-flex>
            <v-flex class="divider-flex-rows" md12>
              <v-divider style="background-color: #6d6d6d;"></v-divider>
            </v-flex>
            <v-flex md12 class="column">
              <h3>BUSINESS RESOURCES</h3>
              <a v-for="(resource, index) in businessResources" :key="index" :href="resource.link" target="blank">{{resource.name}}</a>
            </v-flex>
          </v-flex>
          <v-flex md4 xs12 class="vertical-divider">
            <v-flex md12 class="social-media-footer column">
              <v-flex md-12></v-flex>
              <v-flex md-12>
                <h3>CONNECT WITH US</h3>
                <v-icon dark medium>mdi-email</v-icon>
                <v-icon dark medium>mdi-facebook-box</v-icon>
                <v-icon dark medium>mdi-twitter</v-icon>
                <v-icon dark medium>mdi-linkedin</v-icon>
                <v-icon dark medium>mdi-youtube-play</v-icon>
                <v-icon dark medium>mdi-instagram</v-icon>
                <v-icon dark medium>mdi-rss</v-icon>
              </v-flex>
            </v-flex>
            <v-flex md12 class="divider-flex-rows">
              <v-divider style="background-color: #6d6d6d;" class="rows"></v-divider>
            </v-flex>
            <v-flex md12 class="contact-us column">
              <h3>CONTACT US</h3>
              <a href="http://www.georgia.org/about-us/contact-us/">Use our Contact form</a>
              <p>Call us at +1-404-962-4000</p>
              <p>+1-800-255-0056 for the hearing impaired</p>
              <p>Georgia Department of Economic Development</p>
              <p>Technology Square, 75 5th Street N.W., Suite 1200 Atlanta, GA 30308</p>
            </v-flex>
          </v-flex>
        </v-layout>      
        <v-flex md12 class="divider-layout-rows">
          <v-divider style="background-color: #6d6d6d;" class="rows"></v-divider>
        </v-flex>
        <v-layout row>
          <v-flex md12 class="site-map site-map-divider">
            <div class="site-map-column"><img   src="/static/images/footer-we_speak_business.png"/></div>
            <div class="site-map-column"><a href="http://www.georgia.org/sitemap" target="blank">Site Map</a></div>
            <div class="site-map-column"><a href="http://www.exploregeorgia.org/?_ga=2.117864841.1812343620.1523235297-576062532.1522934539" target="blank">ExploreGeorgia.org</a></div>
            <div class="site-map-column"><a href="http://www.gaarts.org/" target="blank">GaArts.org</a></div>
            <div class="site-map-column"><a href="http://siteselector.georgia.org/?_ga=2.117864841.1812343620.1523235297-576062532.1522934539" target="blank">GeorgiaSiteSelector</a></div>
          </v-flex>
        </v-layout>
        <v-flex md12 class="divider-layout-rows">
          <v-divider style="background-color: #6d6d6d;" class="rows"></v-divider>
        </v-flex>
        <v-layout row>
          <v-flex md12 class="footer-copyright">
            <p>&copy; {{year}} Georgia Department of Economic Development. All Rights Reserved.</p>
            <p>GDEcD is an equal opportunity employer.</p>
            <img src="/static/images/footer-logo.png"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </div>                
</template>

<script>
  export default {
    data() {
      return {
        competitiveAdvantages: [
          {
            name: 'Infrastructure',
            link: 'http://www.georgia.org/competitive-advantages/infrastructure/'
          }, {
            name: 'Workforce',
            link: 'http://www.georgia.org/competitive-advantages/training-hiring/'
          }, {
            name: 'Tax Credits',
            link: 'http://www.georgia.org/competitive-advantages/tax-credits/'
          }
        ],
        businessResources: [
          {
            name: 'Available Buildings Tool',
            link: 'http://www.georgia.org/siteselector/'
          }, {
            name: 'International Trade',
            link: 'http://www.georgia.org/business-resources/international-trade/'
          }, {
            name: 'Small Business & Entrepreneurs',
            link: 'http://www.georgia.org/business-resources/small-business-resource-directory/'
          }
        ],
        industries: [
          {
            name: 'AeroSpace',
            link: 'http://www.georgia.org/industries/aerospace/'
          }, {
            name: 'Agribusiness',
            link: 'http://www.georgia.org/industries/agribusiness/'
          }, {
            name: 'Arts',
            link: 'http://www.georgia.org/industries/arts/'
          }, {
            name: 'Automotive',
            link: 'http://www.georgia.org/industries/automotive/'
          }, {
            name: 'Contact Center',
            link: 'http://www.georgia.org/industries/contact-centers/'
          }, {
            name: 'Data Center',
            link: 'http://www.georgia.org/industries/data-centers/'
          }, {
            name: 'Defense',
            link: 'http://www.georgia.org/industries/defense/'
          }, {
            name: 'Energy and Environment',
            link: 'http://www.georgia.org/industries/energy-solutions/'
          }, {
            name: 'Entertainment',
            link: 'http://www.georgia.org/industries/entertainment/'
          }, {
            name: 'Headquarters',
            link: 'http://www.georgia.org/industries/headquarters/'
          }, {
            name: 'Fintech',
            link: 'http://www.georgia.org/industries/fintech/'
          }, {
            name: 'Food Processing',
            link: 'http://www.georgia.org/industries/food-processing/'
          }, {
            name: 'Information Technology',
            link: 'http://www.georgia.org/industries/information-technology/'
          }, {
            name: 'Life Sciences',
            link: 'http://www.georgia.org/industries/life-sciences/'
          }, {
            name: 'Logistics and Transportation',
            link: 'http://www.georgia.org/industries/logistics-services/'
          }, {
            name: 'Advanced Manufacturing',
            link: 'http://www.georgia.org/industries/advanced-manufacturing/'
          }, {
            name: 'Tourism',
            link: 'http://www.georgia.org/industries/georgia-tourism/'
          }
        ],
        year: ''
      }
    },
    created() {
      this.year = (new Date).getFullYear()
    },
    computed: {
      site_settings () {
          return this.$store.getters.getSettings
      },
      landing_page () {
          return this.$store.getters.getSettings.pages.landing_pages
      }
    }
  }
</script>

<style lang="scss" scoped>
  h3 {
    font-size: 18px;
    font-family: Roboto;
    color: #FFFFFF;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  p {
    color: whitesmoke;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  a {
    color:#d5e14d;
    text-decoration: none;
    display: block;
  }
  a:hover {
    color:rgb(40, 160, 40);
  }
  .footer-item {
    font-family: Roboto;
    background-image: linear-gradient(#5b5b5c, #131314);
    width: 100%;
  }
  .footer-bg {
    background: #f3f3f3;
    height: auto;
  }
  .before-footer-content {
    height: 150px;
  }
  ul{
    list-style: none;
    li {
      display: inline-block;
      width: 50%;
    }
  }
  .vertical-divider{
    clear: both;
    position: relative;
  }

  .vertical-divider:after {
    clear: both;
    content: " ";
    display: block;
    height: 0;
    visibility: hidden;
  }

  .vertical-divider .column:not(:first-child):after{
    background: #6d6d6d;
    bottom: 0;
    content: " ";
    margin-left: -10px;
    position: absolute;
    top: 0;
    width: 1px;
  }
  hr .divider{
    background-color: #6d6d6d;
  }

  .divider-flex-rows{
    width: 90%;
    padding: 15px 0;
    margin: auto;
  }

  .divider-layout-rows{
    width: 100%;
    padding: 15px 0;
    margin: auto;
  }
  .footer-copyright {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    img {
      height: 50px;
      vertical-align: middle;
      // float: right;
    }
  }
  .site-map {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    a {
      margin: 0 15px;
    }
    img {
      height: 50px;
      vertical-align: middle;
    }
  }
  .site-map-divider{
    clear: both;
    position: relative;
  }

  .site-map-divider:after {
    clear: both;
    content: " ";
    display: block;
    height: 0;
    visibility: hidden;
  }

  .site-map-divider .site-map-column:not(:first-child):after{
    background: #6d6d6d;
    bottom: 0;
    content: " ";
    margin-left: 5px;
    position: absolute;
    top: 0;
    width: 1px;
  }
</style>


