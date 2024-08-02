import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            redirect: '/guest',
        },
        {
            path: '/guest',
            component: () => import('@/views/LayoutGuest.vue'),
            children: [
                {
                    path: '/guest',
                    redirect: '/login',
                },
                {
                    name: 'login',
                    path: '/login',
                    component: Login
                }
            ]
        },
        {
            path: '/app',
            component: () => import('@/views/LayoutAuth.vue'),
            children: [
                {
                    path: '/app',
                    redirect: '/dashboard',
                },
                {
                    name: 'Dashboard',
                    path: '/dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'Users',
                    path: '/users',
                    component: () => import('@/views/Users.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'Courses',
                    path: '/courses',
                    component: () => import('@/views/Courses.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },       
    ]
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user');

    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next('/');
    } else if (!to.matched.some(record => record.meta.requiresAuth) && loggedIn) {
        next('/app');
    } else {
        next();
    }
});

export default router;