<script setup>
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const authCookie = useCookie("auth_token");

watch(
  authCookie,
  () => {
    authStore.initializeFromCookie();
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>
