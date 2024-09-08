<template>
  <UModal :model-value="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ isEditing ? "Edit Organization" : "Add Organization" }}
        </h3>
      </template>
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <span>Name</span>
        <UInput v-model="name" label="Name" type="text" required />
        <div class="flex justify-between mt-4">
          <UButton type="submit" color="green"
            >{{ isEditing ? "Update" : "Add" }} Orgs</UButton
          >
          <UPopover v-if="isEditing">
            <UButton
              color="red"
              label="Delete"
              trailing-icon="i-heroicons-trash-20-solid"
            />
            <template #panel>
              <div class="p-4">
                <p>Are you sure you want to delete this org?</p>
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
import { useOrgsStore } from "~/store/orgs";

const props = defineProps({
  orgs: Object,
});
const orgsStore = useOrgsStore();

console.log(props);

const name = ref("");

const isEditing = computed(() => !!props.orgs);

const submitForm = async () => {
  if (isEditing.value) {
    await orgsStore.updateOrgs(props.orgs.id, {
      name: name.value,
    });
    emit("orgs-updated");
  } else {
    await orgsStore.addOrgs({
      name: name.value,
    });
    emit("orgs-added");
  }
};

const confirmDelete = async () => {
  await orgsStore.deleteOrgs(props.orgs.id);
  emit("orgs-deleted");
};

const emit = defineEmits([
  "close",
  "orgs-added",
  "orgs-updated",
  "orgs-deleted",
]);

onMounted(() => {
  if (props.orgs) {
    name.value = props.orgs.name;
  }
});
</script>
