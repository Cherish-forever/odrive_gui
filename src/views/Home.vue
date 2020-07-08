<template>
  <div class="home">
    <div class="logo">
      <img alt="Odrive Logo" src="../assets/odrive_logo.png">
    </div>
    <div class="home_text">
      To set up your ODrive, connect it and power it up.
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>

<style>
.home {
  padding: 10% 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  height: 100vh;
}

img {
  margin: auto;
  display: block;
  max-width: 50%;
  width: auto;
  height: auto;
}

.home_text {
  font-size: 1.5rem;
  padding: 20px;
}
</style>
