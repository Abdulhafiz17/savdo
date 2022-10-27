<template>
  <h3>
    <span class="fa fa-chart-line" />
    {{ role == "admin" ? (branch ? branch.name + " hisobotlari" : "") : "Hisobotlar" }}
  </h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-12 my-1">
        <Sales
          :branch_currency="branch_currency"
          @setloading="setloading"
          v-if="sales"
        />
      </div>
      <hr />
      <div class="col-md-12 my-1">
        <Products @setloading="setloading" v-if="products" />
      </div>
      <hr />
      <div class="col-md-12 my-1">
        <Users @setloading="setloading" v-if="users" />
      </div>
      <!-- <div class="col-md-12 my-1">
        <Expenses @setloading="setloading" />
      </div>
      <hr /> -->
    </div>
  </div>
</template>

<script>
import Sales from "./Sales.vue";
import Expenses from "./Expenses.vue";
import Products from "./Products.vue";
import Users from "./Hodimlar.vue";
import { branch, catchError, currencies } from "@/components/Api/Api";
export default {
  name: "Statistic",
  emits: ["setloading"],
  components: { Sales, Expenses, Products, Users },
  data() {
    return {
      role: localStorage.getItem("role"),
      branch: null,
      branch_currency: null,
      sales: false,
      products: false,
      users: false,
    };
  },
  created() {
    this.getBranch();
  },
  methods: {
    setloading(loading, component) {
      if (component == "sales") {
        this.products
          ? this.$emit("setloading", loading)
          : (this.products = true);
      } else if (component == "products") {
        this.users ? this.$emit("setloading", loading) : (this.users = true);
      } else if (component == undefined) {
        this.$emit("setloading", loading);
      }
    },
    getBranch() {
      branch(this.$route.params.id)
        .then((Response) => {
          this.branch = Response.data.branch;
          this.getCurrencies();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.branch_currency = Response.data.find((currency) => {
            return currency.id == this.branch.trade_currency;
          }).currency;
          this.sales = true;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>

<style scoped>
.responsive {
  max-height: 85vh;
}
</style>