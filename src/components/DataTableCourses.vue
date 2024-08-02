<template>
    <v-btn prepend-icon="mdi-plus-thick" color="orange" class="mb-6" @click="dialog = true">Adicionar Curso</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ editing ? 'Editar Curso' : 'Cadastro de Curso' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-model="course.name"
                        label="Nome"
                        :rules="[v => !!v || 'Nome é obrigatório']"
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
    <v-dialog v-model="dialogLinkUser" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Vincular Usuário</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-select
                        v-model="selectedUser"
                        :items="users"
                        label="Escolha uma opção"
                        outlined
                    ></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="dialogLinkUser=false">Cancelar</v-btn>
                <v-btn color="orange" text @click="linkUserCourse()">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-data-table :headers="headers" :items="courses" class="elevation-1">
                        <template v-slot:item.actions="{ item }">
                            <v-btn small class="mr-2" color="yellow" @click="dialogLinkUserFunction(item.id)">
                                Vincular usuário ao curso
                            </v-btn>
                            <v-btn small class="mr-2" color="orange" @click="editCourse(item)">
                                Editar
                            </v-btn>
                            <v-btn small color="red" @click="deleteCourse(item.id)">
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
            { title: 'Ações', key: 'actions'}
        ],
        courses: [],
        users: [],
        selectedUser: null,
        selectedCourse: null,
        dialog: false,
        dialogLinkUser: false,
        editing: false,
        valid: false,
        course: {
            name: ''
        },
        editedCourse: null,
    }),
    methods: {
        persist () {
            if (this.editing) {
                this.saveEditedCourse();
            } else {
                this.saveCourse();
            }
        },
        cancelModal () {
            this.dialog = false
            this.editing = false
            this.course.name = ''
        },
        dialogLinkUserFunction (courseId) {
            this.dialogLinkUser = true
            this.selectedCourse = courseId;
        },
        async getCourses() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/courses', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                this.courses = response.data.courses;
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
        async saveCourse() {
            this.$refs.form.validate();
            if (this.valid) {
                const payload = {
                    name: this.course.name
                };
                const user = JSON.parse(localStorage.getItem('user'));

                await http.post('/courses', payload, {
                    headers: {
                        'Authorization': 'Bearer'+user.access_token
                    }
                })
                .then(() => {
                    this.getCourses();
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
        async deleteCourse (courseId) {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.delete('/courses/'+courseId , {
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
                this.getCourses();
            })
        },
        async linkUserCourse () {
            let userId = null;
            this.users.forEach((user => {
                if (user.title == this.selectedUser) {
                    userId = user.key;
                }
            }))
            const user = JSON.parse(localStorage.getItem('user'));
            await http.post('/addUserInCourse', { courseId: this.selectedCourse, userId }, {
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
                this.getCourses();
                this.dialogLinkUser = false;
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
        async saveEditedCourse() {
            const payload = {
                name: this.course.name,
            };
            const user = JSON.parse(localStorage.getItem('user'));
            await http.put(`/users/${this.editedCourse.id}`, payload, {
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
                this.getCourses();
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
        async getUsers() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/users', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                response.data.users.forEach ((user, key) => {
                    this.users[key] = {
                        title: user.name,
                        key: user.id
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
        editCourse(course) {
            this.editedCourse = { ...course };
            this.course.name = course.name;
            this.editing = true;
            this.dialog = true;
        },
    },
    mounted(){
        this.getCourses()
        this.getUsers()
    }
}
</script>