<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <!-- <v-card-title>Usuários</v-card-title> -->
                <v-card-text>
                    <v-data-table :headers="headers" :items="users" class="elevation-1"></v-data-table>
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
            { title: 'Email', key: 'email' }
        ],
        users: []
    }),
    methods: {
        async getUsers() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/users', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                this.users = response.data.users;
            })
            .catch(err => {
                alert('Failed');
            });
        }
    },
    mounted(){
        this.getUsers()
    }
}
</script>