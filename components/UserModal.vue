<template>
  <UModal :model-value="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ isEditing ? "Edit User" : "Add User" }}
        </h3>
      </template>
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <span>Email</span>
        <UInput
          v-model="email"
          label="Email"
          type="email"
          :disabled="isHigherRole()"
          required
        />
        <span
          v-if="
            (!isEditing &&
              (currentRole === 'admin' || currentRole === 'super')) ||
            (isEditing && isHigherRole(currentRole, role))
          "
          >Password</span
        >
        <UInput
          v-if="
            (!isEditing &&
              (currentRole === 'admin' || currentRole === 'super')) ||
            (isEditing && isHigherRole(currentRole, role))
          "
          v-model="password"
          label="Password"
          type="password"
          :disabled="isHigherRole()"
        />
        <span>Role</span>

        <USelect
          v-model="role"
          :options="roleOptions"
          label="Role"
          :disabled="isHigherRole()"
          required
        />
        <span v-if="currentRole === 'super'">Organization</span>

        <USelect
          v-if="currentRole === 'super'"
          v-model="orgs"
          :options="orgsOptions"
          label="Orgs"
          required
        />

        <div class="flex justify-between mt-4">
          <UButton type="submit" color="green"
            >{{ isEditing ? "Update" : "Add" }} User</UButton
          >
          <UPopover v-if="isEditing">
            <UButton
              color="red"
              label="Delete"
              trailing-icon="i-heroicons-trash-20-solid"
            />
            <template #panel>
              <div class="p-4">
                <p>Are you sure you want to delete this user?</p>
                <div class="mt-2 flex justify-end">
                  <UButton color="red" @click="confirmDelete">Delete</UButton>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup>
import { useOrgsStore } from "~/store/orgs";

import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/store/auth";
import { useUsersStore } from "~/store/users";

const props = defineProps({
  user: Object,
});
const authStore = useAuthStore();
const usersStore = useUsersStore();
const orgsStore = useOrgsStore();

const email = ref("");
const password = ref("");
const role = ref("");
const { user: currentUser } = storeToRefs(authStore);
const currentRole = computed(() => currentUser.value.app_metadata.role);
const orgs = ref("");
const orgsOptions = ref([]);

const isEditing = computed(() => !!props.user);
const roleOptions = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

if (currentRole.value === "super") {
  roleOptions.push({ label: "Super", value: "super" });
}

const fetchOrgs = async () => {
  const { orgs: fetchedOrgs, totalPages: total } = await orgsStore.fetchOrgs(
    1,
    9999
  );
  fetchedOrgs.forEach((org) => {
    orgsOptions.value.push({ label: org.name, value: org.name });
  });
  console.log(orgs);
};

onMounted(async () => {
  if (props.user) {
    email.value = props.user.email;
    password.value = props.user.password;
    role.value = props.user.app_metadata.role;
  }
  await fetchOrgs();
});

const isHigherRole = (current, target) => {
  const rolePriority = { super: 3, admin: 2, user: 1 };
  return rolePriority[current] > rolePriority[target];
};

const submitForm = async () => {
  if (isEditing.value) {
    await usersStore.updateUser(props.user.id, {
      email: email.value,
      app_metadata: {
        role: role.value,
        org: orgs.value,
      },
      role: "authenticated",
    });
    emit("user-updated");
  } else {
    await usersStore.addUser({
      email: email.value,
      password: password.value,
      role: role.value,
    });
    emit("user-added");
  }
};

const confirmDelete = async () => {
  await usersStore.deleteUser(props.user.id);
  emit("user-deleted");
};

const emit = defineEmits([
  "close",
  "user-added",
  "user-updated",
  "user-deleted",
]);

onMounted(() => {
  if (props.user) {
    console.log(props.user);
    email.value = props.user.email;
    password.value = props.user.password;
    role.value = props.user.app_metadata.role;
    orgs.value = props.user.app_metadata.org;
  }
});
</script>
