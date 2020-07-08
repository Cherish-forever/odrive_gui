<template>
  <div>
    <div :class="{bold: isFolder}" @click="toggle" @dblclick="makeFolder">
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <Tree
        class="item"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      ></Tree>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Tree",
  props: {
    item: Object
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length;
    }
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    makeFolder: function() {
      if (!this.isFolder) {
        this.$emit("make-folder", this.item);
        this.isOpen = true;
      }
    }
  }
};
</script>

<style>
.item{
    padding: 5px;
    cursor: pointer;
}

.bold{
    font-weight: bold;
    cursor: pointer;
}

ul {
    padding-left: 1rem;
    list-style-type: none;
}
</style>