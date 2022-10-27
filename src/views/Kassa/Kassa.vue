<template>
  <div class="row">
    <div class="col-md-2" v-if="order">
      {{ `${order.ordinal_number} - buyurtma` }}
    </div>
    <div class="col-md-10">
      <button class="btn btn-sm m-1 btn-outline-success" @click="addOrder()">
        <i class="fa fa-circle-plus" />
      </button>
      <div
        class="btn-group btn-group-sm m-1"
        v-for="item in orders"
        :key="item"
      >
        <button
          :class="
            order == item ? 'btn btn-primary' : 'btn btn-outline-secondary'
          "
          @click="
            order = item;
            getTrades(order);
          "
        >
          {{ "№ " + item.ordinal_number }}
        </button>
        <button class="btn btn-danger" @click="deleteOrder(item.id)">
          <i class="far fa-circle-xmark" />
        </button>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <form @submit.prevent="addTrade(trade)" v-if="order">
        <div class="intpu-group input-group-sm">
          <input
            id="barcode"
            class="form-control text-center"
            type="search"
            placeholder="code"
            list="products"
            v-model="barcode"
            @keyup="getProduct(barcode)"
          />
          <datalist id="products">
            <option
              v-for="item in products"
              :key="item"
              :value="item.Products.code"
            >
              {{ item.Products.articul + " " + item.Products.size }}
            </option>
          </datalist>
        </div>
      </form>
    </div>
    <div class="col-md-4">
      <span v-if="order_balance.total_price">
        Buyurtma balansi:
        <strong>
          {{
            Intl.NumberFormat().format(order_balance.total_price) +
            " " +
            order_balance.currency
          }}
        </strong>
      </span>
    </div>
  </div>

  <div class="responsive my-1">
    <table class="table table-sm text-center table-hover table-borderless">
      <thead>
        <tr>
          <th>№</th>
          <th>Mahsulot</th>
          <th>Hajm</th>
          <th>Narxi</th>
          <th>Chegirma</th>
          <th>To'lov</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, n) in trades" :key="item">
          <td>{{ n + 1 }}</td>
          <td>
            {{
              item.Categories.name +
              " - " +
              item.Products.articul +
              " - " +
              item.Products.size
            }}
          </td>
          <td>
            <div class="input-group input-group-sm w-50 mx-auto">
              <button
                class="btn btn-outline-secondary"
                @click="putTrade('<', item)"
              >
                <i class="fa fa-minus" />
              </button>
              <input
                class="form-control text-center"
                type="number"
                v-model="item.sum_quantity"
                min="0"
                :max="item.quantity"
                step="any"
              />
              <button
                class="btn btn-outline-secondary"
                @click="putTrade('>', item)"
              >
                <i class="fa fa-plus" />
              </button>
            </div>
          </td>
          <td>
            <form @submit.prevent="putTrade('', item)">
              <div class="input-group input-group-sm w-75 mx-auto">
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  class="form-control text-center"
                  v-model="item.Trades.price"
                  @focusout="putTrade('', item)"
                />
                <div class="input-group-append">
                  <div class="input-group-text">
                    {{ item.Currencies ? item.Currencies.currency : "" }}
                  </div>
                </div>
              </div>
            </form>
          </td>
          <td>
            <form @submit.prevent="putTrade('', item)">
              <div class="input-group input-group-sm w-75 mx-auto">
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  class="form-control text-center"
                  v-model="item.Trades.discount"
                  @focusout="putTrade('', item)"
                />
                <div class="input-group-append">
                  <div class="input-group-text">
                    {{ item.Currencies ? item.Currencies.currency : "" }}
                  </div>
                </div>
              </div>
            </form>
          </td>
          <td>
            <span
              :class="
                item.Trades.price - item.Trades.discount >
                item.Products.sotuv_narx
                  ? 'text-success'
                  : item.Trades.price - item.Trades.discount <=
                      item.Products.sotuv_narx &&
                    item.Trades.price - item.Trades.discount >=
                      item.Products.oxirgi_narx
                  ? 'text-warning'
                  : 'text-danger'
              "
            >
              {{
                Intl.NumberFormat().format(
                  (item.Trades.price - item.Trades.discount) * item.sum_quantity
                ) +
                " " +
                item.Currencies.currency
              }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="putTrade('delete', item)"
            >
              <i class="fa fa-trash" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Bar @setloading="setloading" />

  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="confirmOrder(order_confirm)" v-if="order">
          <div class="modal-body">
            <div class="row my-1">
              <div class="col-md-12">
                <h4>
                  Buyurtma balansi:
                  <strong>
                    {{
                      Intl.NumberFormat().format(order_balance.total_price) +
                      " " +
                      order_balance.currency
                    }}
                  </strong>
                </h4>
              </div>
            </div>
            <h5>Mijoz</h5>
            <div class="row my-1">
              <label class="col-md-4">
                <input
                  class="form-radio"
                  type="radio"
                  value="none"
                  v-model="customer_type"
                />
                Umumiy
              </label>
              <label class="col-md-4">
                <input
                  class="form-radio"
                  type="radio"
                  value="customer"
                  v-model="customer_type"
                />
                Doimiy
              </label>
              <label class="col-md-4">
                <input
                  class="form-radio"
                  type="radio"
                  value="new"
                  v-model="customer_type"
                />
                Yangi
              </label>
            </div>
            <div class="row my-1" v-if="customer_type == 'customer'">
              <div class="col-md-12">
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-block btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {{ customer ? customer.name : "Mijoz tanlang" }}
                  </button>
                  <div
                    class="dropdown-menu w-100"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="qidiruv"
                      v-model="customer_search"
                    />
                    <div class="scroll-menu" @scroll="scrolling(dropdown_menu)">
                      <button
                        type="button"
                        v-for="item in customers"
                        :key="item"
                        class="dropdown-item"
                        @click="(customer = item), (customer_search = '')"
                      >
                        {{ `${item.name} +998${item.phone}` }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-1" v-if="customer_type == 'new'">
              <div class="col-md-6 mb-1">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="ism"
                  required
                  v-model="order_confirm.customer_name"
                />
              </div>
              <div class="col-md-6 mb-1">
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    type="phone"
                    minlength="9"
                    maxlength="9"
                    class="form-control"
                    placeholder="tel"
                    required
                    v-model="order_confirm.customer_phone"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-1">
                <input
                  type="date"
                  class="form-control form-control-sm"
                  required
                  v-model="order_confirm.customer_birthday"
                />
              </div>
              <div class="col-md-6 mb-1">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="order_confirm.customer_type"
                >
                  <option hidden value="">mijoz turi</option>
                  <option value="premium">premium</option>
                  <option value="umumiy">umumiy</option>
                </select>
              </div>
            </div>
            <div class="row my-1" v-if="customer_type">
              <div class="col-md-12">
                To'lov summa
                <div class="row my-1">
                  <div class="col-md-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        :max="
                          order_balance.total_price -
                            order_confirm.money[1].paid_money >
                          0
                            ? order_balance.total_price -
                              order_confirm.money[1].paid_money
                            : false
                        "
                        class="form-control form-control-sm"
                        v-model="order_confirm.money[0].paid_money"
                        @keyup="disabled = true"
                        @focusout="
                          count(
                            'price',
                            order_confirm.money[0].paid_money,
                            order_confirm.money[1].paid_money,
                            order_confirm.discount,
                            loan_price
                          );
                          disabled = false;
                        "
                      />
                      <div class="input-group-append">
                        <div class="input-group-text">naxt</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        :max="
                          order_balance.total_price -
                            order_confirm.money[0].paid_money >
                          0
                            ? order_balance.total_price -
                              order_confirm.money[0].paid_money
                            : false
                        "
                        class="form-control form-control-sm"
                        v-model="order_confirm.money[1].paid_money"
                        @keyup="disabled = true"
                        @focusout="
                          count(
                            'price',
                            order_confirm.money[0].paid_money,
                            order_confirm.money[1].paid_money,
                            order_confirm.discount,
                            loan_price
                          );
                          disabled = false;
                        "
                      />
                      <div class="input-group-append">
                        <div class="input-group-text">plastik</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="customer_type == 'none' ? 'col-md-12' : 'col-md-6'">
                Chegirma summa
                <input
                  chegirma_summa
                  type="number"
                  min="0"
                  step="any"
                  class="form-control form-control-sm"
                  placeholder="chegirma summa"
                  v-model="order_confirm.discount"
                  @keyup="disabled = true"
                  @focusout="
                    count(
                      'chegirma',
                      order_confirm.money[0].paid_money,
                      order_confirm.money[1].paid_money,
                      order_confirm.discount,
                      loan_price
                    );
                    disabled = false;
                  "
                  :disabled="
                    customer_type == 'none' ||
                    order_confirm.money[0].paid_money +
                      order_confirm.money[1].paid_money >=
                      order_balance.total_price
                  "
                />
              </div>
              <div class="col-md-6" v-if="customer_type !== 'none'">
                Nasiya summa
                <input
                  nasiya_summa
                  type="number"
                  class="form-control form-control-sm"
                  placeholder="nasiya summa"
                  v-model="loan_price"
                  disabled
                />
              </div>
              <div class="col-md-12 my-1" v-if="loan_price">
                Nasiya qaytarish sanasi
                <input
                  type="date"
                  class="form-control form-control-sm"
                  required
                  v-model="order_confirm.loan_repayment_date"
                />
              </div>
              <div class="col-md-12 my-1" v-if="role == 'branch_admin'">
                Hodim
                <select
                  class="form-select form-select-sm"
                  @click="users.length ? '' : getUsers()"
                  v-model="order_confirm.seller_id"
                >
                  <option :value="0">kassir</option>
                  <option v-for="item in users" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary" :disabled="disabled">
              <!-- ||
                (!order_confirm.money[0].paid_money &&
                  !order_confirm.money[1].paid_money &&
                  !order_confirm.discount) -->
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-confirmation
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
        <div class="modal-body" v-if="!order">
          <h4>Buyurtma mavjud emas</h4>
        </div>
        <div class="modal-footer" v-if="!order">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="orderCheck" style="display: none">
    <div id="check">
      <ul class="list-group" v-if="order_check">
        <li class="list-group-item">
          <span></span>
          <span>
            {{ order.Orders.time.substring(0, 16).replace("T", " ") }}
          </span>
        </li>
        <hr />
        <span class="p-1">Mahsulotlar</span>
        <li class="list-group-item" v-for="item in order.Trades" :key="item">
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
              order.Income[0].currency +
              (item.Trades.discount
                ? " ( -" +
                  Intl.NumberFormat().format(item.Trades.discount) +
                  " " +
                  order.Income[0].currency +
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
              Intl.NumberFormat().format(order.Balance.total_price) +
              " " +
              order.Balance.currency
            }}
          </span>
        </li>
        <li class="list-group-item">
          <span>Buyurtma chegirmasi: </span>
          <span>
            {{
              Intl.NumberFormat().format(order.Orders.discount) +
              " " +
              order.Balance.currency
            }}
          </span>
        </li>
        <hr />
        <li class="list-group-item">
          {{ "To'lov summasi :" }}
          <span
            v-for="item in order.Income.filter((income) => {
              return income.Incomes.money > 0;
            })"
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
import Bar from "./BottomBar.vue";
import {
  customers,
  catchError,
  orders,
  createOrder,
  success,
  removeOrder,
  productsForTrade,
  toTrade,
  trades,
  updateTrade,
  tradeBalance,
  confirmationOrder,
  users,
  order,
  incomes,
  orderLoan,
  user,
} from "@/components/Api/Api";
import swal from "sweetalert";
import JsBarcode from "jsbarcode";
export default {
  name: "Kassa",
  emits: ["setloading"],
  components: { Bar },
  data() {
    return {
      role: localStorage.getItem("role"),
      page: 0,
      pages: 1,
      limit: 50,
      user: null,
      barcode: "",
      products: [],
      order: null,
      order_balance: {
        currency: null,
        currency_id: null,
        total_price: null,
      },
      orders: [],
      trade: {
        code: null,
        quantity: 1,
        price: 0,
        discount: 0,
      },
      trades: [],
      customer_type: "",
      customer: null,
      customer_search: "",
      customers: [],
      dropdown_menu: null,
      order_confirm: {
        customer_name: "",
        customer_phone: null,
        customer_birthday: "",
        customer_type: "",
        discount: null,
        money: [
          {
            paid_money: null,
            type: "naxt",
          },
          {
            paid_money: null,
            type: "plastik",
          },
        ],
        loan_repayment_date: null,
        seller_id: 0,
      },
      loan_price: null,
      users: [],
      order_id: null,
      order_check: false,
      disabled: false,
    };
  },
  created() {
    this.getUser(0, 100);
  },
  mounted() {
    if (this.order) {
      document.querySelector("#barcode").focus();
    }
  },
  watch: {
    customer_type(customer_type) {
      if (customer_type == "customer") {
        customers(0, this.limit, this.customer_search)
          .then((Response) => {
            this.customers = Response.data.data;
            this.page = Response.data.current_page;
            this.pages = Response.data.pages;
            this.dropdown_menu = document.querySelector(".scroll-menu");
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else if (customer_type == "none") {
        this.order_confirm.customer_name = null;
        this.order_confirm.customer_phone = 0;
        this.order_confirm.customer_birthday = null;
        this.order_confirm.customer_type = null;
      } else if (customer_type == "new") {
        this.customer = null;
        this.order_confirm.customer_name = null;
        this.order_confirm.customer_phone = null;
        this.order_confirm.customer_birthday = null;
        this.order_confirm.customer_type = "";
      }
    },
    customer_search(search) {
      customers(0, this.limit, search)
        .then((Response) => {
          this.customers = Response.data.data;
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    customer(customer) {
      if (customer) {
        this.order_confirm.customer_name = customer.name;
        this.order_confirm.customer_phone = customer.phone;
        this.order_confirm.customer_birthday = customer.birthday;
        this.order_confirm.customer_type = customer.type;
      }
    },
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getUser(page, limit) {
      user()
        .then((Response) => {
          this.user = Response.data;
          this.get(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    get(page, limit) {
      this.$emit("`setloading`", true);
      orders("", "", false, 0, page, limit)
        .then((Response) => {
          this.orders = Response.data.data;
          if (this.orders.length) {
            this.order = this.orders[0];
            this.getTrades(this.order);
          } else {
            this.order = null;
            this.order_balance = {
              currency: null,
              currency_id: null,
              total_price: null,
            };
            this.$emit("setloading", false);
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(order) {
      trades(order.id, 0, 50)
        .then((Response) => {
          this.trades = Response.data.data;
          this.getBalance(this.order.id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBalance(id) {
      tradeBalance(id)
        .then((Response) => {
          this.order_balance = Response.data;
          this.$emit("setloading", false);
          document.querySelector("#barcode").focus();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    addOrder() {
      this.$emit("setloading", true);
      createOrder()
        .then((Response) => {
          success().then(() => {
            this.get(0, 50);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deleteOrder(id) {
      this.$emit("setloading", true);
      removeOrder(id)
        .then((Response) => {
          success().then(() => {
            this.get(0, 50);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    confirmOrder(order) {
      if (order.customer_phone == null) {
        swal({
          icon: "warning",
          title: "Mijoz tanlang !",
          timer: 1500,
        });
      } else {
        this.$emit("setloading", true);
        order.money[0].paid_money = order.money[0].paid_money
          ? order.money[0].paid_money
          : 0;
        order.money[1].paid_money = order.money[1].paid_money
          ? order.money[1].paid_money
          : 0;
        order.discount = order.discount ? order.discount : 0;
        this.role == "seller" ? (order.seller_id = this.user.id) : false;
        confirmationOrder(this.order.id, order)
          .then((Response) => {
            document.querySelector("[close-confirmation]").click();
            this.order_confirm = {
              customer_name: "",
              customer_phone: null,
              customer_birthday: "",
              customer_type: "",
              discount: null,
              money: [
                {
                  paid_money: null,
                  type: "naxt",
                },
                {
                  paid_money: null,
                  type: "plastik",
                },
              ],
              loan_repayment_date: null,
              seller_id: 0,
            };
            this.trades = [];
            success().then(() => {
              this.printOrder();
            });
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      }
    },
    getProduct(code) {
      if (code) {
        productsForTrade(code, 0, 50)
          .then((Response) => {
            this.products = Response.data.data;
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else {
        this.products = [];
      }
    },
    addTrade(trade) {
      if (this.barcode) {
        this.$emit("setloading", true);
        trade.code = this.barcode;
        trade.order_id = this.order.id;
        toTrade(trade)
          .then((Response) => {
            this.barcode = "";
            success().then(() => {
              this.products = [];
              this.getTrades(this.order);
            });
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
            this.barcode = "";
            this.products = [];
            document.querySelector("#barcode").focus();
          });
      }
    },
    putTrade(type, trade) {
      this.$emit("setloading", true);
      let status = Boolean;
      let data = {
        code: trade.Trades.code,
        quantity: null,
        price: trade.Trades.price,
        discount: trade.Trades.discount,
        order_id: this.order.id,
      };
      if (type == "<") {
        swal({
          icon: "warning",
          title: "Miqdorni kiriting",
          content: {
            element: "input",
            attributes: {
              type: "number",
              className: "form-control form-control-sm",
              min: 0,
              placeholder: "miqdor",
            },
          },
        }).then((value) => {
          if (value) {
            if (value <= trade.Trades.quantity) {
              data.quantity = value;
              status = false;
              this.postUpdatedTrade(status, data);
            } else {
              swal({
                icon: "warning",
                title: "Kiritilgan hajmda xatolik",
              }).then(() => {});
            }
          }
          this.$emit("setloading", false);
        });
      } else if (type == ">") {
        swal({
          icon: "warning",
          title: "Miqdorni kiriting",
          content: {
            element: "input",
            attributes: {
              type: "number",
              className: "form-control form-control-sm",
              min: 0,
              placeholder: "miqdor",
            },
          },
        }).then((value) => {
          if (value) {
            data.quantity = value;
            status = true;
            this.postUpdatedTrade(status, data);
          } else {
            swal({
              icon: "warning",
              title: "Kiritilgan hajmda xatolik",
            }).then(() => {});
          }
          this.$emit("setloading", false);
        });
      } else if (type == "delete") {
        data.discount = 0;
        data.quantity = trade.sum_quantity;
        status = false;
        this.postUpdatedTrade(status, data);
      } else {
        data.quantity = 0;
        status = true;
        this.postUpdatedTrade(status, data);
      }
    },
    postUpdatedTrade(status, data) {
      this.$emit("setloading", true);
      updateTrade(status, data)
        .then((Response) => {
          success().then(() => {
            this.getTrades(this.order);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getUsers() {
      users(localStorage.getItem("branch_id"), 0, 50)
        .then((Response) => {
          this.users = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrolling(menu) {
      if (menu.scrollTop + menu.clientHeight >= menu.scrollHeight) {
        if (this.page < this.pages - 1) {
          customers(this.page + 1, this.limit, this.customer_search)
            .then((Response) => {
              this.customers = this.customers.concat(Response.data.data);
              this.page = Response.data.current_page;
              this.pages = Response.data.pages;
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      }
    },
    count(type, naxt, plastik, chegirma, nasiya) {
      if (type == "price") {
        if (naxt + plastik >= this.order_balance.total_price) {
          this.order_confirm.discount = 0;
          this.loan_price = 0;
        } else if (naxt + plastik < this.order_balance.total_price) {
          if (naxt + plastik + nasiya <= this.order_balance.total_price) {
            this.order_confirm.discount =
              this.order_balance.total_price - (naxt + plastik) - nasiya;
          } else if (
            naxt + plastik + chegirma <=
            this.order_balance.total_price
          ) {
            this.loan_price =
              this.order_balance.total_price - (naxt + plastik) - chegirma;
          } else {
            this.loan_price = 0;
            this.order_confirm.discount =
              this.order_balance.total_price - (naxt + plastik) - nasiya;
          }
        }
      } else if (type == "chegirma") {
        if (naxt + plastik >= this.order_balance.total_price) {
          this.order_confirm.discount = 0;
          this.loan_price = 0;
        } else if (naxt + plastik < this.order_balance.total_price) {
          if (chegirma < this.order_balance.total_price - (naxt + plastik)) {
            this.loan_price =
              this.order_balance.total_price - (naxt + plastik) - chegirma;
          } else if (
            chegirma ==
            this.order_balance.total_price - (naxt + plastik)
          ) {
            this.loan_price = 0;
          }
        }
      }
    },
    printOrder() {
      this.order_check = false;
      swal({
        icon: "info",
        title: "Buyurtma cheki chiqarilsinmi ?",
        buttons: {
          confirm: {
            visible: true,
            text: "Ok",
            value: true,
          },
          cancel: {
            visible: true,
            text: "Bekor qilish",
            value: false,
          },
        },
      }).then((value) => {
        if (value) {
          this.order_id = this.order.id;
          this.createBarcode(this.order_id);
        } else {
          this.get(0, 100);
        }
      });
    },
    createBarcode(id) {
      setTimeout(() => {
        JsBarcode("#order_barcode", id, {
          // format: "CODE128",
          width: 2,
          height: 30,
        });
      }, 100);
      this.getOrder(id);
    },
    getOrder(id) {
      order(id)
        .then((Response) => {
          this.order = Response.data;
          this.getIncome(id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getIncome(id) {
      incomes(id, "order", 0, 100)
        .then((Response) => {
          this.order.Income = Response.data.data;
          this.getBalance2(id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBalance2(id) {
      tradeBalance(id)
        .then((Response) => {
          this.order.Balance = Response.data;
          this.getTrades2(id, 0, 100);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades2(id, page, limit) {
      trades(id, page, limit)
        .then((Response) => {
          this.order.Trades = Response.data.data;
          this.getLoan(id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoan(id) {
      orderLoan(id, 0)
        .then((Response) => {
          this.order.Loans = Response.data;
          this.order_check = true;
          setTimeout(() => {
            this.printCheck();
          }, 1000);
          setTimeout(() => {
            this.order_check = false;
            this.get(0, 100);
          }, 1500);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
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
  max-height: 65vh;
}

.col-md-2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.col-md-10 {
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
}

::-webkit-scrollbar {
  height: 10px;
}

.btn-group > button {
  box-shadow: none;
}

.scroll-menu {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 200px;
}

img {
  width: 65%;
}

label {
  cursor: pointer;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
