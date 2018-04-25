<template>
  <div>
    <!-- <v-layout>
      <table-filters :filters="filters" class="px-0"></table-filters>
    </v-layout> -->
    <div style="width: 100%;
           height: 100%;
           overflow: scroll;">
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
        v-bind:pagination.sync="pagination"
        :total-items="totalItems"
        :loading="loading"
        class="elevation-1"
      >
        <template slot="headerCell" scope="props" >
          <span v-tooltip:bottom="{ 'html': props.header.text }">
            {{ props.header.text }}
          </span>
        </template>


        <template slot="items" scope="props" style="height:50%;overflow: scroll;">
          <td class="text-xs-center px-2" v-for="(key, index) in headers" v-bind:key="index">
            <p v-if="key.type=='button'"><v-btn small class="px-0">View More</v-btn></p>
            <p v-else>{{props.item[key.value.toString()]}}</p>
          </td>

        </template>

      </v-data-table>
    </div>
  </div>
</template>
<script src="./table.js"></script>
