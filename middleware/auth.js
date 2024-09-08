import { useAuthStore } from "~/store/auth";
import { watchEffect, nextTick } from "vue"; // Import necessary functions

// Define Nuxt route middleware for authentication checks
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoading, user, token } = storeToRefs(useAuthStore());

  // Watch for changes in loading state and user authentication status
  watchEffect(() => {
    if (!isLoading.value) {
      // If the user is not authenticated and trying to access a route other than login, redirect to login
      if (!user.value && to.path !== "/login") {
        console.log("Redirecting to /login");
        return navigateTo("/login");
      }

      // If the user is authenticated and trying to access the login route, redirect to the home page
      if (user.value && to.path === "/login") {
        console.log("Navigating to / from /login");
        return navigateTo("/");
      }
    }
  });

  // Allow route navigation to the registration page without authentication
  if (to.name === "register") {
    return;
  }

  // Ensure the entire DOM has been updated before proceeding
  await nextTick();
});
