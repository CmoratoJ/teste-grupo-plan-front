<template>
    <v-container class="d-flex align-center h-screen">
        <v-card class="mx-auto px-6 py-8" width="500" elevation="24">
            <v-form @submit.prevent="login">
                <v-text-field
                    v-model="email"
                    label="Email"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                ></v-text-field>
                <v-btn type="submit" color="primary">Login</v-btn>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>
import http from '../services/auth';

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async login() {
            const payload = {
                email: this.email,
                password: this.password
            }

            await http.post('/login', payload)
                .then(response => {
                    if (response.data.access_token) {
                        localStorage.setItem('user', JSON.stringify(response.data));
                        this.$router.push('/dashboard');
                    }
                })
                .catch(err => {
                    alert('Failed to login');
                });
        }
    }
};
</script>
