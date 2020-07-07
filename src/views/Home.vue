<template>
  <div class="home">
    <div class="logo">
      <img alt="Odrive Logo" src="../assets/odrive_logo.png">
    </div>
    <div class="home_text">
      Homepage Text
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
}

.logo {
  margin: auto;
  flex-grow: 1;
}

img {
  margin: auto;
  display: block;
  max-width: 50%;
  width: auto;
  height: auto;
}

.home_text {
  flex-grow: 1;
  font-size: 1.5rem;
  padding: 20px;
}
</style>
