<template>
    <v-navigation-drawer app>
      <v-img
        src="https://www.planmkt.com.br/public/images/logo-plan.png"
        alt="Logo"
        contain
        height="100"
        class="pa-4 mt-4"
      >
      </v-img>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard-outline" to="/dashboard">Dashboard</v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" to="/users">Usuários</v-list-item>
        <v-list-item prepend-icon="mdi-book-education-outline" to="/courses">Cursos</v-list-item>
      </v-list>
    </v-navigation-drawer>    
</template>

<script>
export default {}
</script>