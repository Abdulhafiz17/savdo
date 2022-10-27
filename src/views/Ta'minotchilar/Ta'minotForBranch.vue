<template>
  <h3><span class="fa fa-box" /> Ta'minot</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>

  <div class="body">
    <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="pills-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-home"
          type="button"
          role="tab"
          aria-controls="pills-home"
          aria-selected="true"
          @click="
            getTransfers(0, 50);
            tab = 0;
          "
        >
          Faol
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
          @click="tab = 1"
        >
          Qabul qilingan
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        <div class="table-responsive" v-if="transfer_id">
          <h4>
            {{ `${category.name} - ${articul} - ${quantity} dona - ${price}` }}
          </h4>
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>O'lcham</th>
                <th>Miqdor</th>
                <th>Oxirgi narx</th>
                <th>Sotuv narx</th>
                <th>Vetrina narx</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in productsForBranch" :key="item">
                <td>
                  <form
                    @submit.prevent="acceptTransfer(productsForBranch)"
                    id="form"
                  >
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="o'lcham"
                      required
                      v-model="item.size"
                      form="form"
                    />
                  </form>
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    min="1"
                    step="any"
                    placeholder="miqdor: dona"
                    required
                    v-model="item.quantity"
                    form="form"
                  />
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    min="0"
                    :max="item.sotuv_narx ? item.sotuv_narx : false"
                    step="any"
                    placeholder="oxirgi narx"
                    required
                    v-model="item.oxirgi_narx"
                    form="form"
                  />
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    :min="item.oxirgi_narx ? item.oxirgi_narx : 0"
                    :max="item.vitrina_narx ? item.vitrina_narx : false"
                    step="any"
                    placeholder="sotuv narx"
                    required
                    v-model="item.sotuv_narx"
                    form="form"
                  />
                </td>
                <td>
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    :min="item.sotuv_narx ? item.sotuv_narx : 0"
                    placeholder="vetrina narx"
                    required
                    v-model="item.vitrina_narx"
                    form="form"
                  />
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-secondary"
                      @click="
                        productsForBranch.push({
                          size: '',
                          quantity: '',
                          oxirgi_narx: item.oxirgi_narx
                            ? item.oxirgi_narx
                            : null,
                          sotuv_narx: item.sotuv_narx ? item.sotuv_narx : null,
                          vitrina_narx: item.vitrina_narx
                            ? item.vitrina_narx
                            : null,
                        })
                      "
                    >
                      <i class="fa fa-circle-plus" />
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="removeProduct(index)"
                    >
                      <i class="far fa-circle-xmark" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            class="btn btn-sm btn-outline-secondary float-right"
            form="form"
          >
            <i class="far fa-circle-check" /> Tasdiqlash
          </button>
        </div>
        <hr />
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in transfersWaiting" :key="item">
                  <td>{{ item.Warehouse_products.category.name }}</td>
                  <td>{{ item.Warehouse_products.articul }}</td>
                  <td>{{ item.Transfers.quantity }} dona</td>
                  <td
                    v-if="branch_currency"
                    :title="
                      (item.Transfers.transfer_price * item.Currencies.price) /
                        branch_currency.price +
                      ' ' +
                      branch_currency.currency
                    "
                  >
                    {{
                      item.Currencies.id == branch_currency.id
                        ? _.format(
                            item.Transfers.transfer_price
                          ) +
                          " " +
                          item.Currencies.currency
                        : _.format(
                            item.Transfers.transfer_price
                          ) +
                          " " +
                          item.Currencies.currency +
                          " ( " +
                          _.format(
                            (item.Transfers.transfer_price *
                              item.Currencies.price) /
                              branch_currency.price
                          ) +
                          " " +
                          branch_currency.currency +
                          " ) "
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
                  <td>
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      @click="addProduct(item)"
                    >
                      <i class="fa fa-share" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="7">
                    <div class="input-group input-group-sm">
                      <button
                        class="btn btn-sm"
                        @click="getTransfers(0, limit)"
                        :disabled="page == 0"
                      >
                        <i class="fa fa-angle-double-left" />
                      </button>
                      <button
                        class="btn btn-sm"
                        @click="getTransfers(page - 1, limit)"
                        :disabled="page == 0"
                      >
                        <i class="fa fa-angle-left" />
                      </button>
                      <button class="btn btn-sm">
                        {{ page + 1 }}
                      </button>
                      <button
                        class="btn btn-sm"
                        @click="getTransfers(page + 1, limit)"
                        :disabled="page == pages - 1 || pages == 0"
                      >
                        <i class="fa fa-angle-right" />
                      </button>
                      <button
                        class="btn btn-sm"
                        @click="getTransfers(pages - 1, limit)"
                        :disabled="page == pages - 1 || pages == 0"
                      >
                        <i class="fa fa-angle-double-right" />
                      </button>
                      <div class="input-group-append">
                        <select
                          class="form-select form-select-sm"
                          v-model="limit"
                          @change="getTransfers(0, limit)"
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
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <Taminotlar
          @setloading="setloading"
          :omborlar="omborlar"
          v-if="tab == 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  acceptTransfer,
  branch,
  catchError,
  currencies,
  success,
  transfers,
  warehouses,
} from "@/components/Api/Api";
import Taminotlar from "./Ta'minotQabulQilingan.vue";
import swal from "sweetalert";
export default {
  name: "Ta'minot",
  emits: ["setloading"],
  components: { Taminotlar },
  data() {
    return {
      _: Intl.NumberFormat(),
      tab: 0,
      page: 0,
      pages: 1,
      limit: 50,
      from_time: "",
      to_time: "",
      branch: null,
      branch_currency: null,
      transfersWaiting: [],
      omborlar: [],
      currencies: [],
      transfer_id: null,
      category: null,
      articul: null,
      quantity: null,
      price: "",
      product: {
        size: "",
        quantity: "",
        oxirgi_narx: null,
        sotuv_narx: null,
        vitrina_narx: null,
      },
      productsForBranch: [],
    };
  },
  created() {
    this.get(this.page, this.limit);
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    get(page, limit) {
      this.getBranch(page, limit);
    },
    getBranch(page, limit) {
      branch(localStorage.getItem("branch_id"))
        .then((Response) => {
          this.branch = Response.data.branch;
          this.getCurrencies(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies(page, limit) {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.branch_currency = this.currencies.find((item) => {
            return item.id == this.branch.trade_currency;
          });
          this.getWarehouses(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getWarehouses(page, limit) {
      warehouses()
        .then((Response) => {
          this.omborlar = Response.data;
          this.getTransfers(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfers(page, limit) {
      this.$emit("setloading", true);
      transfers(
        0,
        "kutish",
        page,
        limit,
        this.$route.params.id,
        this.from_time,
        this.to_time
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.transfersWaiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    addProduct(product) {
      if (!this.productsForBranch.length) {
        this.transfer_id = product.Transfers.id;
        this.category = product.Warehouse_products.category;
        this.articul = product.Warehouse_products.articul;
        this.quantity = product.Transfers.quantity;
        this.price = `${this._.format(
          // product.Transfers.transfer_price
          (product.Transfers.transfer_price * product.Currencies.price) /
            this.branch_currency.price
        )} ${
          // product.Currencies.currency
          this.branch_currency.currency
        }`;
        this.productsForBranch.push({
          size: "",
          quantity: "",
          oxirgi_narx: null,
          sotuv_narx: null,
          vitrina_narx: null,
        });
      } else {
        swal({
          icon: "warning",
          title:
            "Bir paytda faqat bir turdagi mahsulotlarni qabul qilish mumkin",
        });
      }
    },
    removeProduct(index) {
      if (this.productsForBranch.length == 1) {
        this.productsForBranch.splice(index, 1);
        this.transfer_id = null;
        this.category = null;
        this.articul = null;
      } else {
        this.productsForBranch.splice(index, 1);
      }
    },
    acceptTransfer(products) {
      this.$emit("setloading", true);
      let quantity = null;
      products.forEach((item) => {
        quantity += item.quantity;
      });
      if (quantity == this.quantity) {
        acceptTransfer(this.transfer_id, products)
          .then((Response) => {
            success().then(() => {
              this.productsForBranch = [];
              this.transfer_id = null;
              this.category = null;
              this.articul = null;
              this.get(this.page, this.limit);
            });
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else {
        swal({
          icon: "warning",
          title: "Mahsulotlar miqdori umumiy miqdorga teng bo'lishi kerak",
        }).then(() => {
          this.$emit("setloading", false);
        });
      }
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