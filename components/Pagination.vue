<template>
  <div class="flex justify-between items-center mt-4 text-black">
    <UButton
      @click="$emit('change-page', currentPage - 1)"
      :disabled="currentPage === 1"
    >
      Previous
    </UButton>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <UButton
      @click="$emit('change-page', currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      Next
    </UButton>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
});
defineEmits(["change-page"]);
</script>
