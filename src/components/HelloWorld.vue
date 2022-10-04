<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="4">
        <v-img :src="babylon_logo" class="my-3" contain height="110" />
      </v-col>
      <v-col cols="4">
        <v-img :src="vue_logo" class="mt-3" contain height="80" />
      </v-col>
      <v-col cols="4">
        <v-img :src="vuefify_logo" class="mt-3" contain height="70" />
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h2 class="display-2 font-weight-bold mb-3">
          BabylonJS + Vue + Vuetify
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Logo
import vuefify_logo from '../assets/logo.svg';
import vue_logo from '../assets/vue.svg';
import babylon_logo from '../assets/babylon.png';

export default defineComponent({
  name: 'HelloWorld',

  data() {
    return {
      vue_logo,
      babylon_logo,
      vuefify_logo,
    };
  },
});
</script>
