<script setup>
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
console.log(user);
</script>

<template>
  <div class="bg-white p-4 flex justify-end items-center">
    <div class="flex items-center">
      <svg
        class="w-6 h-6 text-black mr-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.917V5a3 3 0 10-6 0v.083A6.002 6.002 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m8 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span class="text-black"
        >{{ user?.email }}({{ user?.app_metadata.org }})</span
      >
    </div>
  </div>
</template>
