<template>
    <v-row>
        <v-col cols="12" md="4">
            <v-card>
            <v-card-title>Cursos em Andamento</v-card-title>
            <v-card-text>
                <v-progress-circular :value="trainingProgress.inProgress" size="70" width="7">
                {{ trainingProgress.inProgress }}%
                </v-progress-circular>
            </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card>
            <v-card-title>Cursos Concluídos</v-card-title>
            <v-card-text>
                <v-progress-circular :value="trainingProgress.completed" size="70" width="7" color="green">
                {{ trainingProgress.completed }}%
                </v-progress-circular>
            </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card>
            <v-card-title>Cursos Pendentes</v-card-title>
            <v-card-text>
                <v-progress-circular :value="trainingProgress.pending" size="70" width="7" color="red">
                {{ trainingProgress.pending }}%
                </v-progress-circular>
            </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import http from '@/services/auth';

export default {
    data: () => ({
      trainingProgress: []
    }),
    methods: {
        async getResume() {
            const user = JSON.parse(localStorage.getItem('user'));
            await http.get('/courses/resume', {
                headers: {
                    'Authorization': 'Bearer'+user.access_token
                }
            })
            .then (response => {
                this.trainingProgress = response.data.resume;
            })
            .catch(err => {
                if (err.response.status === 401) {
                    localStorage.removeItem('user');
                    this.$router.push({ name: 'login' });
                }
            });
        }
    },
    mounted(){
        this.getResume()
    }
}
</script>