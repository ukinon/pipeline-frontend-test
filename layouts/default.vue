<template>
  <div class="h-screen">
    <TopBar class="h-[5vh] fixed w-[100vw] px-8">
      <button @click="toggleSidebar" class="md:hidden">
        <UIcon name="i-heroicons-bars-3" size="25" />
      </button>
    </TopBar>
    <Sidebar
      :isOpen="sidebarOpen"
      @toggle="toggleSidebar"
      class="w-fit transition-all fixed bg-white h-screen hidden md:flex"
    />
    <div class="pt-[5dvh] bg-zinc-100 min-h-screen">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>
