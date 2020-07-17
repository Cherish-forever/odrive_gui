<template>
  <div class="config">
    <div class="config_container">
      <div class="config_tree card">
        <div>Parameter Tree</div>
        <json-view v-bind:data="odriveConfigs" v-bind:rootKey="'odrives'" v-on:selected="itemSelected"/>
      </div>
      <div class="controls">
        <template v-for="(control, index) in controls">
          <component :is="control.controlType" :key="index" :path="control.path" :name="control.name" :odrives="odrives"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { JSONView } from "vue-json-component";
import CtrlBoolean from "../components/controls/CtrlBoolean.vue";
import CtrlNumeric from "../components/controls/CtrlNumeric.vue";

export default {
  name: "Config",
  components: {
    "json-view": JSONView,
    CtrlBoolean,
    CtrlNumeric
  },
  props: ["odrives","odriveConfigs"],
  data() {
    return {
      controls: [], //array of controls
    };
  },
  methods: {
    createCtrl: function(control) {
      // make a new control element and add it to the control panel
      console.log(control);
      console.log("adding control");
    },
    itemSelected: function(e) {
      console.log(e);
      switch(typeof e.value){
        case 'boolean':
          this.controls.push({
            name: e.path,
            controlType: "CtrlBoolean",
            path: e.path,
          });
          break;
        case 'number':
          this.controls.push({
            name: e.key,
            controlType: "CtrlNumeric",
            path: e.path,
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.config {
  background-color: var(--bg-color);
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  padding: var(--top-height) 0;
}

.config_container {
  display: flex;
  flex-direction: row;
}

.config_tree {
  background-color: var(--fg-color);

  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 90vh;
  
}

.properties {
  visibility: hidden;
}
</style>