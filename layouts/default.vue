<template>
  <Sidebar class="w-fit transition-all fixed bg-white h-screen" />
  <div class="h-screen">
    <TopBar class="h-[5vh] fixed w-[100vw] px-8" />
    <div class="pt-[5dvh] bg-zinc-100 min-h-screen">
      <slot />
    </div>
  </div>
</template>
