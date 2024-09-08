<template>
  <div class="mx-auto w-[80vw] flex flex-col gap-5 py-5">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-black">Users</h1>
      <UButton
        @click="openUserModal()"
        v-if="
          currentUser?.app_metadata?.role === 'admin' ||
          currentUser?.app_metadata?.role === 'super'
        "
      >
        Add User
      </UButton>
    </div>
    <UTable :columns="columns" :rows="users" class="bg-gray-800 rounded-xl">
      <template
        #actions-data="{ row }"
        v-if="
          currentUser?.app_metadata &&
          (currentUser.app_metadata?.role === 'admin' ||
            currentUser.app_metadata?.role === 'super')
        "
      >
        <UButton
          v-if="
            isRoleLower(row.app_metadata.role, currentUser.app_metadata.role)
          "
          @click="openUserModal(row)"
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
    <UserModal
      v-if="showUserModal"
      :user="selectedUser"
      @close="showUserModal = false"
      @user-added="handleUserAdded"
      @user-updated="handleUserUpdated"
      @user-deleted="handleUserDeleted"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "~/store/users";
import { useAuthStore } from "~/store/auth";
import Pagination from "~/components/Pagination.vue";
import UserModal from "~/components/UserModal.vue";
import { storeToRefs } from "pinia"; // assuming you're using Pinia

definePageMeta({
  middleware: ["auth", "rolecheck"],
});

const authStore = useAuthStore();
const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.query.page, 10) || 1);
const limit = ref(parseInt(route.query.limit, 10) || 10);
const totalPages = ref(0);
const users = ref([]);
const showUserModal = ref(false);
const selectedUser = ref(null);
const { user: currentUser } = storeToRefs(authStore);

const roleHierarchy = {
  user: 0,
  admin: 1,
  super: 2,
};
const isRoleLower = (userRole, currentRole) => {
  return roleHierarchy[userRole] <= roleHierarchy[currentRole];
};

const columns = [
  { key: "id", label: "ID" },
  { key: "email", label: "Email" },
  { key: "app_metadata.role", label: "Role" },
  { key: "created_at", label: "Created At" },
  { key: "actions", label: "Actions" },
];

watch([currentPage, limit], async () => {
  await fetchUsers();
  updateURL(currentPage.value, limit.value);
});

const fetchUsers = async () => {
  const { users: fetchedUsers, totalPages: total } =
    await usersStore.fetchUsers(currentPage.value, limit.value);
  users.value = fetchedUsers;
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

const openUserModal = (user = null) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const handleUserAdded = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

const handleUserUpdated = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

const handleUserDeleted = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

onMounted(async () => {
  updateURL(currentPage.value, limit.value);
  await fetchUsers();
});
</script>
