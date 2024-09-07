import { defineStore } from "pinia";

export const useOrgsStore = defineStore("orgs", {
  state: () => ({
    orgs: [],
    totalPages: 0,
  }),
  actions: {
    async fetchOrgs(page, limit) {
      const { $supabase: supabase } = useNuxtApp();

      const { data, error } = await supabase.from("orgs").select("*", {
        page: page,
        per_page: limit,
      });
      console.log(data);

      if (error) throw error;

      this.orgs = data;
      this.totalPages = Math.ceil(data.length / limit);

      return { orgs: this.orgs, totalPages: this.totalPages };
    },
    async addOrgs(orgsData) {
      const { $supabase: supabase } = useNuxtApp();
      const { data, error } = await supabase.from("orgs").insert(orgsData);
      if (error) throw error;
      return data;
    },
    async updateOrgs(orgsId, orgsData) {
      const { $supabase: supabase } = useNuxtApp();
      const { data, error } = await supabase
        .from("orgs")
        .update(orgsData)
        .eq("id", orgsId);
      if (error) throw error;
      return data;
    },
    async deleteOrgs(orgsId) {
      const { $supabase: supabase } = useNuxtApp();
      const { error } = await supabase.from("orgs").delete().eq("id", orgsId);
      if (error) throw error;
    },
  },
});
