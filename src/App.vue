<template>
  <v-app>
    <v-main>
      <FDCP />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './components/Home.vue';
import FDCP from './components/FDCP.vue';

export default defineComponent({
  name: 'App',

  components: {
    Home,
    FDCP,
  },

  data() {
    return {
      //
    };
  },
});
</script>
