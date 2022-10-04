<template>
  <v-container>
    <v-row align="center">
      <v-col cols="4">
        <v-img :src="babylon_logo" contain height="90" />
      </v-col>
      <v-col cols="4">
        <v-img :src="vue_logo" contain height="62" />
      </v-col>
      <v-col cols="4">
        <v-img :src="vuefify_logo" contain height="52" />
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h2 class="display-2 font-weight-bold mb-3">
          BabylonJS + Vue + Vuetify
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <canvas></canvas>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BasicScene } from '../babylon_files/BasicScene';
// Logo
import vuefify_logo from '../assets/logo.svg';
import vue_logo from '../assets/vue.svg';
import babylon_logo from '../assets/babylon.png';

export default defineComponent({
  name: 'Home',

  data() {
    return {
      vue_logo,
      babylon_logo,
      vuefify_logo,
    };
  },

  mounted() {
    const canvas = document.querySelector('canvas')!;
    new BasicScene(canvas);
  },
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 80%;
}
</style>
