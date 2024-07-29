import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Users from '@/views/Users.vue';
import Courses from '@/views/Courses.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/users',
            component: Users,
            meta: { requiresAuth: true }
        },
        {
            path: '/courses',
            component: Courses,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user');

    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router;