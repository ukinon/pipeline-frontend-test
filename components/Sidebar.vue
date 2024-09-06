<script setup lang="ts">
const route = useRoute();
import { ref } from "vue";

const hovered = ref(false);

const links = [
  {
    label: "Installation",
    icon: "i-heroicons-home",
    to: "/getting-started/installation",
  },
  {
    label: "Vertical Navigation",
    icon: "i-heroicons-chart-bar",
    to: `${
      route.path.startsWith("/dev") ? "/dev" : ""
    }/components/vertical-navigation`,
  },
  {
    label: "Command Palette",
    icon: "i-heroicons-command-line",
    to: "/components/command-palette",
  },
];
</script>

<template>
  <div
    class="bg-white p-4 flex flex-col justify-between gap-4 text-black h-screen ease-in-out duration-300 transition-all min-w-[5vw] z-[9999]"
    :class="{ hovered: hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="flex flex-col gap-5 overflow-hidden">
      <h1
        :class="{ 'opacity-0': !hovered, 'opacity-100': hovered }"
        class="text-lg font-bold transition-opacity duration-300"
      >
        Dashboard
      </h1>
      <div v-for="link in links" :key="link.to" class="flex gap-2 items-center">
        <UIcon v-if="link.icon" :name="link.icon" size="25" />
        <span v-if="hovered">
          {{ link.label }}
        </span>
      </div>
    </div>

    <div class="justify-self-end">
      <ProfileButton />
    </div>
  </div>
</template>
