<template>
  <div class="small">
    <line-chart v-if="loaded" :chart-data="datacollection" :options="dataOptions"></line-chart>
  </div>
</template>

<script>
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: null,
      timeStart: null,
      loaded: false,
      dataOptions: {
        animation: {
          duration: 0 // general animation time
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        elements: {
            point: {
                radius: 0
            },
            line: {
                borderColor: "#000",
                fill: false,
                borderWidth: 1,
                tension: 0
            }
        }
      }
    };
  },
  mounted() {
    this.timeStart = Date.now();
    this.initData(); //set label for dataset and color
    this.liveData();
  },
  methods: {
    fillData() {
      let labels = this.datacollection.labels;
      let datasets = this.datacollection.datasets;
      let newData = {
        labels: labels,
        datasets: datasets
      };
      let time = (Date.now() - this.timeStart) / 1000;
      newData.labels.push(time);
      newData.datasets[0].data.push(Math.sin(time));
      newData.datasets[0].label = "Sine wave";

      //limit array size to 50 elements for testing
      if (newData.labels.length >= 200) {
        newData.labels.splice(0, 1);
      }
      if (newData.datasets[0].data.length >= 200) {
        newData.datasets[0].data.splice(0, 1);
      }
      this.datacollection = newData;
      this.loaded = true;
    },
    initData() {
      this.datacollection = {
        labels: [0],
        datasets: [
          {
            label: "Sine wave",
            backgroundColor: "rgba(0,0,0,0)",//"#f87979",
            data: [0]
          }
        ]
      };
    },
    liveData() {
      setTimeout(() => {
        this.liveData();
      }, 100);
      this.fillData();
    },
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 0;
}
</style>