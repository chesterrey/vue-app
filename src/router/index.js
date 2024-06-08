import { createWebHistory, createRouter } from "vue-router";
import useAuthStore from "../store/auth";

import AuthView from "../pages/AuthView.vue";
import HomeView from "../pages/HomeView.vue";

const routes = [
  { path: "/", redirect: "/auth" },
  { path: "/auth", name: "auth", component: AuthView },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const authStore = useAuthStore();

router.beforeEach((to, from, next) => {
  authStore.validateSession();

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: "auth" });
  } else if (to.name === "auth" && isAuthenticated.value) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
