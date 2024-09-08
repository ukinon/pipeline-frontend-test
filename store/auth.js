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
    async login(email, password) {
      const { $supabase: supabase } = useNuxtApp();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log(data);

      this.setSession(data);
    },
    setSession(data) {
      const { session, user } = data;
      this.token = session.access_token;
      this.user = user;
      const authCookie = useCookie("auth_token");
      authCookie.value = this.token;
    },
    clearSession() {
      this.user = null;
      this.token = null;
      const authCookie = useCookie("auth_token");
      authCookie.value = null;
    },
    async initializeFromCookie() {
      this.isLoading = true;
      const authCookie = useCookie("auth_token");
      this.token = authCookie.value;

      if (this.token) {
        await this.fetchUserDetails();
      }
      this.isLoading = false;
    },

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
