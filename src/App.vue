<template>
  <v-app>
    <SideBar />
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import SideBar from '@/components/SideBar.vue';
</script>
