import { defineStore } from "pinia";

export const useOrgsStore = defineStore("orgs", {
  state: () => ({
    orgs: [],
    totalPages: 0,
  }),
  actions: {
    async fetchOrgs(page, limit) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();

      try {
        const { data, error } = await supabase.from("orgs").select("*", {
          page: page,
          per_page: limit,
        });
        if (error) throw error;

        this.orgs = data;
        this.totalPages = Math.ceil(data.length / limit);
        return { orgs: this.orgs, totalPages: this.totalPages };
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to fetch organizations",
          color: "red",
        });
        throw error;
      }
    },
    async addOrgs(orgsData) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { data, error } = await supabase.from("orgs").insert(orgsData);
        if (error) throw error;
        toast.add({
          title: "Success",
          description: "Organization added successfully",
        });
        return data;
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to add organization",
          color: "red",
        });
        throw error;
      }
    },
    async updateOrgs(orgsId, orgsData) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { data, error } = await supabase
          .from("orgs")
          .update(orgsData)
          .eq("id", orgsId);
        if (error) throw error;
        toast.add({
          title: "Success",
          description: "Organization updated successfully",
        });
        return data;
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to update organization",
          color: "red",
        });
        throw error;
      }
    },
    async deleteOrgs(orgsId) {
      const { $supabase: supabase } = useNuxtApp();
      const toast = useToast();
      try {
        const { error } = await supabase.from("orgs").delete().eq("id", orgsId);
        if (error) throw error;
        toast.add({
          title: "Success",
          description: "Organization deleted successfully",
        });
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to delete organization",
          color: "red",
        });
        throw error;
      }
    },
  },
});
