import { defineStore } from "pinia";
import { createClient } from "@supabase/supabase-js";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    isLoading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    /**
     * Login a user using email and password.
     * @param {String} email - The user's email.
     * @param {String} password - The user's password.
     */
    async login(email, password) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        console.log(data);
        this.setSession(data);
      } catch (error) {
        console.error("Login failed:", error.message);
        toast.add({
          title: "Login Failed",
          description: error.message || "An error occurred during login",
          color: "red",
        });
        throw error;
      }
    },

    /**
     * Set the authentication session data.
     * @param {Object} data - The session data.
     */
    setSession(data) {
      const { session, user } = data;
      this.token = session.access_token;
      this.user = user;
      const authCookie = useCookie("auth_token");
      authCookie.value = this.token;
    },

    /**
     * Clear the current authentication session.
     */
    clearSession() {
      this.user = null;
      this.token = null;
      const authCookie = useCookie("auth_token");
      authCookie.value = null;
    },

    /**
     * Initialize user session from the auth token cookie.
     */
    async initializeFromCookie() {
      this.isLoading = true;
      const authCookie = useCookie("auth_token");
      this.token = authCookie.value;

      if (this.token) {
        await this.fetchUserDetails();
      }
      this.isLoading = false;
    },

    /**
     * Fetch user's details using the stored token.
     */
    async fetchUserDetails() {
      if (!this.token) {
        console.error("Auth session missing!");
        this.isLoading = false;
        return;
      }

      const runtimeConfig = useRuntimeConfig();
      const supabase = createClient(
        runtimeConfig.public.supabaseUrl,
        runtimeConfig.public.supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        }
      );

      try {
        const { data: user, error } = await supabase.auth.getUser();
        console.log(user);

        if (error) {
          console.error("Failed to fetch user details:", error);
        } else {
          this.user = user.user;
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
