import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import UserProfile from "@/components/UserProfile.vue";

const routes = [
  { path: "/", name: "Login", component: LoginForm },
  { path: "/user/:userId", name: "UserProfile", component: UserProfile },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
