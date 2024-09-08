<template>
  <div class="mx-auto w-[80vw] flex flex-col gap-5 py-5">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ currentUser?.email }}
        </h3>
      </template>
      <form class="flex flex-col gap-3">
        <span>Email</span>
        <UInput
          v-model="email"
          label="Email"
          type="email"
          :disabled="true"
          required
        />

        <span>Role</span>
        <UInput
          v-model="role"
          label="Role"
          type="text"
          :disabled="true"
          required
        />

        <span>Organization</span>
        <UInput
          v-model="orgs"
          label="Organization"
          type="text"
          required
          :disabled="true"
        />
      </form>
    </UCard>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";

definePageMeta({
  middleware: ["auth"],
});

const { user: currentUser } = storeToRefs(useAuthStore());

const email = ref("");
const role = ref("");
const orgs = ref("");

watchEffect(() => {
  if (currentUser.value) {
    email.value = currentUser.value.email;
    role.value = currentUser.value.app_metadata?.role;
    orgs.value = currentUser.value.app_metadata?.org;
  }
});
</script>
