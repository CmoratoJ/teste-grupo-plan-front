<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-data-table :headers="headers" :items="courses" class="elevation-1"></v-data-table>
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
            { title: 'Nome', key: 'name' }
        ],
        courses: []
    }),
    methods: {
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
                alert('Failed');
            });
        }
    },
    mounted(){
        this.getCourses()
    }
}
</script>