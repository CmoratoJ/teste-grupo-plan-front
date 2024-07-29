<template>
    <v-navigation-drawer app>
        <v-list>
          <v-list-item prepend-icon="mdi-view-dashboard-outline" to="/dashboard">Dashboard</v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" to="/users">Usuários</v-list-item>
          <v-list-item prepend-icon="mdi-book-education-outline" to="/courses">Cursos</v-list-item>
          <v-list-item prepend-icon="mdi-bell" to="/permissions">Permissões</v-list-item>
        </v-list>
      </v-navigation-drawer>    
</template>

<script>
export default {}
</script>