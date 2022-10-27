<template>
  <h3>
    <span class="fa fa-handshake" />
    {{ customer ? "Mijoz " + customer.name : "Mijoz" }}
  </h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <div class="body">
    <details v-for="item in orders" :key="item" :id="item.id">
      <summary @click="getLoan(item)">
        <h5>Buyurtma - {{ item.ordinal_number }}</h5>
        <!-- <h5>Mijoz: {{ item.customer ? item.customer.name : "Umumiy" }}</h5> -->
        <strong>{{ item.time.substring(0, item.time.length - 9) }}</strong>
      </summary>
      <div class="row my-1" v-if="order && income.length && balance">
        <div class="col-md-3">
          Buyurtma summasi
          <br />
          {{
            Intl.NumberFormat().format(balance.total_price) +
            " " +
            balance.currency
          }}
        </div>
        <div class="col-md-3">
          Chegirma summa
          <br />
          {{
            Intl.NumberFormat().format(order.discount) + " " + balance.currency
          }}
        </div>
        <div class="col-md-3">
          To'lov summa
          <br />
          <span v-for="(i, index) in income" :key="i">
            {{
              i.Incomes.comment +
              ": " +
              Intl.NumberFormat().format(i.Incomes.money) +
              " " +
              i.currency +
              (index !== income.length - 1 ? ", " : "")
            }}
            <br />
          </span>
        </div>
        <div class="col-md-3">
          Nasiya summa
          <br />
          {{
            Intl.NumberFormat().format(
              balance.total_price -
                (income[0].Incomes.money +
                  (income[1] ? income[1].Incomes.money : 0)) -
                order.discount >
                0
                ? balance.total_price -
                    (income[0].Incomes.money +
                      (income[1] ? income[1].Incomes.money : 0)) -
                    order.discount
                : 0
            ) +
            " " +
            balance.currency
          }}
        </div>
      </div>
      <div class="table-responsive my-1" v-if="trades.length">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Mahsulot</th>
              <th>Narx</th>
              <th>Chegirma</th>
              <th>Miqdor</th>
              <th>Qaytarilgan</th>
              <th>Summa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in trades" :key="i">
              <td>
                {{
                  i.Categories.name +
                  " - " +
                  i.Products.articul +
                  " - " +
                  i.Products.size
                }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(i.Trades.price) +
                  " " +
                  i.Currencies.currency
                }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(i.Trades.discount) +
                  " " +
                  i.Currencies.currency
                }}
              </td>
              <td>
                {{ i.sum_quantity + " dona" }}
              </td>
              <td>
                {{
                  (returned_products.find((item) => {
                    return i.Trades.code == item.Returned_products.code;
                  })
                    ? returned_products.find((item) => {
                        return i.Trades.code == item.Returned_products.code;
                      }).sum_quantity
                    : "0") + " dona"
                }}
              </td>
              <td>
                {{
                  Intl.NumberFormat().format(
                    (i.Trades.price - i.Trades.discount) * i.sum_quantity
                  ) +
                  " " +
                  i.Currencies.currency
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6">
                <div class="input-group input-group-sm justify-content-center">
                  <button
                    class="btn btn-sm"
                    @click="getTrades(item.id, 0, limit_2)"
                    :disabled="page_2 == 0"
                  >
                    <i class="fa fa-angle-double-left" />
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTrades(item.id, page_2 - 1, limit_2)"
                    :disabled="page_2 == 0"
                  >
                    <i class="fa fa-angle-left" />
                  </button>
                  <button class="btn btn-sm">
                    {{ page_2 + 1 }}
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTrades(item.id, page_2 + 1, limit_2)"
                    :disabled="page_2 == pages_2 - 1 || pages_2 == 0"
                  >
                    <i class="fa fa-angle-right" />
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="getTrades(item.id, pages_2 - 1, limit_2)"
                    :disabled="page_2 == pages_2 - 1 || pages_2 == 0"
                  >
                    <i class="fa fa-angle-double-right" />
                  </button>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      v-model="limit_2"
                      @change="getTrades(item.id, page_2, limit_2)"
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
    </details>
    <div class="input-group input-group-sm my-1 justify-content-center">
      <button
        class="btn btn-sm"
        @click="getOrders(0, limit)"
        :disabled="page == 0"
      >
        <i class="fa fa-angle-double-left" />
      </button>
      <button
        class="btn btn-sm"
        @click="getOrders(page - 1, limit)"
        :disabled="page == 0"
      >
        <i class="fa fa-angle-left" />
      </button>
      <button class="btn btn-sm">
        {{ page + 1 }}
      </button>
      <button
        class="btn btn-sm"
        @click="getOrders(page + 1, limit)"
        :disabled="page == pages - 1 || pages == 0"
      >
        <i class="fa fa-angle-right" />
      </button>
      <button
        class="btn btn-sm"
        @click="getOrders(pages - 1, limit)"
        :disabled="page == pages - 1 || pages == 0"
      >
        <i class="fa fa-angle-double-right" />
      </button>
      <div class="input-group-append">
        <select
          class="form-select form-select-sm"
          v-model="limit"
          @change="getOrders(page, limit)"
        >
          <option disabled value="">limit</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  customer,
  customerOrders,
  incomes,
  loan,
  returnedProducts,
  tradeBalance,
  trades,
} from "@/components/Api/Api";
export default {
  name: "Mijoz",
  emits: ["setloading"],
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 50,
      page_2: 0,
      pages_2: 1,
      limit_2: 50,
      from_date: "",
      to_date: "",
      customer: null,
      orders: [],
      order: null,
      loan: null,
      income: [],
      balance: null,
      trades: [],
      returned_products: [],
    };
  },
  created() {
    this.getCustomer(0, 50);
  },
  methods: {
    getCustomer(page, limit) {
      customer(this.$route.params.id)
        .then((Response) => {
          this.customer = Response.data;
          this.getOrders(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrders(page, limit) {
      this.$emit("setloading", true);
      customerOrders(
        this.$route.params.id,
        this.from_date,
        this.to_date,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.orders = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoan(order) {
      this.$emit("setloading", true);
      this.loan = null;
      this.income = [];
      this.balance = null;
      this.trades = [];
      this.returned_products = [];
      document.querySelectorAll("details").forEach((details) => {
        if (Number(details.id) !== order.id) {
          details.removeAttribute("open");
        }
      });
      this.order = order;
      if (order.customer) {
        loan(order.customer.id)
          .then((Response) => {
            this.loan = Response.data;
            this.getIncome(order.id);
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else {
        this.getIncome(order.id);
      }
    },
    getIncome(id) {
      incomes(id, "order", 0, 100)
        .then((Response) => {
          this.income = Response.data.data;
          this.getBalance(id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBalance(id) {
      tradeBalance(id)
        .then((Response) => {
          this.balance = Response.data;
          this.getTrades(id, 0, 100);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(id, page, limit) {
      this.$emit("setloading", true);
      trades(id, page, limit)
        .then((Response) => {
          this.page_2 = Response.data.current_page;
          this.pages_2 = Response.data.pages;
          this.trades = Response.data.data;
          this.getReturnedProducts(id, page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getReturnedProducts(id, page, limit) {
      this.$emit("setloading", true);
      returnedProducts(id, page, limit)
        .then((Response) => {
          this.returned_products = Response.data.data;
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

<style>
</style>