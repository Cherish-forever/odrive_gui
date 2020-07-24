<template>
  <div class="card">
    <button class="close-button" @click="$emit('delete-ctrl', path)">X</button>
    <span class="ctrlName">{{name}}: </span>
    <span class="ctrlVal">{{value}}</span>
    <input v-if="writeAccess" type="number" v-on:change="putVal" />
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "CtrlNumeric",
  //type checking here for properties
  props: {
    path: String,
    odrives: Object,
  },
  computed: {
    value: function() {
      let keys = this.path.split(".");
      keys.shift(); // don't need first key here
      let odriveObj = this.$store.state.odrives;
      for (const key of keys) {
        odriveObj = odriveObj[key];
      }
      return parseFloat(odriveObj["val"]).toFixed(3);
    },
    name: function() {
      let keys = this.path.split(".");
      keys.shift();
      return keys.join(".");
    },
    writeAccess: function() {
      let keys = this.path.split(".");
      keys.shift(); // don't need first key here
      let odriveObj = this.odrives;
      for (const key of keys) {
        odriveObj = odriveObj[key];
      }
      return odriveObj["readonly"] === false;
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
      params.append("type", "numeric");
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
    }
  }
};
</script>

<style scoped>
.ctrlVal {
  font-weight: bold;
}
</style>