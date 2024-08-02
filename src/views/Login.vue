<template>
    <v-app>
        <v-container class="d-flex align-center h-screen">
            <v-card class="mx-auto px-6 py-8" width="500" elevation="24">
                <v-img
                    src="https://www.planmkt.com.br/public/images/logo-plan.png"
                    alt="Logo"
                    contain
                    height="100"
                    class="my-4"
                ></v-img>
                <v-form v-model="form" @submit.prevent="login">
                    <v-text-field
                        v-model="email"
                        label="Email"
                        :readonly="loading"
                        :rules="emailRules"
                        class="mb-3"
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        label="Password"
                        type="password"
                        :readonly="loading"
                        :rules="passwordRules"
                        class="mb-3"
                    ></v-text-field>
                    <v-btn 
                        block 
                        type="submit" 
                        color="orange"
                        :disabled="!form"
                        :loading="loading"
                    >
                        Entrar
                    </v-btn>
                </v-form>
            </v-card>
        </v-container>
        <notifications group="auth" />
    </v-app>
</template>

<script>
import http from '../services/auth';
import { notify } from '@kyvg/vue3-notification';

export default {
    data() {
        return {
            form: false,
            email: '',
            password: '',
            loading: false,
            emailRules: [
                (v) => !!v || 'E-mail é necessário',
                (v) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
            ],
            passwordRules: [
                (v) => !!v || 'Senha é necessária',
                (v) => (v && v.length >= 5) || 'Senha deve ter pelo menos 6 caracteres',
            ],
        };
    },
    methods: {
        async login() {
            if (!this.form) return;
            this.loading = true;
            const payload = {
                email: this.email,
                password: this.password
            }

            await http.post('/login', payload)
                .then(response => {
                    if (response.data.access_token) {
                        localStorage.setItem('user', JSON.stringify(response.data));
                        notify({
                            group: 'auth',
                            title: 'Login bem-sucedido',
                            text: 'Você foi autenticado com sucesso!',
                            type: 'success',
                        });
                        setTimeout(() => (this.loading = false), 2000);
                        this.$router.push('/dashboard');
                    }
                })
                .catch(err => {
                    setTimeout(() => (this.loading = false), 2000);
                    notify({
                        group: 'auth',
                        title: 'Erro de Login',
                        text: 'Por favor, verifique suas credenciais.',
                        type: 'error',
                    });
                });
        }
    }
};
</script>
