<template>
    <v-card v-resize="onResize" :style="{ 'width': `${width}px`  }">
      <v-layout class="info-bg light-blue darken-2" justify-center>
      </v-layout>
      <v-layout class="info-profile-img" justify-center>
        <img :src="user.avatar" style="max-width:100%;max-height:150px;">
      </v-layout>
      <v-layout class="mt-5" justify-center>
        {{ user.firstname }} {{ user.lastname }}
      </v-layout>
      <v-layout class="px-3">
        <v-divider></v-divider>
      </v-layout>
      <v-card-text>
        <ul class="pl-0 pt-0 info-list">
          <li class="px-0" v-for="item in items" v-bind:key="item.title" >
            <v-icon v-if="item.icon" class="mr-1">{{item.icon}}</v-icon>
            <div class="pt-1">{{ item.title }}</div>
          </li>
        </ul>
      </v-card-text>
    </v-card>
</template>

<style>
  .info-bg {
    background: #3f9cf9;
    height: 80px;
  }
  .info-profile-img img {
    width: 100px;
    height: 100px;
    top: 20px;
    border-radius: 100%;
    border: 2px solid #0288d1;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    
  }
  .info-list {
    list-style: none;
  }
  .info-list li {
    margin-bottom: 10px;
    display: flex;
  }
  .info-list li div {
    color: #929292;
    font-size: 13px;
  }
</style>


<script>
  export default {
    data () {
      return {
        width: 360
      }
    },
    methods: {
      onResize () {
        if (window.innerWidth > 1300) {
          this.width = 260
        }
        if (window.innerWidth > 1900) {
          this.width = 420
        }
      }
    },
    computed: {
      company () {
        return this.$store.getters.getCompanyDetails
      },
      user () {
        return this.$store.getters.getUserDetails
      },
      items () {
        // if (this.company.companylegalname === '') {
        //   return [
        //     {
        //       title: `${this.user.firstname} ${this.user.lastname}`,
        //       icon: 'person'
        //     }
        //   ]
        // }
        return [
          {
            title: this.user.companylegalname,
            icon: 'store'
          },
          {
            title: this.user.jobtitle,
            icon: 'assignment_ind'
          },
          {
            title: this.user.department,
            icon: 'work'
          }
        ]
      }
    }
  }
</script>

