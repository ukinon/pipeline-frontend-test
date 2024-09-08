import { useAuthStore } from "~/store/auth";

// Define Nuxt route middleware for role-based access control
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const { user, isLoading } = storeToRefs(authStore);

  // Watch for changes in loading state and user details
  watchEffect(() => {
    if (!isLoading.value) {
      // Proceed if the user object and role exist
      if (
        user.value &&
        user.value.app_metadata &&
        user.value.app_metadata.role
      ) {
        const userRole = user.value.app_metadata.role;
        // Check if user is either 'admin' or 'super', otherwise abort navigation
        if (userRole !== "admin" && userRole !== "super") {
          console.warn("Access denied: Insufficient permissions");
          return abortNavigation();
        }
      } else {
        // Redirect to homepage if no valid user or role found
        console.warn("User not found or role missing, redirecting to homepage");
        return navigateTo("/");
      }
    }
  });
});
