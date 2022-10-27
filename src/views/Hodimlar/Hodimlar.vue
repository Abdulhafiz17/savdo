<template>
  <h3>
    <span class="fa fa-user-group" />
    {{
      role == "admin" ? (branch ? branch.name + " hodimlari" : "") : "Hodimlar"
    }}
  </h3>
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
        data-target="#hodimQoshish"
      >
        <span class="fa fa-user-plus" /> Hodim qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-4 my-1" v-for="hodim in filterUser" :key="hodim">
        <div :class="hodim.status ? 'card' : 'card border-danger'">
          <div class="card-body">
            <details>
              <summary>
                <span
                  :class="
                    hodim.status ? 'fa fa-user' : 'fa fa-user-lock text-danger'
                  "
                />
                <span>{{ hodim.name }}</span>
              </summary>
              <ul class="list-group">
                <a class="list-group-item" :href="'tel:+998' + hodim.phone">
                  <span class="fa fa-phone" />
                  <span>+998 {{ format(hodim.phone) }}</span>
                </a>
                <li class="list-group-item">
                  <span class="fa fa-user-tag" />
                  <span v-if="hodim.role == 'admin'">Admin</span>
                  <span v-if="hodim.role == 'branch_admin'">Filial admin</span>
                  <span v-if="hodim.role == 'cashier'">Kassir</span>
                  <span v-if="hodim.role == 'seller'">Sotuvchi</span>
                </li>
                <li class="list-group-item">
                  <span class="fas fa-percent" />
                  <span> {{ hodim.profit_percentage }} %</span>
                </li>
                <li class="list-group-item">
                  <span class="fa fa-coins" />
                  <span
                    :class="
                      hodim.balance > 0
                        ? 'text-success'
                        : hodim.balance < 0
                        ? 'text-danger'
                        : ''
                    "
                  >
                    {{
                      _.format(hodim.balance) +
                      " " +
                      (currency ? currency.currency : "")
                    }}
                  </span>
                </li>
              </ul>
            </details>
            <div class="row my-1 gap-1">
              <div class="col">
                <router-link
                  class="btn btn-sm btn-block btn-outline-info"
                  :to="'/hodim/' + hodim.id"
                >
                  <span class="fa fa-info" />
                </router-link>
              </div>
              <div class="col" v-if="role !== 'admin'">
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  data-toggle="modal"
                  data-target="#pay"
                  @click="this.editHodim = hodim"
                >
                  <span class="fa fa-coins" />
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#hodimEdit"
                  @click="
                    this.editHodim = hodim;
                    this.editHodim.password = '';
                  "
                >
                  <span class="far fa-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="hodimQoshish">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Hodim qo'shish</h4>
        </div>
        <form @submit.prevent="post(yangiHodim)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="yangiHodim.name"
                />
              </div>
              <div class="col-md-6">
                Telefon raqami
                <label class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="yangiHodim.phone"
                  />
                </label>
              </div>
              <div class="col-md-12">
                Vazifasi
                <select
                  class="form-control form-control-sm"
                  required
                  v-model="yangiHodim.role"
                >
                  <option hidden value="">role</option>
                  <option v-if="role == 'admin'" value="branch_admin">
                    Filial admin
                  </option>
                  <option value="seller">Sotuvchi</option>
                </select>
              </div>
              <div class="col-md-6">
                Foydalanuvchi nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="foydalanuvchi nomi"
                  required
                  v-model="yangiHodim.username"
                />
              </div>
              <div class="col-md-6">
                Parol
                <input
                  class="form-control form-control-sm"
                  type="password"
                  placeholder="parol"
                  required
                  v-model="yangiHodim.password"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6"></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="hodimEdit">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editHodim.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editHodim)">
          <div class="modal-body">
            <div class="row mb-2">
              <div class="col-md-6">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="editHodim.name"
                />
              </div>
              <div class="col-md-6">
                Telefon raqami
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="editHodim.phone"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                Status
                <select
                  class="form-control form-control-sm"
                  required
                  v-model="editHodim.status"
                >
                  <option selected disabled hidden value="">Status</option>
                  <option value="true">Faol</option>
                  <option value="false">Nofaol</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                Foydalanuvchi nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="foydalanuvchi nomi"
                  required
                  v-model="editHodim.username"
                />
              </div>
              <div class="col-md-6">
                Parol
                <input
                  class="form-control form-control-sm"
                  type="password"
                  placeholder="parol"
                  v-model="editHodim.password"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="get(this.$route.params.id, 0, 50)"
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
          <h4>{{ editHodim.name }} ga pul berish</h4>
        </div>
        <form @submit.prevent="payToUser(paying)">
          <div class="modal-body">
            <div class="input-group input-group-sm my-1">
              <input
                type="number"
                step="any"
                min="0"
                class="form-control"
                placeholder="summa"
                required
                v-model="paying.price"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  {{ currency ? currency.currency : "" }}
                </div>
              </div>
            </div>
            <textarea
              type="textarea"
              class="form-control form-control-sm"
              placeholder="izoh"
              v-model="paying.comment"
            ></textarea>
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
  branch,
  catchError,
  createUser,
  currencies,
  payForUser,
  success,
  updateUser,
  users,
} from "@/components/Api/Api";
export default {
  name: "Hodimlar",
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
      search: "",
      hodimlar: [],
      yangiHodim: {
        id: 0,
        name: "",
        username: "",
        password: "",
        role: "",
        branch_id: "",
        phone: null,
        profit_percentage: 0,
        status: true,
      },
      editHodim: {},
      branch: null,
      currency: null,
      paying: {
        price: null,
        currency_id: null,
        source: null,
        comment: "",
      },
    };
  },
  created() {
    this.get(this.$route.params.id, 0, 100);
  },
  mounted() {},
  computed: {
    filterUser: function () {
      return this.hodimlar.filter((hodim) => {
        return (
          hodim.name.toLowerCase().match(this.search.toLowerCase()) ||
          String(hodim.phone).match(this.search)
        );
      });
    },
  },
  methods: {
    format(number) {
      return String(
        "(" +
          String(number).substr(0, 2) +
          ") " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    get(id, page, limit) {
      this.$emit("setloading", true);
      users(id, page, limit)
        .then((Response) => {
          this.hodimlar = Response.data.data;
          this.getBranch();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBranch() {
      branch(this.$route.params.id)
        .then((Response) => {
          this.branch = Response.data.branch;
          this.getCurrency();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrency() {
      currencies()
        .then((Response) => {
          this.currency = Response.data.find((item) => {
            return item.id == this.branch.trade_currency;
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      // if (this.role == "admin") {
      data.branch_id = this.$route.params.id;
      // } else {
      //   data.branch_id = this.branch_id;
      // }
      createUser(data)
        .then((Response) => {
          this.yangiHodim = {
            id: 0,
            name: "",
            username: "",
            password: "",
            role: "",
            branch_id: "",
            phone: null,
            profit_percentage: 0,
            status: true,
          };
          success(0).then(() => {
            this.get(this.$route.params.id, 0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      this.$emit("setloading", true);
      updateUser(data)
        .then((Response) => {
          success(1).then(() => {
            this.get(this.$route.params.id, 0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    payToUser(data) {
      this.$emit("setloading", true);
      data.currency_id = this.currency.id;
      data.source = this.editHodim.id;
      data.comment = data.comment ? data.comment : " ";
      payForUser(data)
        .then((Response) => {
          this.paying = {
            price: null,
            currency_id: null,
            source: null,
            comment: "",
          };
          success(2).then(() => {
            this.get(this.$route.params.id, 0, 100);
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
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 80vh;
}
</style>