<template>
  <h4>Mahsulotlar</h4>
  <div class="row my-1">
    <div class="col-md-4 my-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_date"
      />
    </div>
    <div class="col-md-4 my-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_date"
      />
    </div>
    <div class="col-md-4 my-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="getProducts()"
      >
        <span class="far fa-circle-check" /> Qidirish
      </button>
    </div>
  </div>
  <div id="pChart">
    <canvas id="productsChart" width="600" height="250" />
  </div>
</template>

<script>
import { catchError, statisticProducts } from "@/components/Api/Api";
export default {
  name: "Products",
  emits: ["setloading"],
  data() {
    return {
      from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .substring(0, 10),
      to_date: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10),
      products: [],
    };
  },
  created() {
    // this.$emit("setloading", false)
    this.getProducts();
  },
  mounted() {},
  methods: {
    getProducts() {
      statisticProducts(this.from_date, this.to_date, this.$route.params.id)
        .then((Response) => {
          if (Response.data.length) this.prepareChart(Response.data)
          else this.$emit("setloading", false, "products");
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    prepareChart(products) {
      let canvas,
        labels = [],
        quantities = [];
      document.getElementById("productsChart").remove();
      canvas = document.createElement("canvas");
      canvas.id = "productsChart";
      canvas.height = 250;
      canvas.width = 600;
      document.getElementById("pChart").append(canvas);
      for (let i = 0; i < products.length; i++) {
        labels.push(`${products[i].category} - ${products[i].articul}`);
        quantities.push(products[i].sum_quantity)
        if (i == products.length - 1) {
          this.createChart(labels, quantities);
        }
      }
    },
    createChart(labels, quantities) {
      const ctx = document.getElementById("productsChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Mahsulotlar",
              data: quantities,
              backgroundColor: ["rgba(54, 162, 235, 0.2)"],
              borderColor: ["rgba(54, 162, 235, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      this.$emit("setloading", false, "products");
    },
  },
};
</script>

<style>
</style>