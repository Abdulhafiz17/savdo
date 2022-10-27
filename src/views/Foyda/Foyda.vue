<template>
  <h3><span class="fa fa-file-invoice-dollar" /> Foydani hisoblash</h3>
  <div class="row">
    <div class="col-md-9 my-1" v-if="distribute">
      <div class="row">
        <div class="col-md-4 my-1">
          <button
            class="btn btn-sm btn-block btn-outline-primary"
            data-toggle="modal"
            data-target="#orders"
          >
            {{
              Intl.NumberFormat().format(distribute.trade_total_price) +
              " " +
              branch_currency
            }}
          </button>
        </div>
        <div class="col-md-4 my-1">
          <button
            class="btn btn-sm btn-block btn-outline-warning"
            data-toggle="modal"
            data-target="#expenses"
          >
            {{
              Intl.NumberFormat().format(distribute.expense_price) +
              " " +
              branch_currency
            }}
          </button>
        </div>
        <div
          class="
            col-md-4
            my-1
            text-success
            d-flex
            align-items-center
            justify-content-center
          "
        >
          <span
            :class="
              distribute.total_profit > 0
                ? 'text-success'
                : distribute.total_profit < 0
                ? 'text-danger'
                : 'text-warning'
            "
          >
            {{
              Intl.NumberFormat().format(distribute.total_profit) +
              " " +
              branch_currency
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="col-md-3 my-1">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-success"
          @click="distributing()"
          :disabled="distribute.total_profit > 0 ? false : true"
          v-if="distribute"
        >
          <i class="far fa-circle-check" /> Foydani bo'lish
        </button>
        <button
          class="btn btn-outline-secondary"
          data-toggle="modal"
          data-target="#history"
          @click="getDistribute(0, 100)"
        >
          <i class="fa fa-history" />
        </button>
      </div>
    </div>
  </div>
  <hr />

  <div class="body">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in users" :key="item">
        <div class="card">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item">
                <i class="fa fa-user" />
                <span>{{ item.name }}</span>
              </li>
              <a class="list-group-item" :href="`tel:+998${item.phone}`">
                <i class="fa fa-phone" />
                <span>{{ "+998" + item.phone }}</span>
              </a>
              <li class="list-group-item">
                <i class="fa fa-percent" />
                <span>{{ item.profit_percentage + " %" }}</span>
              </li>
              <li class="list-group-item">
                <i class="fa fa-coins" />
                <span>
                  <span
                    :class="item.balance > 0 ? 'text-success' : 'text-danger'"
                  >
                    {{
                      Intl.NumberFormat().format(item.balance) +
                      " " +
                      (branch_currency ? branch_currency : "")
                    }}
                  </span>
                  <span v-if="distribute" class="text-success">
                    {{
                      distribute.total_profit > 0
                        ? " ( " +
                          Intl.NumberFormat().format(
                            (distribute.total_profit / 100) *
                              item.profit_percentage
                          ) +
                          " " +
                          (branch_currency ? branch_currency : "") +
                          " )"
                        : ""
                    }}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="orders">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Umumiy savdo</h4>
        </div>
        <div class="modal-body" v-if="distribute">
          <details v-for="item in distribute.orders" :key="item" :id="item.id">
            <summary @click="getLoan(item)">
              <h5>Buyurtma - {{ item.ordinal_number }}</h5>
              <strong>
                Sana:
                {{ item.time.substring(0, item.time.length - 9) }}
              </strong>
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
                  Intl.NumberFormat().format(order.discount) +
                  " " +
                  balance.currency
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
                              return (
                                i.Trades.code == item.Returned_products.code
                              );
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
                      <div class="input-group input-group-sm">
                        <button
                          class="btn btn-sm"
                          @click="getTrades(item.id, 0, limit)"
                          :disabled="page == 0"
                        >
                          <i class="fa fa-angle-double-left" />
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="getTrades(item.id, page - 1, limit)"
                          :disabled="page == 0"
                        >
                          <i class="fa fa-angle-left" />
                        </button>
                        <button class="btn btn-sm">
                          {{ page + 1 }}
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="getTrades(item.id, page + 1, limit)"
                          :disabled="page == pages - 1 || pages == 0"
                        >
                          <i class="fa fa-angle-right" />
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="getTrades(item.id, pages - 1, limit)"
                          :disabled="page == pages - 1 || pages == 0"
                        >
                          <i class="fa fa-angle-double-right" />
                        </button>
                        <div class="input-group-append">
                          <select
                            class="form-select form-select-sm"
                            v-model="limit"
                            @change="getTrades(item.id, page, limit)"
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
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="expenses">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Umumiy chiqim</h4>
        </div>
        <div class="modal-body" v-if="distribute">
          <div class="table-responsive my-1">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Chiqim turi</th>
                  <th>Izoh</th>
                  <th>Summa</th>
                  <th>Hodim</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in distribute.expenses" :key="item">
                  <td>
                    {{
                      item.type == "fixed_expense"
                        ? item.f_expense.name
                        : item.type == "returned_product"
                        ? "Qaytarib olingan mahsulot"
                        : "Umumiy"
                    }}
                  </td>
                  <td>{{ item.comment }}</td>
                  <td>
                    {{
                      Intl.NumberFormat().format(item.price) +
                      " " +
                      item.currency.currency
                    }}
                  </td>
                  <td>{{ item.user.name }}</td>
                  <td>{{ item.time.substring(0, item.time.length - 9) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="history">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Taqsimlanish tarixi</h4>
        </div>
        <div class="modal-body">
          <details v-for="(item, index) in history" :key="item" :id="index">
            <summary
              @click="
                getDistribute2(
                  item.Distributed_profit.time.substring(0, 10),
                  index
                )
              "
            >
              <h5>Hodim: {{ item.Users.name }}</h5>
              <strong>
                Sana: {{ item.Distributed_profit.time.substring(0, 10) }}
              </strong>
            </summary>
            <div class="table-responsive my-1">
              <table class="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Hodim</th>
                    <th>Ulush</th>
                    <th>Summa</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in history_2" :key="item">
                    <td>{{ item.Users.name }}</td>
                    <td>{{ item.Distributed_profit.percent + " %" }}</td>
                    <td>
                      {{
                        Intl.NumberFormat().format(
                          item.Distributed_profit.price
                        ) +
                        " " +
                        item.Currencies.currency
                      }}
                    </td>
                    <td>
                      {{ item.Distributed_profit.time.substring(0, 10) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
          <div class="input-group input-group-sm my-1">
            <button
              class="btn btn-sm"
              @click="getDistribute(0, limit)"
              :disabled="page == 0"
            >
              <i class="fa fa-angle-double-left" />
            </button>
            <button
              class="btn btn-sm"
              @click="getDistribute(page - 1, limit)"
              :disabled="page == 0"
            >
              <i class="fa fa-angle-left" />
            </button>
            <button class="btn btn-sm">
              {{ page + 1 }}
            </button>
            <button
              class="btn btn-sm"
              @click="getDistribute(page + 1, limit)"
              :disabled="page == pages - 1 || pages == 0"
            >
              <i class="fa fa-angle-right" />
            </button>
            <button
              class="btn btn-sm"
              @click="getDistribute(pages - 1, limit)"
              :disabled="page == pages - 1 || pages == 0"
            >
              <i class="fa fa-angle-double-right" />
            </button>
            <div class="input-group-append">
              <select
                class="form-select form-select-sm"
                v-model="limit"
                @change="getDistribute(page, limit)"
              >
                <option disabled value="">limit</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  branch,
  catchError,
  currencies,
  distribute,
  distributeHistory,
  incomes,
  loan,
  postDistribute,
  returnedProducts,
  success,
  tradeBalance,
  trades,
  users,
} from "@/components/Api/Api";
import swal from "sweetalert";
export default {
  name: "Benefit",
  emits: ["setloading"],
  data() {
    return {
      branch_id: localStorage.getItem("branch_id"),
      branch_currency: null,
      users: [],
      currencies: [],
      distribute: null,
      order: null,
      loan: null,
      income: [],
      balance: null,
      trades: [],
      returned_products: [],
      page: 0,
      pages: 1,
      limit: 100,
      page_2: 0,
      pages_2: 1,
      limit_2: 100,
      history: [],
      history_2: [],
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      this.$emit("setloading", true);
      distribute()
        .then((Response) => {
          this.distribute = Response.data;
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
          this.currencies = Response.data;
          this.getBranch();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBranch() {
      branch(this.branch_id)
        .then((Response) => {
          this.branch_currency = this.currencies.find((item) => {
            return item.id == Response.data.branch.trade_currency;
          }).currency;
          this.getUsers();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getUsers() {
      this.$emit("setloading", true);
      users(this.branch_id, 0, 100)
        .then((Response) => {
          this.users = Response.data.data;
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
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
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
    distributing() {
      swal({
        icon: "warning",
        title: "Foyda taqsimlanishiga rozimisiz ?",
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
          confirm: true,
          cancel: true,
        },
      }).then((value) => {
        if (value) {
          this.$emit("setloading", true);
          postDistribute()
            .then((Response) => {
              success().then(() => {
                this.get();
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      });
    },
    getDistribute(page, limit) {
      this.$emit("setloading", true);
      distributeHistory(0, page, limit)
        .then((Response) => {
          this.history = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getDistribute2(date, index) {
      document.querySelectorAll("details").forEach((details) => {
        if (Number(details.id) !== index) {
          details.removeAttribute("open");
        }
      });
      this.$emit("setloading", true);
      distributeHistory(date, this.page_2, this.limit_2)
        .then((Response) => {
          this.history_2 = Response.data.data;
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

.modal-body {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}

.table-responsive {
  max-height: 50vh;
}
</style>