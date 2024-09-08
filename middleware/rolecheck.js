import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const { user, isLoading } = storeToRefs(authStore);

  watchEffect(() => {
    if (!isLoading.value) {
      if (
        user.value &&
        user.value.app_metadata &&
        user.value.app_metadata.role
      ) {
        const userRole = user.value.app_metadata.role;
        if (userRole !== "admin" && userRole !== "super") {
          return abortNavigation();
        }
      } else {
        return navigateTo("/");
      }
    }
  });
});
