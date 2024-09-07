<template>
  <div class="flex flex-col gap-3">
    <RoleSection />
    <OrgSection />
  </div>
</template>

<script setup>
{
  definePageMeta({
    middleware: ["auth", "rolecheck"],
  });
}
</script>
