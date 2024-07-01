import { createWebHistory, createRouter } from "vue-router";
import useAuthStore from "../store/auth";

import AuthView from "../pages/AuthView.vue";
import HomeView from "../pages/HomeView.vue";
import BlocksView from "../pages/BlocksView.vue";
import ProgressView from "../pages/ProgressView.vue";
import BlockDetailView from "../pages/BlockDetailView.vue";

const routes = [
  { path: "/", redirect: "/auth" },
  { path: "/auth", name: "auth", component: AuthView },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/blocks",
    name: "blocks",
    component: BlocksView,
    meta: { requiresAuth: true },
  },
  {
    path: "/blocks/:id",
    name: "block-detail",
    component: BlockDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/progress",
    name: "progress",
    component: ProgressView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/auth",
  },
];

const router = createRouter({
  mode: "history",
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
