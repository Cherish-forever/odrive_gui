<template>
  <div id="app">
    <div class="header">
      <router-link to="/">Home</router-link>
      <router-link to="/quickstart">Quickstart</router-link>
      <router-link to="/config">Config</router-link>
      <router-link to="/control">Control</router-link>
      <router-link to="/troubleshooting">Troubleshooting</router-link>
    </div>
    <div class="spacer"></div>
    <router-view/>
    <div class="footer">
      <div>Connected to:
        <div class="odrvSer">
          ODRIVE_SERIAL
        </div>
      </div>
      <div>Error: 
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
    // on mount, change the height of the spacer to force to RouterView content below the header
    let height = document.querySelector(".header").clientHeight;
    console.log(height);
    document.querySelector(".spacer").style.height = `${height}px`;
  }
}
</script>

<style>
:root {
  --bg-color: rgb(235, 235, 235);
  --fg-color: #fff;
}

* {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
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
}

.header a {
  font-size: 1.3rem;
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
}

.footer div{
  flex-grow: 1;
  display: flex;
  background-color: var(--fg-color);
}

.odrvSer {
  font-weight: bold;
  font-family: "Lucida Console", Monaco, monospace;
  padding: 0px 10px;
}

.errorState{
  font-weight: bold;
  color: #13a100;
  font-family: "Lucida Console", Monaco, monospace;
  padding: 0px 10px;
}
</style>
