<template>
    <v-row>
        <v-col cols="12">
            <v-card>
            <v-card-title>Atividades dos Subordinados</v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="subordinates" class="elevation-1"></v-data-table>
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
            { title: 'Nome', key: 'name' },
            { title: 'Cursos em Andamento', key: 'inProgress' },
            { title: 'Cursos Concluídos', key: 'completed' }
        ],
        subordinates: []
    }),
    methods: {
        async getResume() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/users/resume', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                this.subordinates = response.data.resume;
            });
        }
    },
    mounted(){
        this.getResume()
    }
}
</script>