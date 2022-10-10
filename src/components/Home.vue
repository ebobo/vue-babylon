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
    <v-row align="center" justify="center">
      <v-btn text class="mr-4 mt-6" :disabled="switch_on" @click="rotateMesh"
        >Open</v-btn
      >
      <v-btn text class="mt-6" :disabled="!switch_on" @click="rotateMesh"
        >Close</v-btn
      >
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CustomModels } from '../babylon_files/CustomModels';
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
      switch_on: false,
      model: null,
    };
  },

  mounted() {
    const canvas = document.querySelector('canvas')!;
    this.model = new CustomModels(canvas);
  },

  methods: {
    rotateMesh() {
      if (this.model) {
        this.switch_on = !this.switch_on;
        this.model.rotateMeshX(this.switch_on);
      }
    },
  },
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 80%;
}
</style>
