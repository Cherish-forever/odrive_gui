<template>
  <div id="app">
    <!-- HEADER -->
    <div class="header">
      <button
        class="dash-button parameter-button"
        @click="showTree"
        v-bind:class="[{active: paramsVisible === true}]"
      >Parameters</button>
      <button
        v-for="dash in dashboards"
        v-bind:key="dash.name"
        v-bind:class="['dash-button', { active: currentDash === dash.name}]"
        v-on:click="currentDash = dash.name"
      >{{ dash.name }}</button>
      <button class="dash-button dash-add" @click="addDash">+</button>
      <button class="emergency-stop" @click="estop">STOP</button>
    </div>

    <!-- PARAMETER DROPDOWN MENU -->
    <div v-show="paramsVisible" class="dropdown">
      <div class="card dropdown-content">
        <div>Parameter Tree</div>
        <json-view
          v-bind:data="odriveConfigs"
          v-bind:rootKey="'odrives'"
          v-on:selected="addCtrlToDash"
        />
      </div>
    </div>

    <!-- PAGE CONTENT -->
    <component
      v-bind:is="currentDashComponent"
      v-bind:odrives="odrives"
      v-bind:odriveConfigs="odriveConfigs"
      v-bind:ctrlList="currentCtrlList"
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

export default {
  name: "App",
  components: {
    Start,
    Dashboard,
    Axis,
    "json-view": JSONView
  },
  data: function() {
    return {
      currentDash: "Start",
      dashboards: [
        {
          name: "Start",
          component: "Start"
        },
        { name: "Config", component: "Dashboard", controls: [], plots: [] }
      ],
      paramsVisible: false
    };
  },
  computed: {
    currentDashComponent: function() {
      //get the appropriate component name from the currentDash variable
      let comp = {};
      for (const dash of this.dashboards) {
        if (dash.name === this.currentDash) {
          comp = dash.component;
        }
      }
      return comp;
    },
    currentCtrlList: function() {
      let comp = {};
      for(const dash of this.dashboards) {
        if(dash.name === this.currentDash){
          comp = dash.controls;
        }
      }
      return comp;
    },
    axes: function() {
      return this.$store.state.axes;
    },
    odrives: function() {
      return this.$store.state.odrives;
    },
    odriveConfigs: function() {
      return this.$store.state.odriveConfigs;
    }
  },
  methods: {
    updateOdrives() {
      this.$store.dispatch("getOdrives");
      setTimeout(() => {
        this.updateOdrives();
      }, 1000);
      console.log("updating data...");
    },
    addDash() {
      let dashname = "Dashboard " + (this.dashboards.length - 2);
      this.dashboards.push({
        component: "Dashboard",
        name: dashname,
        controls: [],
        plots: []
      });
    },
    showTree() {
      //show the parameter tree
      //change the style to not be display none
      this.paramsVisible = this.paramsVisible == true ? false : true;
    },
    addCtrlToDash(e) {
      //when the parameter tree is open and a parameter is clicked,
      //add the clicked parameter to the list of controls for the
      //current dashboard
      console.log(e);
      for (const dash of this.dashboards) {
        if (this.currentDash === dash.name && this.currentDash !== "Start") {
          switch (typeof e.value) {
            case "boolean":
              dash.controls.push({
                controlType: "CtrlBoolean",
                path: e.path
              });
              break;
            case "number":
              dash.controls.push({
                controlType: "CtrlNumeric",
                path: e.path
              });
              break;
            case "string":
              dash.controls.push({
                controlType: "CtrlFunction",
                path: e.path
              });
              break;
            default:
              break;
          }
          break;
        }
      }
    },
    estop() {
      // send stop command to odrives
      // behavior on reset?
    }
  },
  created() {
    //grab full JSON
    //this.getOdrives();
    this.$store.commit("changeServerAddress", "http://192.168.1.126:8080");
    this.updateOdrives();
  }
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
}
</style>
