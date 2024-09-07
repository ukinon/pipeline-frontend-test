import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const token = computed(() => authStore.token);

  if (to.name === "register") {
    return;
  }
  if (!token.value && to.path !== "/login") {
    return navigateTo("/login");
  }
  if (token.value && to.path === "/login") {
    return navigateTo("/");
  }
});
