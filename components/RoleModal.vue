<template>
  <UModal :model-value="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ isEditing ? "Edit Role" : "Add Role" }}
        </h3>
      </template>
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <span>Name</span>
        <UInput v-model="name" label="Name" type="text" required />
        <div class="flex justify-between mt-4">
          <UButton type="submit" color="green"
            >{{ isEditing ? "Update" : "Add" }} Role</UButton
          >
          <UPopover v-if="isEditing">
            <UButton
              color="red"
              label="Delete"
              trailing-icon="i-heroicons-trash-20-solid"
            />
            <template #panel>
              <div class="p-4">
                <p>Are you sure you want to delete this role?</p>
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
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/store/auth";
import { useRolesStore } from "~/store/role";

const props = defineProps({
  roles: Object,
});
const rolesStore = useRolesStore();

console.log(props);

const name = ref("");
const currentUser = computed(() => authStore.user);
const currentRole = computed(() => currentUser.value.app_metadata.role);

const isEditing = computed(() => !!props.roles);

const submitForm = async () => {
  if (isEditing.value) {
    await rolesStore.updateRoles(props.roles.id, {
      role: name.value,
    });
    emit("roles-updated");
  } else {
    await rolesStore.addRoles({
      role: name.value,
    });
    emit("roles-added");
  }
};

const confirmDelete = async () => {
  await rolesStore.deleteRoles(props.roles.id);
  emit("roles-deleted");
};

const emit = defineEmits([
  "close",
  "roles-added",
  "roles-updated",
  "roles-deleted",
]);

onMounted(() => {
  if (props.roles) {
    name.value = props.roles.role;
  }
});
</script>
