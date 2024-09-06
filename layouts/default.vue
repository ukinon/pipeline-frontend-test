<template>
  <Sidebar class="w-fit transition-all fixed bg-white h-screen" />
  <div class="pl-[5vw] h-screen">
    <TopBar class="h-[5vh] fixed w-[95vw] px-8" />
    <div class="pt-[5dvh] bg-zinc-100 min-h-screen">
      <slot />
    </div>
  </div>
</template>
