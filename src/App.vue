<template>
  <div id="app">
    <!-- HEADER -->
    <div class="header">
      <button
        class="dash-button"
        @click="startsample"
        v-bind:class="[{active: sampling === true}]"
      >start sampling</button>
      <button class="dash-button" @click="stopsample">stop sampling</button>
      <button class="dash-button" @click="exportDash">export dash</button>
      <button class="dash-button" @click="importDashWrapper">
        import dash
        <input
          type="file"
          id="inputDash"
          @change="importDashFile($event.target.files)"
          style="display:none"
        />
      </button>
      <button
        v-for="dash in dashboards"
        v-bind:key="dash.id"
        v-bind:class="['dash-button', { active: currentDash === dash.name}]"
        v-on:click="currentDash = dash.name"
        v-on:dblclick="changeDashName(dash.id)"
      >{{ dash.name }}</button>
      <button class="dash-button dash-add" @click="addDash">+</button>
      <button class="emergency-stop" @click="estop">STOP</button>
    </div>

    <!-- PARAMETER DROPDOWN MENU -->
    <div v-show="paramsVisible" class="dropdown">
      <div class="card dropdown-content">
        <div>
          <button class="close-button" @click="hideTree">X</button>
          Parameters
        </div>
        <json-view
          v-bind:data="odriveConfigs"
          v-bind:rootKey="'odrives'"
          v-on:selected="addVarToElement"
        />
      </div>
    </div>

    <!-- PAGE CONTENT -->
    <component
      v-bind:is="currentDashName"
      v-bind:odrives="odrives"
      v-bind:dash="dash"
      v-on:add-control="addControlToDash"
      v-on:add-slider="addSliderToDash"
      v-on:delete-ctrl="removeCtrlFromDash"
      v-on:add-plot="addPlotToDash"
      v-on:delete-plot="removePlotFromDash"
      v-on:add-action="addActionToDash"
      v-on:delete-action="removeActionFromDash"
      v-on:add-var="addVarToPlot"
      v-on:delete-var="removeVarFromPlot"
    ></component>

    <!-- FOOTER -->
    <div class="footer">
      <Axis v-for="axis in axes" v-bind:key="axis.name" v-bind:axis="axis"></Axis>
    </div>
  </div>
</template>

<script>
import Start from "./views/Start.vue";
import Dashboard from "./views/Dashboard.vue";
import Axis from "./components/Axis.vue";
import { JSONView } from "vue-json-component";
import { v4 as uuidv4 } from "uuid";
import * as socketio from "./comms/socketio";
import { saveAs } from "file-saver";

//let propSamplePeriod = 100; //sampling period for properties in ms

