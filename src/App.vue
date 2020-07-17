<template>
  <div id="app">
    <div class="header">
      <button
      v-for="dash in dashboards"
      v-bind:key="dash"
      v-bind:class="['dash-button', { active: currentDash === dash}]"
      v-on:click="currentDash = dash">
        {{ dash }}
      </button>
      <button class="dash-button">+</button>
    </div>
    <component v-bind:is="currentDashComponent" v-bind:odrives="odrives" v-bind:odriveConfigs="odriveConfigs"></component>
    <div class="footer">
      <Axis
      v-for="axis in axes"
      v-bind:key="axis.name"
      v-bind:axis="axis"
      >
      </Axis>
    </div>
  </div>
</template>

<script>
import Start from "./views/Start.vue";
import Config from "./views/Config.vue";
import Axis from "./components/Axis.vue";

export default {
  name: "App",
  components: {
    Start,
    Config,
    Axis
  },
  data: function() {
    return {
      currentDash: "Start",
      dashboards: ["Start", "Config"]
    }
  },
  computed: {
    currentDashComponent: function() {
      return this.currentDash;
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
      this.$store.dispatch('getOdrives');
      setTimeout(() => {this.updateOdrives()}, 1000);
      console.log("updating data...");
    }
  },
  created() {
    //grab full JSON
    //this.getOdrives();
    this.$store.commit('changeServerAddress', 'http://192.168.1.126:8080');
    this.updateOdrives();
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@400;700&display=swap');
@import './assets/styles/vars.css';
@import './assets/styles/style.css';

* {
  /* font-family: Arial, Helvetica, sans-serif; */
  font-family: 'Roboto', sans-serif;
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

.footer .left,.right{
  /* flex-grow: 1; */
  display: flex;
  background-color: var(--fg-color);
  font-family: 'Roboto Mono', monospace;
  margin: auto 5px;
}

.odrvSer, .errorState {
  font-weight: bold;
  font-family: 'Roboto Mono', monospace;
  margin: auto 5px;
  background-color: var(--fg-color);
}

.errorState{
  color: #13a100;
}
</style>
