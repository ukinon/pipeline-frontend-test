import { defineStore } from "pinia";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    roles: [],
    totalPages: 0,
  }),
  actions: {
    async fetchRoles(page, limit) {
      const { $supabase: supabase } = useNuxtApp();

      const { data, error } = await supabase.from("roles").select("*", {
        page: page,
        per_page: limit,
      });
      console.log(data);

      if (error) throw error;

      this.roles = data;
      this.totalPages = Math.ceil(data.length / limit);

      return { roles: this.roles, totalPages: this.totalPages };
    },
    async addRoles(rolesData) {
      const { $supabase: supabase } = useNuxtApp();
      const { data, error } = await supabase.from("roles").insert(rolesData);
      if (error) throw error;
      return data;
    },
    async updateRoles(rolesId, rolesData) {
      const { $supabase: supabase } = useNuxtApp();
      const { data, error } = await supabase
        .from("roles")
        .update(rolesData)
        .eq("id", rolesId);
      if (error) throw error;
      return data;
    },
    async deleteRoles(rolesId) {
      const { $supabase: supabase } = useNuxtApp();
      const { error } = await supabase.from("roles").delete().eq("id", rolesId);
      if (error) throw error;
    },
  },
});
