<template>
  <div class="card plot">
    <div class="plot-header">
      <button class="close-button" @click="$emit('delete-plot', name)">X</button>
      <button class="close-button" @click="$emit('add-var', name)">+</button>
    </div>
    <line-chart v-if="loaded" :chart-data="datacollection" :options="dataOptions"></line-chart>
  </div>
</template>

<script>
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart
  },
  props: ["name", "plot"],
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
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    };
  },
  mounted() {
    this.timeStart = Date.now();
    //this.initData(); //set label for dataset and color
    this.fillData();
    this.liveData();
  },
  methods: {
    fillData() {
      let newData = {
        labels: this.$store.state.propSamples["time"],
        datasets: []
      };
      for (const path of this.plot.vars) {
        let newPath = path.split('.');
        newPath.splice(0,1);
        newPath = newPath.join('.');
        newData.datasets.push({
          label: newPath,
          backgroundColor: "rgba(0,0,0,0)",
          data: this.$store.state.propSamples[newPath]
        });
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
            backgroundColor: "rgba(0,0,0,0)", //"#f87979",
            data: [0]
          }
        ]
      };
    },
    liveData() {
      setTimeout(() => {
        this.liveData();
      }, 50);
      //if (this.$store.state.sampling == true) {
      //  this.fillData();
      //}
      this.fillData();
    }
  }
};
</script>

<style scoped>
div {
  position: relative;
}

.plot {
  z-index: 0;
}

.plot-header {
  display: flex;
}

.plotname {
  flex-grow: 10;
  margin: auto 0;
}

.delete {
  font-weight: bold;
  cursor: pointer;
  padding: 0 5px;
  margin-right: 10px;
  border: 1px solid black;
}

.add-var {
  font-weight: bold;
  cursor: pointer;
  padding: 0 5px;
  margin-right: 10px;
  border: 1px solid black;
}
</style>