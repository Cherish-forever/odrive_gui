<template>
  <div class="dashboard">
    <div class="dashboard_container">
      <div class="controls">
        <template v-for="(control, index) in ctrlList">
          <component
            :is="control.controlType"
            :key="index"
            :path="control.path"
            :name="control.name"
            :odrives="odrives"
          />
        </template>
      </div>
      <div class="plots card">
        <!-- <random-chart /> -->
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

//temp for testing plots
import TestChart from "../components/TestChart.vue";

export default {
  name: "Dashboard",
  components: {
    CtrlBoolean,
    CtrlNumeric,
    CtrlFunction,
    TestChart
  },
  props: ["ctrlList", "plotList","odrives"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.dashboard {
  background-color: var(--bg-color);
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  padding: var(--top-height) 0;
}

.dashboard_container {
  display: flex;
  flex-direction: row;
}
</style>