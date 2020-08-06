<template>
  <div class="card action-card">
    <button class="close-button" @click="$emit('delete-action', id)">X</button>
    <span class="ctrlName">{{path}}:</span>
    <div class="right">
      <input type="number" v-on:change="newVal" />
      <button class="action-button close-button" @click="putVal">Go</button>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Action",
  props: {
    id: String,
    path: String,
  },
  data: function () {
    return {
      value: 0,
    };
  },
  methods: {
    newVal: function (e) {
      this.value = parseFloat(e.target.value);
    },
    putVal: function () {
      var params = new URLSearchParams();
      let keys = this.path.split(".");
      keys.shift();
      for (const key of keys) {
        params.append("key", key);
      }
      params.append("val", this.value);
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
input {
  border-style: none;
  border-bottom: 1px solid grey;
  width: 5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-align: center;
}

.action-card {
    display: flex;
    /* border: 1px solid lightcoral; */
    box-sizing: border-box;
}

.action-button {
    margin-right: 0;
}

.right {
    margin-left: auto;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}
</style>