<template>
  <v-dialog v-model="openModal" lazy max-width="700px" persistent :fullscreen="screenWidth<600" transition="scale-transition">
    <v-card>
      <v-tabs class="pd-0" dark fixed centered>
        <v-tab href="#info-1" color="white">
          Contact Contractors
        </v-tab>
        <v-tab>
          <v-btn icon @click.native="cancel" style="position:fixed;margin-left:200px;margin-top:0px;">
            <v-icon dark>cancel</v-icon>
          </v-btn>
        </v-tab>

        <v-tab-item id="info-1">
          <v-card-text style="max-height:500px;overflow:auto;" class="pa-5">
            <kendo-grid :height="300" :data="items" @change="onChange" ref="kendoGrid" id="kendoGridq" :data-source="items" :columns="kendoSchema" :pagable='true' :selectable='true' :pageable='{
                  pageSizes: [2,4,8]
              }' :page-size="2" :scrollable='true'>
            </kendo-grid>
          </v-card-text>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
  import {
    KendoGrid,
    KendoGridInstaller
  } from '@progress/kendo-grid-vue-wrapper'
  export default {
  
    props: ['dialog', 'items', 'value'],
    components: {
      KendoGrid
    },
    data: () => {
      return {
        openModal: false,
        mode: '',
        kendoSchema: [{
            title: 'First Name',
            field: 'firstname',
            editable: false
          },
          {
            title: 'Last Name',
            field: 'lastname',
            editable: false
          },
          {
            title: 'Job Title',
            field: 'jobtitle'
          }
        ],
        selected: '',
      }
    },
    watch: {
      dialog() {
        this.openModal = this.dialog
      }
    },
    methods: {
      cancel() {
        this.openModal = false
        this.$parent.$emit('cancel')
      },
      onChange(e) {
        var row = e.sender.select().data()
        var data = e.sender.dataSource.options.data
        var self = this
        console.log(e)
  
        var sel = document.getElementsByClassName('k-state-selected ')[0].getAttribute('data-uid')
        var arr = [];
  
        $("#kendoGridq .k-grid-content table tr").each(function() {
          arr.push($(this).attr('data-uid'));
        });
        var i = arr.indexOf(row.uid)
        self.cancel()
        self.$parent.cancel()
        self.selected = data[i]
        window.$applozic.fn.applozic('loadTab', data[i].uid);
        document.getElementsByClassName('chatbutton ')[0].click()
      },
    },
    computed: {
      screenWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      }
    }
  }
</script>

<style>
  .k-grid .k-widget .k-display-block {
    width: 100%;
  }
  
  #kendoGrid {
    width: 100%;
  }
</style>