export default {
  name: "App",
  components: {
    Start,
    Dashboard,
    Axis,
    "json-view": JSONView,
  },
  data: function () {
    return {
      currentDash: "Start",
      paramsVisible: false,
      addCtrl: false,
      addAction: false,
      addSlider: false,
      addToPlot: false,
      currentPlot: undefined,
    };
  },
  computed: {
    currentDashName: function () {
      //get the appropriate component name from the currentDash variable
      let comp = {};
      for (const dash of this.dashboards) {
        if (dash.name === this.currentDash) {
          comp = dash.component;
        }
      }
      return comp;
    },
    dash: function () {
      let comp = {};
      for (const dash of this.dashboards) {
        if (dash.name === this.currentDash) {
          comp = dash;
        }
      }
      return comp;
    },
    currentCtrlList: function () {
      let comp = {};
      for (const dash of this.dashboards) {
        if (dash.name === this.currentDash) {
          comp = dash.controls;
        }
      }
      return comp;
    },
    axes: function () {
      return this.$store.state.axes;
    },
    odrives: function () {
      return this.$store.state.odrives;
    },
    odriveConfigs: function () {
      return this.$store.state.odriveConfigs;
    },
    dashboards: function () {
      return this.$store.state.dashboards;
    },
    sampling: function () {
      return this.$store.state.sampling;
    },
  },
  methods: {
    updateOdrives() {
      if (this.$store.state.serverConnected == true) {
        //} && this.sampling == false) {
        this.$store.dispatch("getOdrives");
      }
      setTimeout(() => {
        this.updateOdrives();
      }, 1000);

      //console.log("updating data...");
    },
    addDash() {
      let dashname = "Dashboard " + (this.dashboards.length - 2);
      this.dashboards.push({
        component: "Dashboard",
        name: dashname,
        id: uuidv4(),
        controls: [],
        actions: [],
        plots: [],
      });
    },
    exportDash() {
      console.log("exporting dashboard");
      const blob = new Blob([JSON.stringify(this.dash, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, this.dash.name);
    },
    importDashWrapper() {
      console.log("importing dashboard");
      const inputElem = document.getElementById("inputDash");
      if (inputElem) {
        inputElem.click();
      }
    },
    importDashFile(files) {
      console.log("file handler callback");
      let file = files[0];
      const reader = new FileReader();
      // this is ugly, but it gets around scoping problems the "load" callback
      let dashes = this.dashboards;
      let addImportedDash = (dash) => {
        console.log(dash);
        dashes.push(dash);
        // plots will have variables associated, add them to sampled variables list
        for (const plot of dash.plots) {
          console.log(plot);
          for (const path of plot.vars) {
            console.log(path);
            //addsampledprop(path);
            this.$store.commit("addSampledProperty", path);
          }
        }
      };
      reader.addEventListener("load", function (e) {
        addImportedDash(JSON.parse(e.target.result));
      });
      reader.readAsText(file);
    },
    changeDashName(e) {
      console.log(e);
      console.log("double clicked dashboard name");
    },
    showTree() {
      //show the parameter tree
      this.paramsVisible = true;
    },
    hideTree() {
      this.paramsVisible = false;
      this.addCtrl = false;
      this.addToPlot = false;
      this.addAction = false;
    },
    addControlToDash() {
      this.addCtrl = true;
      //show parameter menu
      this.showTree();
    },
    addActionToDash() {
      this.addAction = true;
      this.showTree();
    },
    addSliderToDash() {
      this.addSlider = true;
      this.showTree();
    },
    addVarToElement(e) {
      //when the parameter tree is open and a parameter is clicked,
      //add the clicked parameter to the list of controls for the
      //current dashboard
      if (
        this.addCtrl == true &&
        this.addToPlot == false &&
        this.addAction == false &&
        this.addSlider == false
      ) {
        for (const dash of this.dashboards) {
          if (this.currentDash === dash.name && this.currentDash !== "Start") {
            switch (typeof e.value) {
              case "boolean":
                dash.controls.push({
                  controlType: "CtrlBoolean",
                  path: e.path,
                });
                //this.$store.commit("addSampledProperty", e.path);
                break;
              case "number":
                dash.controls.push({
                  controlType: "CtrlNumeric",
                  path: e.path,
                });
                //this.$store.commit("addSampledProperty", e.path);
                break;
              case "string":
                dash.controls.push({
                  controlType: "CtrlFunction",
                  path: e.path,
                });
                break;
              default:
                break;
            }
            break;
          }
        }
      } else if (
        this.addCtrl == false &&
        this.addToPlot == true &&
        this.addAction == false &&
        this.addSlider == false
      ) {
        // add the selected element to the plot var list
        // add the selected element to the sampling var list
        // find the plot, append path to plot.vars
        console.log(e);
        for (const dash of this.dashboards) {
          if (this.currentDash === dash.name && this.currentDash !== "Start") {
            for (const plot of dash.plots) {
              if (plot.name == this.currentPlot) {
                plot.vars.push(e.path);
                this.$store.commit("addSampledProperty", e.path);
                console.log(plot);
                break;
              }
            }
            break;
          }
        }
      } else if (
        this.addCtrl == false &&
        this.addToPlot == false &&
        this.addAction == true &&
        this.addSlider == false
      ) {
        // add an action to the current dash
        for (const dash of this.dashboards) {
          if (this.currentDash === dash.name && this.currentDash !== "Start") {
            let id = uuidv4();
            dash.actions.push({
              id: id,
              path: e.path,
            });
            break;
          }
        }
      } else if (
        this.addCtrl == false &&
        this.addToPlot == false &&
        this.addAction == false &&
        this.addSlider == true
      ) {
        // add a slider to the list of controls if the selected item is valid (numeric)
        for (const dash of this.dashboards) {
          if (this.currentDash === dash.name && this.currentDash !== "Start") {
            switch (typeof e.value) {
              case "number":
                dash.controls.push({
                  controlType: "CtrlSlider",
                  path: e.path,
                });
                break;
              default:
                break;
            }
            break;
          }
        }
      }
    },
    removeCtrlFromDash(path) {
      // have full path from component
      for (const dash of this.dashboards) {
        if (this.currentDash === dash.name && this.currentDash !== "Start") {
          for (const control of dash.controls) {
            if (control.path == path) {
              dash.controls.splice(dash.controls.indexOf(control), 1);
              break;
            }
          }
          break;
        }
      }
    },
    removeActionFromDash(id) {
      for (const dash of this.dashboards) {
        if (this.currentDash === dash.name && this.currentDash !== "Start") {
          for (const action of dash.actions) {
            if (action.id == id) {
              dash.actions.splice(dash.actions.indexOf(action), 1);
              break;
            }
          }
          break;
        }
      }
    },
    addPlotToDash() {
      for (const dash of this.dashboards) {
        if (this.currentDash === dash.name && this.currentDash !== "Start") {
          let plotId = uuidv4();
          dash.plots.push({
            name: plotId,
            vars: [],
          });
          break;
        }
      }
    },
    removePlotFromDash(name) {
      for (const dash of this.dashboards) {
        if (this.currentDash === dash.name && this.currentDash !== "Start") {
          for (const plot of dash.plots) {
            if (plot.name == name) {
              dash.plots.splice(dash.plots.indexOf(plot), 1);
              break;
            }
          }
          break;
        }
      }
    },
    addVarToPlot(plotname) {
      console.log(plotname);
      this.addToPlot = true;
      this.showTree();
      this.currentPlot = plotname;
    },
    removeVarFromPlot(e) {
      //e should be plotname and var name (or path)
      console.log(e);
    },
    startsample() {
      socketio.sendEvent({
        type: "sampledVarNames",
        data: {
          paths: this.$store.state.sampledProperties,
        },
      });
      socketio.sendEvent({
        type: "enableSampling",
      });
      this.$store.state.timeSampleStart = Date.now();
      this.$store.state.sampling = true;
    },
    stopsample() {
      socketio.sendEvent({
        type: "stopSampling",
      });
      this.$store.state.sampling = false;
    },
    estop() {
      // send stop command to odrives
      // behavior on reset?
    },
  },
  created() {
    //grab full JSON
    //this.getOdrives();

    this.$store.dispatch("setServerAddress", "http://127.0.0.1:5000");
    // connect to socketio on server for sampled data
    this.updateOdrives();
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@400;700&display=swap");
@import "./assets/styles/vars.css";
@import "./assets/styles/style.css";

* {
  /* font-family: Arial, Helvetica, sans-serif; */
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  height: 100vh;
}

.header {
  /* want this fixed and full width */
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  display: flex;
  background-color: var(--fg-color);
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.4);
  z-index: 1;
}

button {
  font-size: 1rem;
  color: #2c3e50;
  text-decoration: none;
  padding: 10px;
  background-color: var(--fg-color);
  border-style: none;
  outline: none;
}

.dash-button:active {
  background-color: var(--bg-color);
}

.active {
  color: #000000;
  background-color: var(--bg-color);
}

.footer {
  position: fixed;
  width: 100vw;
  left: 0px;
  bottom: 0px;
  display: flex;
  background-color: var(--fg-color);
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.footer .left,
.right {
  /* flex-grow: 1; */
  display: flex;
  background-color: var(--fg-color);
  font-family: "Roboto Mono", monospace;
  margin: auto 5px;
}

.odrvSer,
.errorState {
  font-weight: bold;
  font-family: "Roboto Mono", monospace;
  margin: auto 5px;
  background-color: var(--fg-color);
}

.errorState {
  color: #13a100;
}

.dash-add {
  font-weight: bold;
}

.dropdown {
  position: absolute;
  padding: var(--top-height) 0;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  z-index: 1;
  padding: var(--top-height) 0;
  max-height: 90vh;
  overflow-y: scroll;
}

.parameter-button {
  border-right: 1px solid lightgrey;
}

.emergency-stop {
  margin-left: auto;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: red;
  font-weight: bold;
  color: white;
  display: none;
}

json-view {
  z-index: 2;
}
</style>
