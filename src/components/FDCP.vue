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
          Blender + BabylonJS + Vue + Vuetify
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <canvas></canvas>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn
        text
        class="mr-4 mt-6"
        :disabled="switch_status"
        @click="rotateMesh"
        >Open</v-btn
      >
      <v-btn text class="mt-6" :disabled="!switch_status" @click="rotateMesh"
        >Close</v-btn
      >
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FireDoorControlPanel } from '../babylon_files/FireDoorControlPanel';
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
      model: null,
      switch_status: false,
    };
  },

  mounted() {
    const canvas = document.querySelector('canvas')!;
    this.model = new FireDoorControlPanel(canvas);
    this.model.on('switchStatus', (data: boolean) => {
      this.switch_status = data;
    });
  },

  methods: {
    rotateMesh() {
      if (this.model) {
        this.model.rotateSwitch();
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
