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
import { storeToRefs } from "pinia";

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

/**
 * Check if the user's role is lower or equal to the current user's role.
 * @param {String} userRole - The role of the user.
 * @param {String} currentRole - The role of the current user.
 * @return {Boolean} - Returns true if userRole is lower or equal to currentRole.
 */
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

// Watch for changes in current page and limit to fetch users and update URL
watch([currentPage, limit], async () => {
  await fetchUsers();
  updateURL(currentPage.value, limit.value);
});

/**
 * Fetch users from the store and update the users and totalPages state.
 */
const fetchUsers = async () => {
  const { users: fetchedUsers, totalPages: total } =
    await usersStore.fetchUsers(currentPage.value, limit.value);
  users.value = fetchedUsers;
  totalPages.value = total;
};

/**
 * Update the router URL with the given page and limit parameters.
 * @param {Number} pageParam - The current page.
 * @param {Number} limitParam - The limit of items per page.
 */
const updateURL = (pageParam, limitParam) => {
  router.push({
    name: route.name,
    query: { ...route.query, page: pageParam, limit: limitParam },
  });
};

/**
 * Change the current page to the given page if it is within valid range.
 * @param {Number} page - The page to change to.
 */
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

/**
 * Open the user modal with the
 * provided user data.
 * @param {Object|null} user - The user to open in the modal. Defaults to null for a new user.
 */
const openUserModal = (user = null) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

/**
 * Handle the event when a new user is added.
 * Closes the user modal and fetches the updated user list.
 */
const handleUserAdded = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

/**
 * Handle the event when a user is updated.
 * Closes the user modal and fetches the updated user list.
 */
const handleUserUpdated = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

/**
 * Handle the event when a user is deleted.
 * Closes the user modal and fetches the updated user list.
 */
const handleUserDeleted = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

/**
 * On component mount, update the URL with current pagination parameters and fetch users.
 */
onMounted(async () => {
  updateURL(currentPage.value, limit.value);
  await fetchUsers();
});
</script>
