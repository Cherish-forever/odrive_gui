<template>
  <div class="dashboard">
    <div class="dashboard_container">
      <div class="controls">
        <template v-for="(control, index) in dash.controls">
          <component
            :is="control.controlType"
            :key="index"
            :path="control.path"
            :name="control.name"
            :odrives="odrives"
            v-on:delete-ctrl="deleteCtrl"
          />
        </template>
        <div class="add-button card" @click="$emit('add-control')">Add Controls</div>
      </div>
      <div class="plots">
        <template v-for="(plot, index) in dash.plots">
          <test-chart :plot="plot" :key="index" :name="plot.name" v-on:delete-plot="deletePlot" v-on:add-var="addVar"/>
        </template>
        <div class="add-button card" @click="$emit('add-plot')">Add Plot</div>
      </div>
    </div>
  </div>
</template>

<script>
//this component will get passed a list of controls and plots
//display controls on the left and plots on the right?
//leave full names for plots
//collate controls into individual cards based on the deepest common level
import CtrlBoolean from "../components/controls/CtrlBoolean.vue";
import CtrlNumeric from "../components/controls/CtrlNumeric.vue";
import CtrlFunction from "../components/controls/CtrlFunction.vue";
import CtrlSlider from "../components/controls/CtrlSlider.vue";

//temp for testing plots
import TestChart from "../components/TestChart.vue";

export default {
  name: "Dashboard",
  components: {
    CtrlBoolean,
    CtrlNumeric,
    CtrlFunction,
    CtrlSlider,
    TestChart
  },
  props: ["dash", "odrives"],
  data() {
    return {};
  },
  methods: {
    deleteCtrl(e) {
      this.$emit("delete-ctrl", e);
    },
    deletePlot(e) {
      this.$emit("delete-plot", e);
    },
    addVar(e) {
      this.$emit("add-var", e);
    }
  }
};
</script>

<style scoped>
.dashboard {
  background-color: var(--bg-color);
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  padding-top: var(--top-height);
  padding-bottom: var(--bottom-height);
}

.dashboard_container {
  display: flex;
  flex-direction: row;
  height: 95vh;
}
.controls {
  flex-grow: 1;
  border-right: 1px solid lightgrey;
}

.add-button {
  background-color: lightcyan;
  width: 120px;
  margin: 10px auto;
  text-align: center;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
}

.add-button:active {
  background-color: lightblue;
}

.plots {
  flex-grow: 1;
  max-height: 94vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}
</style>