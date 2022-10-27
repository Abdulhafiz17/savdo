<template>
  <h4>Savdo</h4>
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
    <div class="col-md-3 my-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="getDays()"
      >
        <span class="far fa-circle-check" /> Qidirish
      </button>
    </div>
    <div class="col-md-1 my-1">
      <div class="btn-group btn-group-sm">
        <button
          :class="`btn btn${
            template == 'chart' ? '-' : '-outline-'
          }success template`"
          @click="template = 'chart'"
          @click.passive="prepareChart(days)"
        >
          <i class="fa fa-chart-line" />
        </button>
        <button
          :class="`btn btn${
            template == 'card' ? '-' : '-outline-'
          }primary template`"
          @click="template = 'card'"
        >
          <i class="fa fa-th-large" />
        </button>
      </div>
    </div>
  </div>
  <div id="sChart" v-if="template == 'chart'">
    <canvas id="salesChart" width="600" height="250" />
  </div>

  <div
    v-if="template == 'card'"
    class="responsive p-1"
    style="max-height: 70vh"
  >
    <div class="row">
      <div class="col-md-3 col-sm-6 my-1" v-for="item in days" :key="item">
        <div
          class="card shadow day"
          data-toggle="modal"
          data-target="#day"
          @click="day = item"
        >
          <div class="card-body">
            <strong>{{ item.day }}</strong>
            <hr />
            <span>
              Umumiy savdo:
              <strong>
                {{ _.format(item.trade_total_price) + " " + branch_currency }}
              </strong>
            </span>
            <span>
              Vozvrat:
              <strong>
                {{ _.format(item.returned_price) + " " + branch_currency }}
              </strong>
            </span>
            <hr />
            <span>
              Savdo:
              <strong>
                {{ _.format(item.savdo_umumiy) + " " + branch_currency }}
              </strong>
            </span>
            <span
              :title="
                'Buyurtma chegirmasi: ' +
                _.format(item.order_total_discount) +
                ' ' +
                branch_currency +
                ' Mahsulot chegirmasi: ' +
                _.format(item.trade_total_discount) +
                ' ' +
                branch_currency
              "
            >
              Chegirma:
              <strong>
                {{
                  _.format(
                    item.order_total_discount + item.trade_total_discount
                  ) +
                  " " +
                  branch_currency
                }}
              </strong>
            </span>
            <span>
              Chiqim:
              <strong>
                {{ _.format(item.expense_price) + " " + branch_currency }}
              </strong>
            </span>
            <hr />

            <span>
              Kassadagi pul:
              <strong>
                {{
                  _.format(
                    item.savdo_umumiy -
                      (item.order_total_discount +
                        item.trade_total_discount +
                        item.expense_price)
                  ) +
                  " " +
                  branch_currency
                }}
              </strong>
            </span>
            <span>
              Daromad:
              <strong
                :class="
                  item.total_profit > 0
                    ? 'text-success'
                    : item.total_profit < 0
                    ? 'text-danger'
                    : ''
                "
              >
                {{ _.format(item.total_profit) + " " + branch_currency }}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="day">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" v-if="day">
          <h4>{{ day.day }}</h4>
        </div>
        <div class="modal-body">
          <div class="responsive" style="min-height: 60vh" v-if="day">
            <ul
              class="nav nav-pills nav-justified m-2"
              id="pills-tab"
              role="tablist"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link btn-sm active"
                  :id="`pills-savdo-tab`"
                  data-bs-toggle="pill"
                  :data-bs-target="`#pills-savdo`"
                  type="button"
                  role="tab"
                  :aria-controls="`pills-savdo`"
                  aria-selected="true"
                >
                  Savdolar
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link btn-sm"
                  :id="`pills-category-tab`"
                  data-bs-toggle="pill"
                  :data-bs-target="`#pills-category`"
                  type="button"
                  role="tab"
                  :aria-controls="`pills-category`"
                  aria-selected="true"
                >
                  Kategoriyalar
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link btn-sm"
                  :id="`pills-chiqim-tab`"
                  data-bs-toggle="pill"
                  :data-bs-target="`#pills-chiqim`"
                  type="button"
                  role="tab"
                  :aria-controls="`pills-chiqim`"
                  aria-selected="false"
                >
                  Chiqimlar
                </button>
              </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                :id="`pills-savdo`"
                role="tabpanel"
                :aria-labelledby="`pills-savdo-tab`"
              >
                <ul class="list-group" v-if="day.orders.length">
                  <li
                    class="list-group-item"
                    v-for="item in day.orders"
                    :key="item"
                    @click="
                      order = item;
                      getLoan(item);
                    "
                    data-toggle="modal"
                    data-target="#order"
                  >
                    <h6>Buyurtma id - {{ item.id }}</h6>
                    <h6>
                      Mijoz:
                      {{ item.customer ? item.customer.name : "Umumiy" }}
                    </h6>
                  </li>
                </ul>
                <strong v-if="!day.orders.length">
                  Ma'lumot mavjud emas
                </strong>
              </div>
              <div
                class="tab-pane fade"
                :id="`pills-category`"
                role="tabpanel"
                :aria-labelledby="`pills-category-tab`"
              >
                <ul class="list-group" v-if="day.trade_cat_data.length">
                  <li
                    class="list-group-item"
                    v-for="item in day.trade_cat_data"
                    :key="item"
                  >
                    <h6>{{ item.cat }}</h6>
                    <h6>
                      {{ _.format(item.trade_price) + " " + branch_currency }}
                    </h6>
                  </li>
                </ul>
                <strong v-if="!day.trade_cat_data.length">
                  Ma'lumot mavjud emas
                </strong>
              </div>
              <div
                class="tab-pane fade"
                :id="`pills-chiqim`"
                role="tabpanel"
                :aria-labelledby="`pills-chiqim-tab`"
              >
                <div class="table-responsive" v-if="day.expenses.length">
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
                      <tr v-for="expense in day.expenses" :key="expense">
                        <td>
                          {{
                            expense.type == "fixed_expense"
                              ? expense.f_expense.name
                              : expense.type == "returned_product"
                              ? "Qaytarib olingan mahsulot"
                              : "Umumiy"
                          }}
                        </td>
                        <td>{{ expense.comment }}</td>
                        <td>
                          {{
                            _.format(expense.price) +
                            " " +
                            expense.currency.currency
                          }}
                        </td>
                        <td>{{ expense.user.name }}</td>
                        <td>
                          {{
                            expense.time.substring(0, expense.time.length - 9)
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <strong v-if="!day.expenses.length">
                  Ma'lumot mavjud emas
                </strong>
              </div>
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

  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Buyurtma</h5>
        </div>
        <div class="modal-body">
          <div
            class="responsive"
            style="min-height: 70vh; zoom: 90%"
            v-if="order"
          >
            <div class="row my-1" v-if="order && order.income && order.balance">
              <div class="col-md-3">
                Buyurtma summasi
                <br />
                {{
                  Intl.NumberFormat().format(order.balance.total_price) +
                  " " +
                  order.balance.currency
                }}
              </div>
              <div class="col-md-3">
                Chegirma summa
                <br />
                {{
                  order.discount
                    ? Intl.NumberFormat().format(order.discount) +
                      " " +
                      order.balance.currency
                    : 0 + " " + order.balance.currency
                }}
              </div>
              <div class="col-md-3">
                To'lov summa
                <br />
                <span v-for="(i, index) in order.income" :key="i">
                  {{
                    i.Incomes.comment +
                    ": " +
                    Intl.NumberFormat().format(i.Incomes.money) +
                    " " +
                    i.currency +
                    (index !== order.income.length - 1 ? ", " : "")
                  }}
                  <br />
                </span>
              </div>
              <div class="col-md-3">
                Nasiya summa
                <br />
                {{
                  Intl.NumberFormat().format(
                    order.balance.total_price -
                      (order.income[0].Incomes.money +
                        (order.income[1] ? order.income[1].Incomes.money : 0)) -
                      order.discount >
                      0
                      ? order.balance.total_price -
                          (order.income[0].Incomes.money +
                            (order.income[1]
                              ? order.income[1].Incomes.money
                              : 0)) -
                          order.discount
                      : 0
                  ) +
                  " " +
                  order.balance.currency
                }}
              </div>
            </div>
            <div class="table-responsive my-1" v-if="order.trades">
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
                  <tr v-for="i in order.trades" :key="i">
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
                        (order.returned_products.find((item) => {
                          return i.Trades.code == item.Returned_products.code;
                        })
                          ? order.returned_products.find((item) => {
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
                      <div
                        class="
                          input-group input-group-sm
                          justify-content-center
                        "
                      >
                        <button
                          class="btn btn-sm"
                          @click="getTrades(order, 0, limit_2)"
                          :disabled="page_2 == 0"
                        >
                          <i class="fa fa-angle-double-left" />
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="getTrades(order, page_2 - 1, limit_2)"
                          :disabled="page_2 == 0"
                        >
                          <i class="fa fa-angle-left" />
                        </button>
                        <button class="btn btn-sm">
                          {{ page_2 + 1 }}
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="getTrades(order, page_2 + 1, limit_2)"
                          :disabled="page_2 == pages_2 - 1 || pages_2 == 0"
                        >
                          <i class="fa fa-angle-right" />
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="getTrades(order, pages_2 - 1, limit_2)"
                          :disabled="page_2 == pages_2 - 1 || pages_2 == 0"
                        >
                          <i class="fa fa-angle-double-right" />
                        </button>
                        <div class="input-group-append">
                          <select
                            class="form-select form-select-sm"
                            v-model="limit_2"
                            @change="getTrades(order, page_2, limit_2)"
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
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            @click="createBarcode(order.id)"
          >
            <i class="fa fa-print"></i>
          </button>
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="orderCheck d-none">
    <div id="check">
      <ul class="list-group" v-if="order && order.balance">
        <li class="list-group-item">
          <span></span>
          <span>
            {{ order.time.substring(0, 16).replace("T", " ") }}
          </span>
        </li>
        <hr />
        <span class="p-1">Mahsulotlar</span>
        <li class="list-group-item" v-for="item in order.trades" :key="item">
          <span>
            {{
              item.Products.articul +
              "-" +
              item.Products.size +
              " x " +
              item.Trades.quantity
            }}
          </span>
          <span>
            {{
              Intl.NumberFormat().format(item.Trades.price) +
              " " +
              order.income[0].currency +
              (item.Trades.discount
                ? " ( -" +
                  Intl.NumberFormat().format(item.Trades.discount) +
                  " " +
                  order.income[0].currency +
                  " )"
                : "")
            }}
          </span>
        </li>
        <hr />
        <li class="list-group-item">
          <span>Buyurtma summasi: </span>
          <span>
            {{
              Intl.NumberFormat().format(order.balance.total_price) +
              " " +
              order.balance.currency
            }}
          </span>
        </li>
        <li class="list-group-item">
          <span>Buyurtma chegirmasi: </span>
          <span>
            {{
              Intl.NumberFormat().format(order.discount) +
              " " +
              order.balance.currency
            }}
          </span>
        </li>
        <hr />
        <li class="list-group-item">
          {{ "To'lov summasi :" }}
          <span
            v-for="item in order.income.filter(
              (income) => income.Incomes.money > 0
            )"
            :key="item"
          >
            {{ item.Incomes.comment + ":" }}
            {{
              Intl.NumberFormat().format(item.Incomes.money) +
              " " +
              item.currency
            }}
          </span>
        </li>
        <li class="list-group-item" v-if="order.Loans">
          <span>Nasiya</span>
          <span>
            {{
              Intl.NumberFormat().format(order.Loans.Loans.money) +
              " " +
              order.Loans.loan_currency +
              " " +
              order.Loans.Loans.return_date
            }}
          </span>
        </li>
      </ul>
      <div class="d-flex justify-content-center">
        <img id="order_barcode" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  incomes,
  loan,
  returnedProducts,
  statisticOrders,
  tradeBalance,
  trades,
} from "@/components/Api/Api";
import JsBarcode from "jsbarcode";
export default {
  name: "Sales",
  props: ["branch_currency"],
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      page: 0,
      pages: 1,
      limit: 50,
      page_2: 0,
      pages_2: 1,
      limit_2: 50,
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
      days: [],
      day: null,
      order: null,
      template: "chart",
    };
  },
  created() {
    this.getDays();
  },
  mounted() {},
  // watch: {
  //   days(days) {
  //     let labels = [], savdo = [], chiqim = [], daromad = [];
  //     for (let i = 0; i < days.length; i++) {
  //       labels.push(days[i].day);
  //       savdo.push(days[i].trade_total_price)
  //       chiqim.push(days[i].expense_price)
  //       daromad.push(days[i].total_profit)
  //       if (i == days.length - 1) {
  //         this.createChart(labels, savdo, chiqim, daromad);
  //       }
  //     }
  //   },
  // },
  methods: {
    getDays() {
      this.template = "chart";
      this.$emit("setloading", true);
      statisticOrders(this.from_date, this.to_date, this.$route.params.id)
        .then((Response) => {
          this.days = Response.data.splice(1, Response.data.length);
          if (this.days.length) {
            this.prepareChart(this.days);
          } else this.$emit("setloading", false, "sales");
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoan(order) {
      this.$emit("setloading", true);
      this.order.loan = null;
      this.order.income = [];
      this.order.balance = null;
      this.order.trades = [];
      this.order.returned_products = [];
      if (order.customer) {
        loan(order.customer.id)
          .then((Response) => {
            order.loan = Response.data;
            this.getIncome(order);
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else {
        this.getIncome(order);
      }
    },
    getIncome(order) {
      incomes(order.id, "order", 0, 100)
        .then((Response) => {
          this.order.income = Response.data.data;
          this.getBalance(order);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBalance(order) {
      tradeBalance(order.id)
        .then((Response) => {
          this.order.balance = Response.data;
          this.getTrades(order, 0, 100);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(order, page, limit) {
      this.$emit("setloading", true);
      trades(order.id, page, limit)
        .then((Response) => {
          this.page_2 = Response.data.current_page;
          this.pages_2 = Response.data.pages;
          this.order.trades = Response.data.data;
          this.getReturnedProducts(order, page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getReturnedProducts(order, page, limit) {
      this.$emit("setloading", true);
      returnedProducts(order.id, page, limit)
        .then((Response) => {
          this.order.returned_products = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    prepareChart(days) {
      let canvas,
        labels = [],
        savdo = [],
        chegirma = [],
        returned = [],
        chiqim = [],
        daromad = [];
      document.getElementById("salesChart").remove();
      canvas = document.createElement("canvas");
      canvas.id = "salesChart";
      canvas.height = 250;
      canvas.width = 600;
      document.getElementById("sChart").append(canvas);
      for (let i = 0; i < days.length; i++) {
        labels.push(days[i].day);
        savdo.push(days[i].trade_total_price);
        chegirma.push(
          days[i].order_total_discount + days[i].trade_total_discount
        );
        returned.push(days[i].returned_price);
        chiqim.push(days[i].expense_price);
        daromad.push(days[i].total_profit);
        if (i == days.length - 1) {
          this.createChart(labels, savdo, chegirma, returned, chiqim, daromad);
        }
      }
    },
    createChart(labels, savdo, chegirma, returned, chiqim, daromad) {
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Savdo",
              data: savdo,
              backgroundColor: ["rgba(54, 162, 235, 0.2)"],
              borderColor: ["rgba(54, 162, 235, 1)"],
              borderWidth: 1,
            },
            {
              label: "Chegirma",
              data: chegirma,
              backgroundColor: ["rgb(127, 255, 212, .2)"],
              borderColor: ["rgb(127, 255, 212)"],
              borderWidth: 1,
            },
            {
              label: "Vozvrat",
              data: returned,
              backgroundColor: ["rgba(255, 255, 0, .1)"],
              borderColor: ["rgb(255, 165, 0)"],
              borderWidth: 1,
            },
            {
              label: "Chiqim",
              data: chiqim,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
            {
              label: "Daromad / Zarar",
              data: daromad,
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
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
      this.$emit("setloading", false, "sales");
    },
    createBarcode(id) {
      setTimeout(() => {
        JsBarcode("#order_barcode", id, {
          // format: "CODE128",
          width: 2,
          height: 30,
        });
        this.printCheck();
      }, 100);
    },
    printCheck() {
      let check = document.querySelector("#check").outerHTML;
      const winPrint = window.open("", "", "");
      winPrint.document.querySelector("head").innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <style>
        * {
          font-size: 12px !important;
        }
        .list-group-item {
          display: flex !important;
          justify-content: space-between !important;
          border: none !important;
        }
      </style>
      `;
      winPrint.document.querySelector("body").innerHTML = check;
      winPrint.print();
    },
  },
};
</script>

<style scoped>
.responsive {
  max-height: 60vh;
}

.template {
  box-shadow: none;
}

.card {
  height: 100%;
}

.day {
  cursor: pointer;
}

.day span {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
