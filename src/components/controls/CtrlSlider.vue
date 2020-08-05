<template>
  <div class="card">
    <div>
      <button class="close-button" @click="$emit('delete-ctrl', path)">X</button>
      <span class="ctrlName">{{name}}:</span>
    </div>
    <div>
      <input type="number" v-model="min" />
      <vue-slider v-model="value" />
      <input type="number" v-model="max" />
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
const axios = require("axios");

export default {
  name: "CtrlSlider",
  components: {
    VueSlider,
  },
  //type checking here for properties
  props: {
    path: String,
    odrives: Object,
  },
  data: function () {
    return {
      value: 0,
      min: 0,
      max: 1,
    };
  },
  computed: {
    name: function () {
      let keys = this.path.split(".");
      keys.shift();
      return keys.join(".");
    },
    writeAccess: function () {
      let keys = this.path.split(".");
      keys.shift(); // don't need first key here
      let odriveObj = this.odrives;
      for (const key of keys) {
        odriveObj = odriveObj[key];
      }
      return odriveObj["readonly"] === false;
    },
  },
  methods: {
    putVal: function (e) {
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
        params: params,
      };
      console.log(request);
      axios.put(
        this.$store.state.odriveServerAddress + "/api/property",
        null,
        request
      );
    },
  },
};
</script>

<style scoped>
.ctrlVal {
  font-weight: bold;
}
</style>