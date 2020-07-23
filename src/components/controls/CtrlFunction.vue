<template>
  <div class="card">
    <button class="delete" @click="$emit('delete-ctrl', path)">X</button>
    <button @click="executeFunction" class="execute">{{name}}()</button>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "CtrlFunction",
  //type checking here for properties
  props: {
    path: String,
    odrives: Object
  },
  computed: {
    name: function() {
      let keys = this.path.split(".");
      keys.shift();
      return keys.join(".");
    }
  },
  methods: {
    putVal: function(e) {
      var params = new URLSearchParams();
      let keys = this.path.split(".");
      keys.shift();
      for (const key of keys) {
        params.append("key", key);
      }
      params.append("val", e.target.value);
      console.log(params.toString());
      let request = {
        params: params
      };
      console.log(request);
      axios.put(
        this.$store.state.odriveServerAddress + "/api/property",
        null,
        request
      );
    },
    executeFunction: function(e) {
      //execute this function on the odrive
      console.log(e);
      var params = new URLSearchParams();
      let keys = this.path.split(".");
      keys.shift();
      for (const key of keys) {
        params.append("key", key);
      }
      console.log(params.toString());
      let request = {
        params: params
      };
      axios.put(
        this.$store.state.odriveServerAddress + "/api/function",
        null,
        request
      );
    }
  }
};
</script>

<style scoped>
.card {
  background-color: lightcyan;
}

.execute {
  color: black;
  font-family: "Roboto Mono", monospace;
  margin: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0);
}

.card:active {
  background-color: lightblue;
}

.delete {
  font-weight: bold;
  cursor: pointer;
  padding: 0 5px;
  margin-right: 10px;
  border: 1px solid black;
}
</style>