<template>
  <div id="app">
    <div class="header">
      <router-link to="/">Home</router-link>
      <router-link to="/quickstart">Quickstart</router-link>
      <router-link to="/config">Config</router-link>
      <router-link to="/control">Control</router-link>
      <router-link to="/troubleshooting">Troubleshooting</router-link>
    </div>
    <router-view/>
    <div class="footer">
      <div class="left">Connected to:
        <div class="odrvSer">
          ODRIVE_SERIAL_NUM
        </div>
      </div>
      <div class="right">Error: 
        <div class="errorState">
          None
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@400;700&display=swap');
@import './assets/styles/vars.css';

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

.header a {
  font-size: 1rem;
  color: #2c3e50;
  text-decoration: none;
  padding: 10px;
  background-color: var(--fg-color);
}

.header a.router-link-exact-active {
  color: #000000;
  background-color: var(--bg-color);
}

.footer {
  position: fixed;
  width: 100vw;
  left: 0px;
  bottom: 0px;
  display: flex;
  padding: 5px;
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
