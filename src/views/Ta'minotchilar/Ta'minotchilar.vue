<template>
  <h3><span class="fa fa-truck-loading" /> Ta'minotchilar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-append">
          <div class="input-group-text">
            <i class="fa fa-search" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        data-toggle="modal"
        data-target="#addTaminotchi"
      >
        <span class="fa fa-user-plus" /> Ta'minotchi qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-4 my-1" v-for="taminotchi in filter" :key="taminotchi">
        <div class="card shadow">
          <div class="card-body">
            <details>
              <summary>
                <span class="fa fa-user" />
                <strong>{{ taminotchi.name }}</strong>
              </summary>
              <ul class="list-group">
                <a class="list-group-item" :href="'tel:+' + taminotchi.phone">
                  <span class="fa fa-phone" />
                  <span>+{{ taminotchi.phone }}</span>
                </a>
                <li class="list-group-item" v-if="taminotchi.balances.length">
                  <span class="fa fa-coins" />
                  <span
                    v-for="balance in taminotchi.balances"
                    :key="balance"
                    :class="
                      balance.balance < 0 ? 'text-danger' : 'text-success'
                    "
                  >
                    {{ Intl.NumberFormat().format(balance.balance) }}
                    {{ balance.currency.currency }}
                  </span>
                </li>
                <li class="list-group-item">
                  <span class="fa fa-location-dot" />
                  <span>{{ taminotchi.address }}</span>
                </li>
              </ul>
            </details>
            <div class="row my-1 gap-1">
              <div class="col" v-if="taminotchi.balances.length">
                <button
                  class="btn btn-sm btn-block btn-outline-primary"
                  data-toggle="modal"
                  data-target="#pay"
                  @click="
                    (editTaminotchi = taminotchi), (pay.source = taminotchi.id)
                  "
                >
                  <span class="fa fa-coins" />
                </button>
              </div>
              <div class="col" v-if="taminotchi.balances.length">
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  data-toggle="modal"
                  data-target="#take"
                  @click="
                    (editTaminotchi = taminotchi), (take.from_ = taminotchi.id)
                  "
                >
                  <span class="fa fa-hand-holding-usd" />
                </button>
              </div>
              <div class="col">
                <router-link
                  class="btn btn-sm btn-block btn-outline-secondary"
                  :to="`/taminotchi/${taminotchi.id}`"
                >
                  <span class="fa fa-history" />
                </router-link>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#editTaminotchi"
                  @click="editTaminotchi = taminotchi"
                >
                  <span class="fa fa-edit" />
                </button>
              </div>
            </div>
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
        <form @submit.prevent="post(addTaminotchi)">
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

  <div class="modal fade" id="editTaminotchi">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editTaminotchi.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editTaminotchi)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-10 mx-auto">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="editTaminotchi.name"
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
                    v-model="editTaminotchi.phone"
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
                  v-model="editTaminotchi.address"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close_modal"
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="getMarkets(0, 100)"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editTaminotchi.name }} ga to'lov</h4>
        </div>
        <form @submit.prevent="postPay(pay)">
          <div class="modal-body">
            <div class="row gap-1">
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="1"
                    step="any"
                    placeholder="summa"
                    required
                    v-model="pay.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="pay.currency_id"
                    >
                      <option hidden value="">valyuta</option>
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
              <div class="col-md-12">
                <textarea
                  class="form-control form-control-sm"
                  cols="30"
                  rows="4"
                  placeholder="izoh"
                  v-model="pay.comment"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="take">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editTaminotchi.name }} dan pul olish</h4>
        </div>
        <form @submit.prevent="postTake(take)">
          <div class="modal-body">
            <div class="row gap-1">
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="summa"
                    required
                    v-model="take.money"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="take.currency_id"
                    >
                      <option hidden value="">valyuta</option>
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
              <div class="col-md-12">
                <textarea
                  class="form-control form-control-sm"
                  cols="30"
                  rows="4"
                  placeholder="izoh"
                  v-model="take.comment"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  createMarket,
  currencies,
  markets,
  payForMarketExpense,
  success,
  takeIncomeFromMarket,
  updateMarket,
} from "@/components/Api/Api";
export default {
  name: "Ta'minotchilar",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      branch_id: this.$route.params.id,
      currencies: [],
      taminotchilar: [],
      editTaminotchi: {},
      addTaminotchi: {
        name: null,
        phone: null,
        address: null,
      },
      pay: {
        price: null,
        currency_id: "",
        source: null,
        comment: null,
      },
      take: {
        money: null,
        currency_id: "",
        from_: null,
        comment: null,
      },
    };
  },
  computed: {
    filter: function () {
      return this.taminotchilar.filter((item) => {
        return (
          item.name.toLowerCase().match(this.search.toLowerCase()) ||
          String(item.phone).match(this.search)
        );
      });
    },
  },
  created() {
    this.get(0, 100);
  },
  methods: {
    get(page, limit) {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.getMarkets(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getMarkets(page, limit) {
      this.$emit("setloading", true);
      markets(page, limit)
        .then((Response) => {
          this.taminotchilar = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      createMarket(data)
        .then((Response) => {
          document.querySelector("#close-modal").click();
          this.addTaminotchi = {
            name: null,
            phone: null,
            address: null,
          };
          success().then(() => {
            this.get(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      this.$emit("setloading", true);
      updateMarket(data)
        .then((Response) => {
          document.querySelector("#close_modal").click();
          success().then(() => {
            this.get(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postPay(data) {
      this.$emit("setloading", true);
      data.comment = data.comment ? data.comment : " ";
      payForMarketExpense(data)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[2].click();
          this.pay = {
            price: null,
            currency_id: "",
            source: null,
            comment: null,
          };
          success().then(() => {
            this.getMarkets(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postTake(data) {
      this.$emit("setloading", true);
      data.comment = data.comment ? data.comment : " ";
      takeIncomeFromMarket(data)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[3].click();
          this.take = {
            money: null,
            currency_id: "",
            from_: null,
            comment: null,
          };
          success().then(() => {
            this.getMarkets(0, 100);
          });
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
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 80vh;
}
</style>