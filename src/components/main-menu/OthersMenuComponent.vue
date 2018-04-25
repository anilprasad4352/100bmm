<template>
<v-card height="100%" class="mt-2" dark>
    <v-list dense dark class="mt-4">
        <p class="otherlink"><b>Other Links</b></p>
        <v-list-tile
            :key="i"
            v-for="(item, i) in items"
            router
            :to="item.link"
        >
        <v-list-tile-action>
            <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
            <v-list-tile-title>
                {{ item.title }}
            </v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
    </v-card>
</template>
<script>
export default {
  data: () => ({
    items: [
        {title: 'Recovery Opportunities', icon: '', link: '/recoveryfilter'},
        {title: 'Federal Opportunities Forecast', icon: '', link: '/forecastfilter'},
        {title: 'Awarded Opportunities', icon: '', link: '/opportunities/awarded'}
    ]
  })
}
</script>
<style>
.otherlink{
    padding-left:80px;
}
</style>


