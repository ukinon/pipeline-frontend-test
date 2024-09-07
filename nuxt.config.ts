import type { NuxtPage } from "nuxt/schema";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  compatibilityDate: "2024-09-06",
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
      supabasePrivateKey: process.env.PRIVATE_SUPABASE_SERVICE_KEY,
    },
  },
});
