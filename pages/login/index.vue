<template>
  <div
    class="min-h-screen flex items-center justify-center bg-transparent w-[80vw]"
  >
    <UCard class="w-full max-w-md flex flex-col gap-5 bg-transparent">
      <template #header>
        <h2 class="text-2xl font-bold text-center">Login</h2>
      </template>
      <UForm
        :state="formState"
        @submit="onSubmit"
        class="flex flex-col gap-5 bg-transparent"
      >
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="formState.email"
            type="email"
            placeholder="Enter your email"
          />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="Enter your password"
          />
        </UFormGroup>
        <UButton type="submit" color="primary" block>Login</UButton>
      </UForm>
      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:underline"
            >Register</NuxtLink
          >
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/store/auth";

definePageMeta({
  layout: "login",
  middleware: ["auth"],
});

const formState = ref({
  email: "",
  password: "",
});

const router = useRouter();
const authStore = useAuthStore();

const onSubmit = async () => {
  try {
    await authStore.login(formState.value.email, formState.value.password);
    await router.push("/");
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};
</script>
