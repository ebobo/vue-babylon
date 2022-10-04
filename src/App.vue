<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/babylon.png" class="babylon_logo" alt="Babylon logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.babylon_logo {
  height: 7em;
  padding: 0.2em;
}

.logo {
  height: 5em;
  padding: 1.5em;
  will-change: filter;
}
.babylon_logo:hover {
  filter: drop-shadow(0 0 2em #ff6565aa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
