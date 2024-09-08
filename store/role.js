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

      if (error) throw error;

      this.roles = data;
      this.totalPages = Math.ceil(data.length / limit);

      return { roles: this.roles, totalPages: this.totalPages };
    },
    async addRoles(rolesData) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { data, error } = await supabase.from("roles").insert(rolesData);
        if (error) throw error;
        toast.add({ title: "Success", description: "Role added successfully" });
        return data;
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to add role",
          color: "red",
        });
        throw error;
      }
    },
    async updateRoles(rolesId, rolesData) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { data, error } = await supabase
          .from("roles")
          .update(rolesData)
          .eq("id", rolesId);
        if (error) throw error;
        toast.add({
          title: "Success",
          description: "Role updated successfully",
        });
        return data;
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to update role",
          color: "red",
        });
        throw error;
      }
    },
    async deleteRoles(rolesId) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { error } = await supabase
          .from("roles")
          .delete()
          .eq("id", rolesId);
        if (error) throw error;
        toast.add({
          title: "Success",
          description: "Role deleted successfully",
        });
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to delete role",
          color: "red",
        });
        throw error;
      }
    },
  },
});
