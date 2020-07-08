<template>
  <div class="config">
    <div class="config_container">
      <div class="config_tree">
        <div>Parameter Tree</div>
        <Tree class="item" v-bind:item="treeData"></Tree>
      </div>
      <div class="config_controls">Config controls go here</div>
    </div>
  </div>
</template>

<script>
import Tree from "../components/Tree.vue";

export default {
  name: "Config",
  components: {
    Tree
  },
  data() {
    return {
      treeData: {
        name: "odrv0",
        children: [
          { name: "SER_NUM" },
          { name: "V3.6-48V" },
          {
            name: "config",
            children: [
              {
                name: "axis0",
                children: [
                    { name: "controller" }
                ]
              },
              { name: "brake_resistance" },
              { name: "vbus_voltage" }
            ]
          }
        ]
      }
    };
  }
};
</script>

<style>
.config {
  background-color: var(--bg-color);
  height: 100vh;
  width: 100vw;
  padding: 48px 0;
}

.config_container {
  display: flex;
  flex-direction: row;
  padding: 10px;
}

.config_tree {
  background-color: var(--fg-color);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
}

.config_controls {
  flex-grow: 8;
  padding: 10px;
}
</style>