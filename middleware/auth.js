import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.initializeFromCookie();

  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (
    authStore.isAuthenticated &&
    (to.path === "/login" || to.path === "/register")
  ) {
    return navigateTo("/");
  }
});
