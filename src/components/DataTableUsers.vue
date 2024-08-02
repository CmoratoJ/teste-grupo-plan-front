<template>    
    <v-btn prepend-icon="mdi-plus-thick" color="orange" class="mb-6" @click="dialog = true">Adicionar Usuário</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ editing ? 'Editar Usuário' : 'Cadastro de Usuário' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-model="user.name"
                        label="Nome"
                        :rules="[v => !!v || 'Nome é obrigatório']"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="user.email"
                        label="Email"
                        :rules="[v => !!v || 'Email é obrigatório', v => /.+@.+\..+/.test(v) || 'Email deve ser válido']"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="user.password"
                        label="Senha"
                        :rules="[v => !!v || 'Senha é obrigatória']"
                        type="password"
                        required
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="cancelModal">Cancelar</v-btn>
                <v-btn color="orange" text @click="persist">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPermission" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Adicionar Permissão</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-select
                        v-model="selectedPermission"
                        :items="permissions"
                        label="Escolha uma opção"
                        outlined
                    ></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="dialogPermission = false">Cancelar</v-btn>
                <v-btn color="orange" text @click="addPermissionUser()">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-data-table :headers="headers" :items="users" class="elevation-1">
                        <template v-slot:item.actions="{ item }">
                            <v-btn v-if="!item.permission" small class="mr-2" color="yellow" @click="dialogPermissionFunction(item.id)">
                                Adicionar Permissão
                            </v-btn>
                            <v-btn small class="mr-2" color="orange" @click="editUser(item)">
                                Editar
                            </v-btn>
                            <v-btn small color="red" @click="deleteUser(item.id)">
                                Deletar
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <notifications group="get" />    
</template>

<script>
import http from '@/services/auth';
import { notify } from '@kyvg/vue3-notification';

export default {
    data: () => ({
        headers: [
            { title: 'Id', key: 'id' },
            { title: 'Nome', key: 'name' },
            { title: 'Email', key: 'email' },
            { title: 'Permissão', key: 'permission' },
            { title: 'Ações', key: 'actions' }
        ],
        users: [],
        selectedPermission: null,
        permissions: [],
        selectedUser: null,
        dialog: false,
        dialogPermission: false,
        editing: false,
        valid: false,
        user: {
            name: '',
            email: '',
            password: ''
        },
        editedUser: null,
    }),
    methods: {
        persist () {
            if (this.editing) {
                this.saveEditedUser();
            } else {
                this.saveUser();
            }
        },
        cancelModal () {
            this.dialog = false
            this.editing = false
            this.user.name = ''
            this.user.email = ''
            this.user.password = ''
        },
        async getUsers() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/usersPermission', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                response.data.users.forEach((user, key) => {
                    if (user.permissions[0]) {
                        response.data.users[key].permission = user.permissions[0].name;
                    } else {
                        response.data.users[key].permission = '';
                    }
                });
                this.users = response.data.users;
            })
            .catch(err => {
                notify({
                    group: 'get',
                    title: 'Erro',
                    text: 'Favor contatar o suporte.',
                    type: 'error',
                });
            });
        },
        async editUser(user) {
            this.editedUser = { ...user };
            this.user.name = user.name;
            this.user.email = user.email;
            this.editing = true;
            this.dialog = true;
        },
        async deleteUser (userId) {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.delete('/users/'+userId , {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then(() => {
                notify({
                    group: 'get',
                    title: 'Remoção bem sucedido',
                    text: 'Remoção realizada com sucesso!',
                    type: 'success',
                });
                this.getUsers();
            })
        },
        async saveUser() {
            this.$refs.form.validate();
            if (this.valid) {
                const payload = {
                    name: this.user.name,
                    email: this.user.email,
                    password: this.user.password
                };
                const user = JSON.parse(localStorage.getItem('user'));

                await http.post('/users', payload, {
                    headers: {
                        'Authorization': 'Bearer'+user.access_token
                    }
                })
                .then(response => {
                    notify({
                        group: 'get',
                        title: 'Cadastro bem sucedido',
                        text: 'Cadastro realizado com sucesso!',
                        type: 'success',
                    });
                    this.getUsers();
                    this.dialog = false;
                })
                .catch(err => {
                    notify({
                        group: 'get',
                        title: 'Erro',
                        text: 'Favor contatar o suporte.',
                        type: 'error',
                    });
                });
            }
        },
        async getPermissions() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/permissions', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                response.data.permissions.forEach ((permission, key) => {
                    this.permissions[key] = {
                        title: permission.name,
                        key: permission.id
                    };
                })
            })
            .catch(err => {
                notify({
                    group: 'get',
                    title: 'Erro',
                    text: 'Favor contatar o suporte.',
                    type: 'error',
                });
            });
        },
        async addPermissionUser () {
            let permissionId = null;
            this.permissions.forEach((permission => {
                if (permission.title == this.selectedPermission) {
                    permissionId = permission.key;
                }
            }))
            const user = JSON.parse(localStorage.getItem('user'));
            await http.post('/userPermission', { userId: this.selectedUser, permissionId }, {
                headers: {
                    'Authorization': 'Bearer' + user.access_token
                }
            })
            .then(() => {
                notify({
                    group: 'get',
                    title: 'Cadastro bem sucedido',
                    text: 'Registro atualizado com sucesso!',
                    type: 'success',
                });
                this.getUsers();
                this.dialogPermission = false;
            })
            .catch(err => {
                notify({
                    group: 'get',
                    title: 'Erro',
                    text: 'Favor contatar o suporte.',
                    type: 'error',
                });
            });
        },
        async saveEditedUser() {
            const payload = {
                name: this.user.name,
                email: this.user.email,
                password: this.user.password
            };
            const user = JSON.parse(localStorage.getItem('user'));
            await http.put(`/users/${this.editedUser.id}`, payload, {
                headers: {
                    'Authorization': 'Bearer' + user.access_token
                }
            })
            .then(() => {
                notify({
                    group: 'get',
                    title: 'Cadastro bem sucedido',
                    text: 'Registro atualizado com sucesso!',
                    type: 'success',
                });
                this.getUsers();
                this.dialog = false;
            })
            .catch(err => {
                notify({
                    group: 'get',
                    title: 'Erro',
                    text: 'Favor contatar o suporte.',
                    type: 'error',
                });
            });
        },
        dialogPermissionFunction (userId) {
            this.dialogPermission = true;
            this.selectedUser = userId;
        }
    },
    mounted(){
        this.getUsers()
        this.getPermissions()
    }
}
</script>