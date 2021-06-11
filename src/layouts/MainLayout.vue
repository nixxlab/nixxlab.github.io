<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-black" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <img src="/logo.png">
          NIXXLAB
        </q-toolbar-title>

        <q-tabs align="left">
          <q-route-tab to="/" label="Home" />
          <q-route-tab to="/about" label="About us" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'MainLayout',
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap');
</style>