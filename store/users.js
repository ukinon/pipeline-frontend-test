import { defineStore } from "pinia";
import { createClient } from "@supabase/supabase-js";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    totalPages: 0,
  }),
  actions: {
    /**
     * Fetch users from Supabase with pagination.
     * @param {Number} page - The current page number.
     * @param {Number} limit - The number of users per page.
     * @return {Object} - Returns an object containing users and total pages.
     */
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

    /**
     * Add a new user to Supabase.
     * @param {Object} userData - The data for the new user.
     * @return {Object} - Returns the data of the created user.
     */
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

    /**
     * Update an existing user's information.
     * @param {String} userId - The ID of the user to update.
     * @param {Object} userData - The new data for the user.
     * @return {Object} - Returns the updated user data.
     */
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

    /**
     * Delete a user by their ID.
     * @param {String} userId - The ID of the user to delete.
     */
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
