<template>
  <h3><span class="fa fa-box" /> Ta'minot</h3>
  <div class="row" v-if="supplyType">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="btn-group">
        <button
          class="btn btn-sm btn-outline-secondary"
          data-toggle="modal"
          data-target="#addTaminotchi"
        >
          <i class="fa fa-circle-plus" /> Ta'minotchi qo'shish
        </button>
        <button
          class="btn btn-sm btn-outline-success"
          data-toggle="modal"
          data-target="#confirm"
          @click="
            getBranches(0, 100);
            getWarehouses();
          "
        >
          <i class="far fa-circle-check" /> Yakunlash
        </button>
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>
  <!-- <div class="row">
    <div class="col-md-6">
      <b>Mahsulot: </b>
      <span v-for="item in totalPrice" :key="item">
        {{ item.total_price }} {{ item.Supplies.currency.currency }}
        <i class="fa fa-coin" />
      </span>
    </div>
    <div class="col-md-6">
      <b>Chiqim: </b>
      <span v-for="item in totalExpense" :key="item">
        {{ item.total_expence_price }} {{ item.Expenses.currency.currency }}
        <i class="fa fa-coin" />
      </span>
    </div>
  </div> -->
  <hr />

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
      >
        Mahsulotlar
        <span v-for="(item, index) in totalPrice" :key="item">
          {{
            (index !== 0 ? ", " : "") +
            Intl.NumberFormat().format(item.total_price)
          }}
          {{ item.Supplies.currency.currency }}
        </span>
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
      >
        Chiqimlar
        <span v-for="(item, index) in totalExpense" :key="item">
          {{
            (index !== 0 ? ", " : "") +
            Intl.NumberFormat().format(item.total_expence_price)
          }}
          {{ item.Expenses.currency.currency }}
        </span>
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
      <div class="row" v-if="supplyType">
        <div class="col-md-12">
          <form @submit.prevent="post(supply)">
            <div class="row m-1">
              <div class="col-md-2 my-1">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="supply.market_id"
                  @click="markets.length ? '' : getMarkets(0, 100)"
                >
                  <option hidden value="">Ta'minotchi</option>
                  <option v-for="item in markets" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2 my-1">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="supply.category_id"
                  @click="categories.length ? '' : getCategories(0, 100)"
                >
                  <option disabled value="">Kategoriya</option>
                  <option
                    v-for="item in categories"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2 my-1">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="artikul"
                  required
                  v-model="supply.articul"
                />
              </div>
              <div class="col-md-2 my-1">
                <input
                  class="form-control form-control-sm"
                  type="number"
                  min="1"
                  placeholder="miqdor"
                  required
                  v-model="supply.quantity"
                />
              </div>
              <div class="col-md-3 my-1">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control form-control-sm"
                    type="number"
                    min="1"
                    step="any"
                    placeholder="narx"
                    required
                    v-model="supply.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="supply.currency_id"
                      @click="currencies.length ? '' : getCurrencies()"
                    >
                      <option disabled value="">valyuta</option>
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-1 my-1">
                <button class="btn btn-sm btn-block btn-outline-secondary">
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="responsive">
        <div class="row">
          <div
            class="col-md-11 mx-auto my-1"
            v-for="item in supplies"
            :key="item"
          >
            <details>
              <summary>
                <h5>
                  {{ item.market }}
                </h5>
              </summary>
              <div class="table-responsive text-center">
                <table class="table table-sm table-hover table-borderless">
                  <thead>
                    <tr>
                      <th>Kategoriya</th>
                      <th>Artikul</th>
                      <th>Narx</th>
                      <th>Soni</th>
                      <th>Summa</th>
                      <th v-if="supplyType"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in item.supplies" :key="item">
                      <td>{{ item.category.name }}</td>
                      <td>{{ item.articul }}</td>
                      <td>
                        {{ Intl.NumberFormat().format(item.price) }}
                        {{ item.currency.currency }}
                      </td>
                      <td>{{ item.quantity }} dona</td>
                      <td>
                        {{
                          Intl.NumberFormat().format(item.quantity * item.price)
                        }}
                        {{ item.currency.currency }}
                      </td>
                      <td v-if="supplyType">
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="remove(item.id)"
                        >
                          <i class="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
    <div
      class="tab-pane fade"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
    >
      <div class="row" v-if="supplyType">
        <div class="col-md-11 mx-auto">
          <form @submit.prevent="postExpense(expense)">
            <div class="row my-1">
              <div class="col-md-5 my-1">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="1"
                    placeholder="chiqim summasi"
                    required
                    v-model="expense.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="expense.currency_id"
                      @click="currencies.length ? '' : getCurrencies()"
                    >
                      <option disabled value="">valyuta</option>
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6 my-1">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="izoh"
                  required
                  v-model="expense.comment"
                />
              </div>
              <div class="col-md-1 my-1">
                <button class="btn btn-sm btn-block btn-outline-secondary">
                  <i class="far fa-circle-check" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="responsive">
        <div class="row my-1">
          <div class="col-md-11 mx-auto">
            <ul class="list-group">
              <li class="list-group-item" v-for="item in expenses" :key="item">
                <span>
                  <strong>Summa: </strong>
                  {{ Intl.NumberFormat().format(item.price) }}
                  {{ item.currency.currency }}
                  <br />
                  <b>Izoh: </b>{{ item.comment }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addTaminotchi">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ta'minotchi qo'shish</h4>
        </div>
        <form @submit.prevent="postMarket(addTaminotchi)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-10 mx-auto">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="addTaminotchi.name"
                />
              </div>
              <div class="col-10 mx-auto">
                Telefon raqami
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    placeholder="tel"
                    minlength="9"
                    required
                    v-model="addTaminotchi.phone"
                  />
                </div>
              </div>
              <div class="col-10 mx-auto">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="addTaminotchi.address"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close-modal"
              class="btn btn-outline-danger"
              data-dismiss="modal"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ombor tanlang</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <span v-for="(item, index) in totalExpense" :key="item">
                {{ Intl.NumberFormat().format(item.total_expence_price) }}
                {{ item.Expenses.currency.currency }}
                <span v-if="index !== totalExpense.length - 1">, </span>
              </span>
              <label>
                Chiqimlarni yaxlitlash uchun valyuta turini tanlang
                <div class="input-group input-group-sm mt-1">
                  <select
                    class="form-select form-select-sm"
                    v-model="currency_id"
                    @click="currencies.length ? '' : getCurrencies()"
                  >
                    <option value="">valyuta</option>
                    <option
                      v-for="item in currencies"
                      :key="item"
                      :value="item.id"
                    >
                      {{ item.currency }}
                    </option>
                  </select>
                </div>
              </label>
            </div>
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-6 my-1">
                  <button
                    :class="`tab btn btn-block btn${
                      to_branch ? '-outline-' : '-'
                    }secondary`"
                    @click="to_branch = false"
                  >
                    <i class="fa fa-warehouse" /> Omborga yuborish
                  </button>
                </div>
                <div class="col-md-6 my-1">
                  <button
                    :class="`tab btn btn-block btn${
                      to_branch ? '-' : '-outline-'
                    }secondary`"
                    @click="to_branch = true"
                  >
                    <i class="fa fa-code-branch" /> Filialga yuborish
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <ul class="list-group" v-if="!to_branch">
                <li
                  class="list-group-item"
                  v-for="item in warehouses"
                  :key="item"
                  @click="confirmParty(item.id)"
                >
                  {{ item.name }}
                </li>
              </ul>
              <ul class="list-group" v-if="to_branch">
                <li
                  class="list-group-item"
                  v-for="item in branches"
                  :key="item"
                  @click="confirmParty(item.id)"
                >
                  {{ item.name }}
                </li>
              </ul>
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
  catchError,
  categories,
  currencies,
  markets,
  partyExpenses,
  payForPartyExpense,
  removeSupply,
  success,
  supplies,
  takeSupply,
  createMarket,
  confirmationParty,
  partyBalances,
  branches,
  warehouses,
} from "@/components/Api/Api";
import swal from "sweetalert";
export default {
  name: "Ta'minot",
  emits: ["setloading"],
  data() {
    return {
      supplyType: localStorage.getItem("supply"),
      markets: [],
      categories: [],
      currencies: [],
      supplies: [],
      warehouses: [],
      branches: [],
      expenses: [],
      totalPrice: [],
      totalExpense: [],
      supply: {
        category_id: "",
        articul: null,
        quantity: null,
        price: null,
        currency_id: "",
        market_id: "",
        party_id: this.$route.params.id,
      },
      expense: {
        price: null,
        currency_id: "",
        source: null,
        comment: null,
      },
      addTaminotchi: {
        name: null,
        phone: null,
        address: null,
      },
      currency_id: "",
      branch_id: null,
      to_branch: false,
    };
  },
  created() {
    this.get(0, 100);
  },
  methods: {
    get(page, limit) {
      this.getMarkets(page, limit);
    },
    getMarkets(page, limit) {
      markets(page, limit)
        .then((Response) => {
          this.markets = Response.data.data;
          this.getBalances(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBalances(page, limit) {
      partyBalances(this.$route.params.id)
        .then((Response) => {
          this.totalPrice = Response.data.total_price;
          this.totalExpense = Response.data.total_expence_price;
          this.getExpenses(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getExpenses(page, limit) {
      partyExpenses(this.$route.params.id, page, limit)
        .then((Response) => {
          this.expenses = Response.data.data;
          this.getSupplies(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getSupplies(page, limit) {
      this.supplies = [];
      supplies(0, this.$route.params.id, page, limit).then((Response) => {
        if (Response.data.data.length) {
          this.replace(Response.data.data);
        } else {
          this.$emit("setloading", false);
        }
      });
    },
    replace(data) {
      for (let i = 0; i < this.markets.length; i++) {
        if (
          data.find((item) => {
            return item.market_id == this.markets[i].id;
          })
        ) {
          this.supplies.push({
            market: this.markets[i].name,
            supplies: data.filter((item) => {
              return item.market_id == this.markets[i].id;
            }),
          });
          this.supplies.sort((x, y) => {
            let a = x.market,
              b = y.market;
            return a > b ? 1 : a == b ? 0 : -1;
          });
        }
        if (i == this.markets.length - 1) {
          this.$emit("setloading", false);
        }
      }
    },
    getCategories(page, limit) {
      categories(0, page, limit)
        .then((Response) => {
          this.categories = Response.data.data;
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
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBranches(page, limit) {
      branches(page, limit)
        .then((Response) => {
          this.branches = Response.data.branch;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getWarehouses() {
      warehouses()
        .then((Response) => {
          this.warehouses = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      takeSupply(data)
        .then((Response) => {
          success().then(() => {
            this.supply.category_id = "";
            this.supply.articul = null;
            this.supply.quantity = null;
            this.supply.price = null;
            this.supply.currency_id = "";
            this.getBalances(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postExpense(data) {
      this.$emit("setloading", true);
      data.source = Number(this.$route.params.id);
      payForPartyExpense(data)
        .then((Response) => {
          success().then(() => {
            this.expense.price = null;
            this.expense.currency_id = "";
            this.expense.comment = null;
            this.getBalances(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postMarket(data) {
      this.$emit("setloading", true);
      createMarket(data)
        .then((Response) => {
          document.querySelector("#close-modal").click();
          success().then(() => {
            this.addTaminotchi = {
              name: null,
              phone: null,
              address: null,
            };
            this.getMarkets(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    remove(id) {
      swal({
        icon: "warning",
        title: "Ushbu mahsulot o'chirilsinmi ?",
        buttons: {
          confirm: true,
          cancel: true,
        },
        dangerMode: true,
      }).then((value) => {
        if (value) {
          this.$emit("setloading", true);
          removeSupply(id)
            .then((Response) => {
              success().then(() => {
                this.getBalances(0, 100);
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      });
    },
    confirmParty(id) {
      this.$emit("setloading", true);
      if (this.currency_id) {
        confirmationParty(this.$route.params.id, id, this.currency_id, this.to_branch)
          .then((Response) => {
            document.querySelectorAll("[data-dismiss]")[1].click();
            success().then(() => {
              this.$router.push("/taminotlar");
            });
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      } else {
        swal({
          icon: "warning",
          title: "Valyuta tanlanmagan !",
          timer: 2500,
        }).then(() => {
          this.$emit("setloading", false);
        });
      }
    },
  },
};
</script>

<style scoped>
details {
  border: 2px solid gray;
}

.modal .modal-body li {
  cursor: pointer;
}

li span {
  text-align: left;
}

.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}

.tab {
  box-shadow: none;
}
</style>