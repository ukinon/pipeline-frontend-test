import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { createClient } from "@supabase/supabase-js";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    totalPages: 0,
  }),
  actions: {
    async fetchUsers(page, limit) {
      const supabase = createClient(
        useRuntimeConfig().public.supabaseUrl,
        useRuntimeConfig().public.supabasePrivateKey
      );

      const { data, error } = await supabase.auth.admin.listUsers({
        page: page,
        per_page: limit,
      });

      if (error) throw error;

      this.users = data.users;
      this.totalPages = Math.ceil(data.total / limit);

      return { users: this.users, totalPages: this.totalPages };
    },
    async addUser(userData) {
      const supabase = createClient(
        useRuntimeConfig().public.supabaseUrl,
        useRuntimeConfig().public.supabasePrivateKey
      );
      const { data, error } = await supabase.auth.admin.createUser({
        ...userData,
        app_metadata: {
          role: userData.role,
        },
      });
      if (error) throw error;
      return data;
    },
    async updateUser(userId, userData) {
      const supabase = createClient(
        useRuntimeConfig().public.supabaseUrl,
        useRuntimeConfig().public.supabasePrivateKey
      );
      const { data, error } = await supabase.auth.admin.updateUserById(
        userId,
        userData
      );
      if (error) throw error;
      return data;
    },
    async deleteUser(userId) {
      const supabase = createClient(
        useRuntimeConfig().public.supabaseUrl,
        useRuntimeConfig().public.supabasePrivateKey
      );
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
  },
});
