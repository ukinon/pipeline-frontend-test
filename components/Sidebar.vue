<script setup>
import { ref } from "vue";

const hovered = ref(false);

const links = [
  {
    label: "Products",
    icon: "i-heroicons-home",
    to: "/products",
  },
  {
    label: "Users",
    icon: "i-heroicons-user",
    to: `/users`,
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog",
    to: "/settings",
  },
];
</script>

<template>
  <div
    class="bg-white p-3 flex flex-col justify-between gap-4 text-black h-[100dvh] ease-in-out duration-300 transition-all z-[9999]"
    :class="{ hovered: hovered, 'pr-10': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="flex flex-col gap-5 overflow-hidden">
      <div class="p-3">
        <UIcon
          name="i-material-symbols:dashboard"
          size="25"
          @click="navigateTo('/')"
          class="hover:cursor-pointer"
        />
      </div>

      <div
        v-for="link in links"
        :key="link.to"
        class="flex gap-2 items-center rounded-lg hover:bg-gray-100 cursor-pointer p-3"
        @click="navigateTo(link.to)"
      >
        <UIcon v-if="link.icon" :name="link.icon" size="25" />
        <span v-bind:class="{ 'lg:hidden': !hovered }">
          {{ link.label }}
        </span>
      </div>
    </div>

    <div class="justify-self-end">
      <ProfileButton :hovered="hovered" />
    </div>
  </div>
</template>
