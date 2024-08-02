<template>
    <v-app-bar flat class="border-b">
        <v-app-bar-nav-icon @click="handleClick"></v-app-bar-nav-icon>
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
        },
        handleClick() {
            this.$emit('custom-click')
        }
    },
}
</script>