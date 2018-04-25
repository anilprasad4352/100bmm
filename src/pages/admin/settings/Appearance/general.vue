<template>
  <v-card flat>
    <v-card>
      <v-toolbar class="white elevation-0">
        <v-toolbar-title class="grey--text text-underline text--darken-4">
          General Settings 
        </v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-layout row class="mt-3">
          <v-flex xs4>
            <v-subheader>Logo</v-subheader>
          </v-flex>
          <v-flex x2>
            <v-layout row wrap>
              <v-flex x3>
                <v-card>
                  <v-card-media
                    :src="styles.general.logo"
                    height="200px"
                  >
                  </v-card-media>
                  <v-card-actions class="white">
                    <v-btn dark :style="{backgroundColor: styles.general.theme_color_light}" raised @click="selectFile('fileInput-logo')">Change Image</v-btn>
                    <input type="file" id="logo" accept="image/*"
                           ref="fileInput-logo" @change="onFileChange">
                  </v-card-actions>
                </v-card>
              </v-flex>
              <v-flex x9>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-4">
          <v-flex xs4>
            <v-subheader>Background Image</v-subheader>
          </v-flex>
          <v-flex x2>
              <v-layout row wrap>
                <v-flex x3>
                  <v-card>
                    <v-card-media
                      :src="styles.general.background_image"
                      height="200px"
                      >
                    </v-card-media>
                    <v-card-actions class="white">
                      <v-btn dark :style="{backgroundColor: styles.general.theme_color_light}" raised @click="selectFile('fileInput-bg')">Change Image</v-btn>
                      <input type="file" accept="image/*"
                             id="background_image"
                             style="display: none"
                             ref="fileInput-bg"
                             @change="onFileChange"
                      >
                    </v-card-actions>
                  </v-card>
                </v-flex>
                <v-flex x9>
                </v-flex>
              </v-layout>
          </v-flex>
        </v-layout>
		
		
		<v-layout row class="mt-4">
          <v-flex xs4>
            <v-subheader>Favicon</v-subheader>
          </v-flex>
          <v-flex x2>
              <v-layout row wrap>
                <v-flex x3>
                  <v-card>
                    <v-card-media
                      :src="styles.general.favicon"
                      height="200px"
                      >
                    </v-card-media>
                    <v-card-actions class="white">
                      <v-btn dark :style="{backgroundColor: styles.general.theme_color_light}" raised @click="selectFile('fileInput-favicon')">Change Favicon</v-btn>
                      <input type="file" accept="image/*"
                             id="favicon"
                             style="display: none"
                             ref="fileInput-favicon"
                             @change="onFileChange"
                      >
                    </v-card-actions>
                  </v-card>
                </v-flex>
                <v-flex x9>
                </v-flex>
              </v-layout>
          </v-flex>
        </v-layout>
		
		
        <v-layout row class="mt-4">
          <v-flex xs4>
            <v-subheader>Background Color</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-layout row>
              <v-text-field
                label="Background Color"
                :value="styles.general.background_color"
              ></v-text-field>
              <input
                type="color"
               
                v-model="styles.general.background_color"
                ref="fileColor" />
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout row class="mt-4">
          <v-flex xs4>
            <v-subheader>Main Theme Color</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-layout row>
              <v-text-field
                label="Main Theme Color"
                :value="styles.general.theme_color_light"
              ></v-text-field>
              <input
                type="color"
                
                v-model="styles.general.theme_color_light"
                />
            </v-layout>
          </v-flex>
        </v-layout>


        <v-layout row class="mt-4">
          <v-flex xs4>
            <v-subheader>Sub Theme Color</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-layout row>
              <v-text-field
                label="Sub Theme Color"
                :value="styles.general.theme_color_dark"
              ></v-text-field>
              <input
                type="color"
                
                v-model="styles.general.theme_color_dark"
                />
            </v-layout>
          </v-flex>
        </v-layout>


        <v-layout row class="mt-4">
          <v-flex xs4>
            <v-subheader>Font Types</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-select
              :items="font_types"
              label="Select"
              v-model="font_type"
              item-value="text"></v-select>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-btn
              dark 
              :loading="loading"
              @click.prevent="submitData"
              :disabled="loading"
			  :style="{backgroundColor: styles.general.theme_color_light}"
            >
              Save
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
        </v-layout>

        

      </v-container>
    </v-card>
  </v-card>
</template>
<script src="./js/general.js"></script>
<style lang="stylus" scoped>
  div
    text-align: center

  .progress-circular
    margin: 1rem

  input[type=file] {
    position: absolute;
    left: -99999px;
  }
  input[type=color] {
    width: 80px;
    height: 40px;
    margin-right: 20px;
    margin-top: 10px;
  }
  .uploadFile {
    cursor: pointer;
    width: 250px;
  }
</style>
