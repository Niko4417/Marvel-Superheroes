import { createRouter, createWebHistory } from "vue-router";
import home from "../components/home.vue";

const routes = [
    { path: '/', name: "home", component: home },
    {
        path: '/categories',
        name: "categories",
        component: () => import('../components/displayData.vue')
    },
    {
        path: '/favorites',
        name: "favorites",
        component: () => import('../components/favorites.vue')
    },
    {
        path: '/funfacts',
        name: "funfacts",
        component: () => import('../components/funFacts.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export { routes };
export default router;
