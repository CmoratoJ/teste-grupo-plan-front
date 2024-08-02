<template>
    <v-btn prepend-icon="mdi-plus-thick" color="primary" class="mb-6" @click="dialog = true">Adicionar Permissão</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Cadastro de Permissões</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-model="permission.name"
                        label="Nome"
                        :rules="[v => !!v || 'Nome é obrigatório']"
                        required
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="savePermission">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-data-table :headers="headers" :items="permissions" class="elevation-1"></v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import http from '@/services/auth';

export default {
    data: () => ({
        headers: [
            { title: 'Id', key: 'id' },
            { title: 'Nome', key: 'name' },
            { title: 'Ações', key: 'actions'}
        ],
        permissions: [],
        dialog: false,
        valid: false,
        permission: {
            name: ''
        }
    }),
    methods: {
        async getPermissions() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/permissions', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                this.permissions = response.data.permissions;
            })
            .catch(err => {
                alert('Failed');
            });
        },
        async savePermission() {
            this.$refs.form.validate();
            if (this.valid) {
                const payload = {
                    name: this.permission.name
                };
                const user = JSON.parse(localStorage.getItem('user'));

                await http.post('/permissions', payload, {
                    headers: {
                        'Authorization': 'Bearer'+user.access_token
                    }
                })
                .then(response => {
                    this.getPermissions();
                    this.dialog = false;
                })
                .catch(err => {
                    alert('Failed');
                });
            }
        }
    },
    mounted(){
        this.getPermissions()
    }
}
</script>