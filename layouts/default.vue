<template>
  <div class="h-screen">
    <div class="flex flex-row justify-between bg-white fixed">
      <button @click="toggleSidebar" class="md:hidden text-black pl-3">
        <UIcon name="i-heroicons-bars-3" size="25" />
      </button>
      <TopBar class="h-[5vh] w-[95vw] md:w-[100vw] px-8" />
    </div>

    <Sidebar
      :class="[
        { flex: sidebarOpen, hidden: !sidebarOpen },
        'md:block w-fit transition-all fixed bg-white h-screen',
      ]"
      @toggle="toggleSidebar"
    />
    <div
      :class="[
        { 'opacity-50': sidebarOpen },
        'pt-[5vh] bg-zinc-100 min-h-screen transition-opacity',
      ]"
      @click="handleClick"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(false);

const handleClick = () => {
  if (sidebarOpen.value) {
    toggleSidebar();
  }
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>
