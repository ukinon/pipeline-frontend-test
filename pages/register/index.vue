<template>
  <div
    class="min-h-screen flex items-center justify-center bg-transparent w-screen"
  >
    <UCard class="w-full max-w-md flex flex-col gap-5 bg-transparent">
      <template #header>
        <h2 class="text-2xl font-bold text-center">Register</h2>
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
        <UFormGroup label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="formState.confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
        </UFormGroup>
        <UButton type="submit" color="primary" block>Register</UButton>
      </UForm>
      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:underline"
            >Login</NuxtLink
          >
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "login",
  middleware: "",
});

const { $supabase } = useNuxtApp();

const formState = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const router = useRouter();

const onSubmit = async () => {
  if (formState.value.password !== formState.value.confirmPassword) {
    console.error("Passwords do not match.");
    return;
  }

  try {
    const { user, error } = await $supabase.auth.signUp({
      email: formState.value.email,
      password: formState.value.password,
      app_metadata: {
        role: "user",
      },
    });

    if (error) {
      console.error("Registration failed:", error.message);
      return;
    }

    if (user) {
      await router.push("/login");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};
</script>
