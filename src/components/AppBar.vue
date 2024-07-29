<template>
    <v-app-bar>
        <template #append>
            <v-btn @click="logout" color="red">Logout</v-btn>
        </template>
      </v-app-bar>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.removeItem('user');
            this.$router.push('/');
        }
    }
}
</script>