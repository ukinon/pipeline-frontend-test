<script setup>
import { useAuthStore } from "~/store/auth";
const props = defineProps({
  hovered: Boolean,
});

const { user } = storeToRefs(useAuthStore());

console.log(user);

const items = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
      click: () => {
        navigateTo("/profile");
      },
    },
  ],
  [
    {
      label: "Sign Out",
      icon: "i-heroicons-signout",
      click: () => {
        useAuthStore().clearSession();
        navigateTo("/login");
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
      <p v-bind:class="{ 'lg:hidden': !hovered }">
        {{ user?.app_metadata.role }}
      </p>
    </div>
  </UDropdown>
</template>
