<template>
  <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="false-tab"
        data-bs-toggle="pill"
        data-bs-target="#false"
        type="button"
        role="tab"
        aria-controls="false"
        aria-selected="true"
        @click="
          warehouse_id = 0;
          getTransfersWaiting(0, 100);
        "
      >
        Kutilayotgan
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="true-tab"
        data-bs-toggle="pill"
        data-bs-target="#true"
        type="button"
        role="tab"
        aria-controls="true"
        aria-selected="false"
        @click="
          warehouse_id = 0;
          getTransfersClosed(0, 100);
        "
      >
        Yakunlangan
      </button>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <div
      class="tab-pane fade show active"
      id="false"
      role="tabpanel"
      aria-labelledby="false-tab"
    >
      <div class="row my-1">
        <div class="col-md-3 mb-1">
          <select class="form-select form-select-sm" v-model="warehouse_id">
            <option value="0">Barcha omborlar</option>
            <option v-for="item in warehouses" :key="item" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_date"
          />
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_date"
          />
        </div>
        <div class="col-md-1 mb-1">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getTransfersWaiting(0, 100)"
          >
            <i class="far fa-circle-check" />
          </button>
        </div>
      </div>
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
            <tr v-for="item in transfers_waiting" :key="item">
              <td>{{ item.Warehouse_products.category.name }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>{{ item.Transfers.quantity + " dona" }}</td>
              <td>
                {{
                  Intl.NumberFormat().format(item.Transfers.transfer_price) +
                  " " +
                  item.Warehouse_products.currency.currency
                }}
              </td>
              <td>
                {{ item.name ? item.name : "" }}
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
              <td colspan="6">
                <div class="input-group input-group-sm">
                  <button
                    class="btn btn-sm"
                    @click="getTransfersWaiting(0, limit)"
                    :disabled="page == 0"
                  >
                    <i class="fa fa-angle-double-left" />
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTransfersWaiting(page - 1, limit)"
                    :disabled="page == 0"
                  >
                    <i class="fa fa-angle-left" />
                  </button>
                  <button class="btn btn-sm">
                    {{ page + 1 }}
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTransfersWaiting(page + 1, limit)"
                    :disabled="page == pages - 1 || pages == 0"
                  >
                    <i class="fa fa-angle-right" />
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTransfersWaiting(pages - 1, limit)"
                    :disabled="page == pages - 1 || pages == 0"
                  >
                    <i class="fa fa-angle-double-right" />
                  </button>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      v-model="limit"
                      @change="getTransfersWaiting(page, limit)"
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
    <div
      class="tab-pane fade"
      id="true"
      role="tabpanel"
      aria-labelledby="true-tab"
    >
      <div class="row my-1">
        <div class="col-md-3 mb-1">
          <select class="form-select form-select-sm" v-model="warehouse_id">
            <option value="0">Barcha omborlar</option>
            <option v-for="item in warehouses" :key="item" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_date_2"
          />
        </div>
        <div class="col-md-4 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_date_2"
          />
        </div>
        <div class="col-md-1 mb-1">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getTransfersClosed(0, 100)"
          >
            <i class="far fa-circle-check" />
          </button>
        </div>
      </div>
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
            <tr v-for="item in transfers_closed" :key="item">
              <td>{{ item.Warehouse_products.category.name }}</td>
              <td>{{ item.Warehouse_products.articul }}</td>
              <td>{{ item.Transfers.quantity + " dona" }}</td>
              <td>
                {{
                  Intl.NumberFormat().format(item.Transfers.transfer_price) +
                  " " +
                  item.Warehouse_products.currency.currency
                }}
              </td>
              <td>
                {{ item.name ? item.name : "" }}
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
              <td colspan="6">
                <div class="input-group input-group-sm">
                  <button
                    class="btn btn-sm"
                    @click="getTransfersClosed(0, limit)"
                    :disabled="page == 0"
                  >
                    <i class="fa fa-angle-double-left" />
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTransfersClosed(page - 1, limit)"
                    :disabled="page == 0"
                  >
                    <i class="fa fa-angle-left" />
                  </button>
                  <button class="btn btn-sm">
                    {{ page + 1 }}
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTransfersClosed(page + 1, limit)"
                    :disabled="page == pages - 1 || pages == 0"
                  >
                    <i class="fa fa-angle-right" />
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTransfersClosed(pages - 1, limit)"
                    :disabled="page == pages - 1 || pages == 0"
                  >
                    <i class="fa fa-angle-double-right" />
                  </button>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      v-model="limit"
                      @change="getTransfersClosed(page, limit)"
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
  </div>
</template>

<script>
import { catchError, transfers, warehouses } from "@/components/Api/Api";
export default {
  name: "Taminot",
  emits: ["setloading"],
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      from_date: "",
      to_date: "",
      from_date_2: "",
      to_date_2: "",
      warehouse_id: 0,
      warehouses: [],
      transfers_waiting: [],
      transfers_closed: [],
    };
  },
  created() {
    this.$emit("setloading", true);
    this.getWarehouses();
  },
  methods: {
    getWarehouses() {
      warehouses()
        .then((Response) => {
          this.warehouses = Response.data;
          this.getTransfersWaiting(0, 100);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersWaiting(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "kutish",
        page,
        limit,
        0,
        this.from_date,
        this.to_date
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.transfers_waiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersClosed(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "tasdiqlandi",
        page,
        limit,
        0,
        this.from_date_2,
        this.to_date_2
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.transfers_closed = Response.data.data;
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
.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 60vh;
}
</style>