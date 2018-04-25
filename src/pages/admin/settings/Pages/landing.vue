<template>
  <v-card id="right_section">
      <v-toolbar class="white elevation-0">
        <v-toolbar-title class="">
          Layout/Block Settings
        </v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-layout row wrap>
            <!-- <v-card-text>
              Welcome, Feel free to edit blocks on the landing page from this section
            </v-card-text> -->
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">Jumbotron Section</div>
              <hr/>
                <v-flex xs12 md6>
                  <v-card flat>
                    <v-list three-line subheader>
                      <v-list-tile>
                        <v-list-tile-action>
                          <v-switch v-on:change="onChange(settings.jumbotron.enable, 'jumbotron/enable')" v-model="settings.jumbotron.enable"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Enable Section</v-list-tile-title>
                          <v-list-tile-sub-title>Make section visible on landing page</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              <block
                :items="jumbotron_items"
                :submitData="submitData"
                :loading="loading"
                type="jumbotron"
                :data="settings.jumbotron"
              ></block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">Information Section</div>
              <hr/>
                <v-flex xs12 md6>
                  <v-card flat>
                    <v-list three-line subheader>
                      <v-list-tile>
                        <v-list-tile-action>
                          <v-switch v-on:change="onChange(settings.info_section.enable, 'info_section/enable')" v-model="settings.info_section.enable"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Enable Section</v-list-tile-title>
                          <v-list-tile-sub-title>Make section visible on landing page</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              <block
                :items="info_items"
                :submitData="submitData"
                :loading="loading"
                type="info_section"
                :data="settings.info_section"
              ></block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">Introduction Section</div>
              <hr/>
                <v-flex xs12 md6>
                  <v-card flat>
                    <v-list three-line subheader>
                      <v-list-tile>
                        <v-list-tile-action>
                          <v-switch v-on:change="onChange(settings.intro_section.enable, 'intro_section/enable')" v-model="settings.intro_section.enable"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Enable Introduction Section</v-list-tile-title>
                          <v-list-tile-sub-title>Make section visible on landing page</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              <multiple-block
                :items="intro_items"
                :submitData="submitData"
                :loading="loading"
                type="intro_section"
                :data="settings.intro_section"
              ></multiple-block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">FAQ Section</div>
              <hr/>
                <v-flex xs12 md6>
                  <v-card flat>
                    <v-list three-line subheader>
                      <v-list-tile>
                        <v-list-tile-action>
                          <v-switch v-on:change="onChange(settings.faq.enable, 'faq/enable')" v-model="settings.faq.enable"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Enable FAQ Section</v-list-tile-title>
                          <v-list-tile-sub-title>Make section visible on landing page</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <multiple-block
                  :items="faq_items"
                  :submitData="submitData"
                  :loading="loading"
                  type="faq"
                  :data="settings.faq"
                ></multiple-block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">Case Studies</div>
              <hr/>
                <v-flex xs12 md6>
                  <v-card flat>
                    <v-list three-line subheader>
                      <v-list-tile>
                        <v-list-tile-action>
                          <v-switch v-on:change="onChange(settings.case_studies.enable, 'case_studies/enable')" v-model="settings.case_studies.enable"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Enable Case Studies Section</v-list-tile-title>
                          <v-list-tile-sub-title>Make section visible on landing page</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              <multiple-block
                :items="casestudies_items"
                :submitData="submitData"
                :loading="loading"
                type="case_studies"
                :data="settings.case_studies"
              ></multiple-block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
          <v-flex xs12>
            <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">Footer Section</div>
              <hr/>
                <v-flex xs12 md6>
                  <v-card flat>
                    <v-list three-line subheader>
                      <v-list-tile>
                        <v-list-tile-action>
                          <v-switch v-on:change="onChange(settings.footer.enable, 'footer/enable')" v-model="settings.footer.enable"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Enable Footer Section</v-list-tile-title>
                          <v-list-tile-sub-title>Make section visible on landing page</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
                <multiple-block
                  :items="footer_items"
                  :submitData="submitData"
                  :loading="loading"
                  type="footer"
                  :data="settings.footer"
                ></multiple-block>
            </v-expansion-panel-content>
          </v-expansion-panel>
          </v-flex>
        </v-layout>
      </v-container>
  </v-card>
</template>
<script src="./js/landing.js"></script>
<style lang="stylus" scoped>
.title-header {
  font-size: 18px;
  text-align: center;
  left 0;
  color: #205c43;
}
#tab-item {
  min-width: 20px;
}
.pa-3 {

}
</style>