<template>
  <h3><span class="fa fa-box" /> Mahsulotlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="responsive text-center">
    <table class="table table-sm table-hover table-borderless">
      <thead>
        <tr>
          <th>№</th>
          <th>Mahsulot</th>
          <th>Qoldiq</th>
          <th>Narx</th>
          <th>Sotuv narx</th>
          <th>Minimal narx</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, n) in filterRow" :key="product">
          <td>{{ n + 1 }}</td>
          <td>{{ product.name }} {{ product.brand }}</td>
          <td>{{ product.quantity }} {{ product.measure }}</td>
          <td>
            {{ Intl.NumberFormat().format(product.price) }}
            {{ product.currency_id }}
          </td>
          <td>
            {{ Intl.NumberFormat().format(product.selling_price) }}
            {{ product.currency_id_for_sell }}
          </td>
          <td>
            {{ Intl.NumberFormat().format(product.final_price) }}
            {{ product.currency_id_for_final }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <isloading :isloading="isloading" />
</template>

<script>
import isloading from "../../components/Animation/Anime.vue";
import { catchError, productsByCategory } from "@/components/Api/Api";
export default {
  name: "CategoryProducts",
  components: { isloading },
  data() {
    return {
      isloading: true,
      search: "",
      products: [],
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    filterRow: function() {
      return this.products.filter((product) => {
        return product.name.toLowerCase().match(this.search.toLowerCase())
      })
    }
  },
  methods: {
    getData() {
      productsByCategory(this.$route.params.id)
        .then((Response) => {
          this.products = Response.data;
          this.isloading = false;
        })
        .catch((error) => {
          this.isloading = false;
          catchError(error);
        });
    },
  },
};
</script>

<style>
</style>