<template>
  
</template>
<script>
export default {
    template: '<div id="container" style="height: 300px"></div>',
    props: ['opts'],
    data: function() {
        return {
            opts: {
                chart: {
                    renderTo: 'container',
                    type: 'bar'
                },
                title: {
                    text: 'Fruit Consumption'
                },
                xAxis: {
                    categories: ['Apples', 'Bananas', 'Oranges']
                },
                yAxis: {
                    title: {
                        text: 'Fruit eaten'
                    }
                },
                series: [{
                    name: 'Jane',
                    data: [1, 0, 4]},
                    {
                    name: 'John',
                    data: [5, 7, 3]}]
                }
            }
    },
    created: function() {
        
    },
    ready: function() {
        this.chart = new Highcharts.Chart(this.opts);    
    }
}
</script>
