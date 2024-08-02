<template>
    <v-app>
        <SideBar v-model="isDrawerOpen" />
        <AppBar @custom-click="isDrawerOpen = !isDrawerOpen" />
        <v-main>
            <router-view />
        </v-main>
    </v-app>
  </template>
  
  <script>
    import AppBar from "@/components/AppBar.vue";
    import SideBar from '@/components/SideBar.vue';
    import { ref } from 'vue';
  
    export default {
        components: {
            SideBar,
            AppBar,
        },
        data() {
            return {
                isDrawerOpen: ref(true)
            };
        },
    }
  </script>