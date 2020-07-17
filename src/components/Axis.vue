<template>
  <div class="axis" v-bind:class="{ noError: noError, error: error}">
      {{ axis.name }}
  </div>
</template>

<script>
export default {
    name: "Axis",
    props: ["axis"],
    computed: {
        noError() {
            return this.axis.ref.error.val === "0";
        },
        error() {
            return this.axis.ref.error.val !== "0";
        }
    }
}
</script>

<style scoped>
.axis{
    padding: 5px 10px;
    border: 2px black;
}

.noError {
    color: green;
}

.error {
    color: red;
    font-weight: bold;
    background-color: #000;
}


</style>