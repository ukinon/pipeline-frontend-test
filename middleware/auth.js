import { useAuthStore } from "~/store/auth";
import { watchEffect, nextTick } from "vue"; // Import necessary functions

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoading, user, token } = storeToRefs(useAuthStore());

  watchEffect(() => {
    if (!isLoading.value) {
      if (!user.value && to.path !== "/login") {
        console.log("Redirecting to /login");
        return navigateTo("/login");
      }

      if (user.value && to.path === "/login") {
        console.log("Navigating to / from /login");
        return navigateTo("/");
      }
    }
  });

  if (to.name === "register") {
    return;
  }

  await nextTick();
});
