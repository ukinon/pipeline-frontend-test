<script setup>
import { ref, onMounted, watch } from "vue";
import { useFetch } from "#app";
import Chart from "chart.js/auto";

// Define page metadata
definePageMeta({
  middleware: ["auth"],
});

// References to chart canvases
const stockChart = ref(null);
const volumeChart = ref(null);
const combinedChart = ref(null);

// Storage for stock data
const stocksData = ref({});

// Fetch stock data from API
const { data, pending } = useFetch("https://www.alphavantage.co/query", {
  params: {
    function: "TIME_SERIES_DAILY",
    symbol: "IBM",
    apikey: "demo",
  },
});

// Create stock price chart
const createStockChart = (dates, prices) => {
  new Chart(stockChart.value, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Stock Price",
          data: prices,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

// Create trading volume chart
const createVolumeChart = (dates, volumes) => {
  new Chart(volumeChart.value, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Trading Volume",
          data: volumes,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Calculate Simple Moving Average (SMA)
const calculateSMA = (data, window_size) => {
  const r_avgs = [];
  for (let i = 0; i <= data.length - window_size; i++) {
    let curr_avg = 0.0;
    const t = i + window_size;
    for (let k = i; k < t && k <= data.length; k++) {
      curr_avg += data[k] / window_size;
    }
    r_avgs.push(curr_avg);
  }
  return r_avgs;
};

// Create combined chart with stock prices and SMA
const createCombinedChart = (dates, prices) => {
  const sma = calculateSMA(prices, 7);
  new Chart(combinedChart.value, {
    type: "line",
    data: {
      labels: dates.slice(6),
      datasets: [
        {
          label: "Stock Price",
          data: prices.slice(6),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.1,
        },
        {
          label: "7-Day SMA",
          data: sma,
          borderColor: "rgb(255, 159, 64)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

// Handle mounting and data fetching
onMounted(() => {
  watch(
    () => pending.value,
    (newPending) => {
      if (!newPending && data.value && data.value["Time Series (Daily)"]) {
        const timeSeriesData = data.value["Time Series (Daily)"];
        const metaData = data.value["Meta Data"];

        stocksData.value.stockName = metaData["2. Symbol"];

        const dates = Object.keys(timeSeriesData).slice(0, 30).reverse();
        const closePrices = dates.map((date) =>
          parseFloat(timeSeriesData[date]["4. close"])
        );
        const volumes = dates.map((date) =>
          parseInt(timeSeriesData[date]["5. volume"])
        );

        createStockChart(dates, closePrices);
        createVolumeChart(dates, volumes);
        createCombinedChart(dates, closePrices);
      }
    },
    { immediate: true }
  );
});
</script>

<template>
  <div class="container mx-auto p-3 px-0 max-w-[80vw]">
    <h1 class="text-3xl text-black font-bold mb-8">IBM Stocks📈</h1>
    <div v-if="pending?.value" class="text-center text-xl font-medium">
      Loading...
    </div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Stock Price Chart</h2>
          <canvas ref="stockChart"></canvas>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Trading Volume Chart</h2>
          <canvas ref="volumeChart"></canvas>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">7-Day Simple Moving Average</h2>
        <canvas ref="combinedChart"></canvas>
      </div>
    </div>
  </div>
</template>
