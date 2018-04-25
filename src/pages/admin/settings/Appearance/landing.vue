<template>
  <v-card flat>
    <v-card>
      <v-toolbar class="white elevation-0">
        <v-toolbar-title class="grey--text text-underline text--darken-4">
          Landing Page Settings
        </v-toolbar-title> 
      </v-toolbar>
      <v-container fluid>
        <v-layout row class="mt-3">
          <v-flex xs4>
            <v-subheader>Background Image</v-subheader>
          </v-flex>
          <v-flex x2>
            <v-layout row wrap>
                <v-flex x3>
                  <v-card>
                    <v-card-media
                      :src="styles.landing.background_image"
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
        <v-layout row class="mt-2">
          <v-flex xs4>
            <v-subheader>Background Color</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-layout row>
              <v-text-field
                label="Background Color"
                
                v-model="styles.landing.background_color"
              ></v-text-field>
              <input type="color"
              v-model="styles.landing.background_color"
            
                     ref="fileColor" />
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
              :style="{backgroundColor: styles.general.theme_color_light}"
              :loading="loading"
              @click.prevent="submitData"
              :disabled="loading"
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
<style scoped>
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
<script src="./js/landing.js"></script>
