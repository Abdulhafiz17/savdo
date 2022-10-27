<template>
  <div class="row">
    <div class="col-md-3 mb-1">
      <select class="form-select form-select-sm" v-model="warehouse_id">
        <option value="0">Barcha omborlar</option>
        <option v-for="item in omborlar" :key="item" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_time"
      />
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_time"
      />
    </div>
    <div class="col-md-1 mb-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="get(0, 50)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>

  <div class="responsive">
    <div class="table-responsive">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Kategoriya</th>
            <th>Artikul</th>
            <th>Soni</th>
            <th>Narx</th>
            <th>Ombor</th>
            <th>Sana</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transfers" :key="item">
            <td>{{ item.Warehouse_products.category.name }}</td>
            <td>{{ item.Warehouse_products.articul }}</td>
            <td>{{ item.Transfers.quantity }} dona</td>
            <td>
              {{ Intl.NumberFormat().format(item.Transfers.transfer_price) }}
              {{ item.Currencies.currency }}
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{
                item.Transfers.time
                  .replace("T", " ")
                  .substring(0, item.Transfers.time.length - 3)
              }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="7">
              <div class="input-group input-group-sm">
                <button
                  class="btn btn-sm"
                  @click="get(0, limit)"
                  :disabled="page == 0"
                >
                  <i class="fa fa-angle-double-left" />
                </button>
                <button
                  class="btn btn-sm"
                  @click="get(page - 1, limit)"
                  :disabled="page == 0"
                >
                  <i class="fa fa-angle-left" />
                </button>
                <button class="btn btn-sm">
                  {{ page + 1 }}
                </button>
                <button
                  class="btn btn-sm"
                  @click="get(page + 1, limit)"
                  :disabled="page == pages - 1 || pages == 0"
                >
                  <i class="fa fa-angle-right" />
                </button>
                <button
                  class="btn btn-sm"
                  @click="get(pages - 1, limit)"
                  :disabled="page == pages - 1 || pages == 0"
                >
                  <i class="fa fa-angle-double-right" />
                </button>
                <div class="input-group-append">
                  <select
                    class="form-select form-select-sm"
                    v-model="limit"
                    @change="get(page, limit)"
                  >
                    <option disabled value="">limit</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { catchError, transfers } from "@/components/Api/Api";
export default {
  name: "Taminotlar",
  props: ["omborlar"],
  emits: ["setloading"],
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 50,
      warehouse_id: 0,
      from_time: "",
      to_time: "",
      transfers: [],
    };
  },
  created() {
    this.$emit("setloading", true);
    this.get(this.page, this.limit);
  },
  mounted() {
    document.querySelector("#pills-profile-tab").onclick = () => {
      this.get(0, 50);
    };
  },
  methods: {
    get(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "tasdiqlandi",
        page,
        limit,
        this.$route.params.id,
        this.from_time,
        this.to_time
      )
        .then((Response) => {
          this.transfers = Response.data.data;
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.$emit("setloading", false);
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
.input-group {
  justify-content: center;
}
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}
</style>