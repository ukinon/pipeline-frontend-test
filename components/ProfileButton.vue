<script setup>
import { useAuthStore } from "~/store/auth";
const props = defineProps({
  hovered: Boolean,
});

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const router = useRouter();

console.log(user);

const items = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
    },
  ],
  [
    {
      label: "Sign Out",
      icon: "i-heroicons-signout",
      click: () => {
        authStore.clearSession();
        router.push("/login");
      },
    },
  ],
];
</script>

<template>
  <UDropdown
    :items="items"
    :popper="{ placement: 'bottom-start' }"
    class="w-full"
  >
    <div class="flex flex-row items-center gap-2 py-3 rounded-lg w-full">
      <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
      <p v-if="hovered">{{ user?.app_metadata.role }}</p>
    </div>
  </UDropdown>
</template>
