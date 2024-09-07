import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  console.log(user.value.app_metadata.role);

  if (
    user.value.app_metadata?.role !== "admin" &&
    user.value.app_metadata.role !== "super"
  ) {
    return abortNavigation();
  }
});
