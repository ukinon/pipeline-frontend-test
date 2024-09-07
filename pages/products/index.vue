<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  middleware: ["auth", "rolecheck"],
});

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

const fetchProducts = async (skip, limitParam) => {
  const { data } = await useFetch(
    `https://dummyjson.com/products?skip=${skip}&limit=${limitParam}`
  );
  products.value = data.value.products;
  totalPages.value = Math.ceil(data.value.total / limitParam);
};

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

watch([currentPage, limit], ([newPage, newLimit]) => {
  const skip = (newPage - 1) * newLimit;
  fetchProducts(skip, newLimit);
  console.log(`Updating URL with page = ${newPage}, limit = ${newLimit}`);
  updateURL(newPage, newLimit);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

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
