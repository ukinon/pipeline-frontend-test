<template>
  <div class="mx-auto w-[80vw] flex flex-col gap-5 py-5">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-black">Roles</h1>
      <UButton
        @click="openOrgModal()"
        v-if="currentUser?.app_metadata?.role === 'super'"
        >Add Roles</UButton
      >
    </div>
    <UTable :columns="columns" :rows="roles" class="bg-gray-800 rounded-xl">
      <template
        #actions-data="{ row }"
        v-if="currentUser?.app_metadata?.role === 'super'"
      >
        <UButton
          @click="openOrgModal(row)"
          icon="i-heroicons-pencil-square"
          color="yellow"
          variant="ghost"
        />
      </template>
    </UTable>
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change-page="changePage"
    />
    <RoleModal
      v-if="showOrgModal"
      :roles="selectedOrg"
      @close="showOrgModal = false"
      @roles-added="handleOrgAdded"
      @roles-updated="handleOrgUpdated"
      @roles-deleted="handleOrgDeleted"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRolesStore } from "~/store/role";
import { useAuthStore } from "~/store/auth";
import Pagination from "~/components/Pagination.vue";

definePageMeta({
  middleware: ["auth", "rolecheck"],
});

const authStore = useAuthStore();
const rolesStore = useRolesStore();
const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.query.page, 10) || 1);
const limit = ref(parseInt(route.query.limit, 10) || 10);
const totalPages = ref(0);
const roles = ref([]);
const showOrgModal = ref(false);
const selectedOrg = ref(null);
const { user: currentUser } = storeToRefs(authStore);

const columns = [
  { key: "id", label: "ID" },
  { key: "role", label: "Role" },
  { key: "actions", label: "Actions" },
];

watch([currentPage, limit], async ([newPage, newLimit]) => {
  await fetchRoles();
  updateURL(newPage, newLimit);
});

const fetchRoles = async () => {
  const { roles: fetchedRoles, totalPages: total } =
    await rolesStore.fetchRoles(currentPage.value, limit.value);
  roles.value = fetchedRoles;
  totalPages.value = total;
};

const updateURL = (pageParam, limitParam) => {
  router.push({
    name: route.name,
    query: { ...route.query, page: pageParam, limit: limitParam },
  });
};

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const openOrgModal = (org = null) => {
  selectedOrg.value = org;
  showOrgModal.value = true;
};

const handleOrgAdded = async () => {
  showOrgModal.value = false;
  await fetchRoles();
};

const handleOrgUpdated = async () => {
  showOrgModal.value = false;
  await fetchRoles();
};

const handleOrgDeleted = async () => {
  showOrgModal.value = false;
  await fetchRoles();
};

onMounted(async () => {
  updateURL(currentPage.value, limit.value);
  await fetchRoles();
});
</script>
