<template>
    <v-app>
      <v-main>
        <v-container>
          <GeneralView />
          <DataTableDashboard />
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import DataTableDashboard from '@/components/DataTableDashboard.vue';
  import GeneralView from '@/components/GeneralView.vue';

  export default {};
  </script>
  
  <style>
  
  html, body, #app {
    height: 100%;
    margin: 0;
  }
  </style>
  