<template>
  <div class="mx-auto w-[80vw] flex flex-col gap-5 py-5">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-black">Organizations</h1>
      <UButton
        @click="openOrgModal()"
        v-if="currentUser?.app_metadata?.role === 'super'"
        >Add Orgs</UButton
      >
    </div>
    <UTable :columns="columns" :rows="orgs" class="bg-gray-800 rounded-xl">
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
    <OrgsModal
      v-if="showOrgModal"
      :orgs="selectedOrg"
      @close="showOrgModal = false"
      @orgs-added="handleOrgAdded"
      @orgs-updated="handleOrgUpdated"
      @orgs-deleted="handleOrgDeleted"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrgsStore } from "~/store/orgs";
import { useAuthStore } from "~/store/auth";
import Pagination from "~/components/Pagination.vue";

definePageMeta({
  middleware: ["auth", "rolecheck"],
});

const orgsStore = useOrgsStore();
const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.query.page, 10) || 1);
const limit = ref(parseInt(route.query.limit, 10) || 10);
const totalPages = ref(0);
const orgs = ref([]);
const showOrgModal = ref(false);
const selectedOrg = ref(null);
const { user: currentUser } = storeToRefs(useAuthStore());

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Organization" },
  { key: "actions", label: "Actions" },
];

watch([currentPage, limit], async ([newPage, newLimit]) => {
  await fetchOrgs();
  updateURL(newPage, newLimit);
});

const fetchOrgs = async () => {
  const { orgs: fetchedOrgs, totalPages: total } = await orgsStore.fetchOrgs(
    currentPage.value,
    limit.value
  );
  orgs.value = fetchedOrgs;
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
  await fetchOrgs();
};

const handleOrgUpdated = async () => {
  showOrgModal.value = false;
  await fetchOrgs();
};

const handleOrgDeleted = async () => {
  showOrgModal.value = false;
  await fetchOrgs();
};

onMounted(async () => {
  updateURL(currentPage.value, limit.value);
  await fetchOrgs();
});
</script>
