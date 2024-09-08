<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Define meta information for the page
definePageMeta({
  middleware: ["auth", "rolecheck"],
});

// Columns configuration for the product table
const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
];

const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.query.page, 10) || 1);
const limit = ref(parseInt(route.query.limit, 10) || 10);
const totalPages = ref(0);
const products = ref([]);

/**
 * Fetch products from the API with skip and limit parameters.
 * @param {Number} skip - The number of items to skip.
 * @param {Number} limitParam - The limit of items to fetch.
 */
const fetchProducts = async (skip, limitParam) => {
  const { data } = await useFetch(
    `https://dummyjson.com/products?skip=${skip}&limit=${limitParam}`
  );
  products.value = data.value.products;
  totalPages.value = Math.ceil(data.value.total / limitParam);
};

/**
 * Update the router URL with the given page and limit parameters.
 * @param {Number} pageParam - The current page.
 * @param {Number} limitParam - The limit of items per page.
 */
const updateURL = (pageParam, limitParam) => {
  router
    .push({
      name: route.name,
      query: {
        ...route.query,
        page: pageParam,
        limit: limitParam,
      },
    })
    .catch((err) => {
      console.error("Router push error:", err);
    });
};

// Watch for changes in current page and limit to fetch products and update URL
watch([currentPage, limit], ([newPage, newLimit]) => {
  const skip = (newPage - 1) * newLimit;
  fetchProducts(skip, newLimit);
  console.log(`Updating URL with page = ${newPage}, limit = ${newLimit}`);
  updateURL(newPage, newLimit);
});

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
 * On component mount, initialize the URL parameters and fetch products.
 */
onMounted(() => {
  const pageFromURL = parseInt(route.query.page, 10);
  const limitFromURL = parseInt(route.query.limit, 10);
  if (pageFromURL !== currentPage.value || limitFromURL !== limit.value) {
    console.log("Initializing URL");
    updateURL(currentPage.value, limit.value);
  }
  const initialSkip = (currentPage.value - 1) * limit.value;
  fetchProducts(initialSkip, limit.value);
});
</script>

<template>
  <div class="mx-auto w-[80vw] flex flex-col gap-5 py-5">
    <h1 class="text-3xl font-bold text-black">Products</h1>
    <UTable
      :columns="columns"
      :rows="products"
      class="bg-gray-800 rounded-xl"
    />
    <div class="flex justify-between items-center mt-4 text-black">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  </div>
</template>
