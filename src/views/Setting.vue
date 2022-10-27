<template>
  <div class="row">
    <div class="col"></div>
    <div class="col">
      <h3><span class="fa fa-tools" /> Sozlamalar</h3>
    </div>
    <div class="col">
      <router-link
        class="btn btn-outline-secondary float-right"
        to="/"
        @click="remove()"
      >
        <span class="fa fa-sign-out" />
      </router-link>
    </div>
    <hr />
  </div>

  <div class="responsive">
    <details open>
      <summary>
        <strong>Tizim</strong>
      </summary>
      <ul class="list-group">
        <li class="list-group-item px-5 p-2" @click="changeMode()">
          <span>Tunggi rejim</span>
          <span class="toggle-wrapper">
            <label class="toggle">
              <input
                id="mode"
                type="checkbox"
                :checked="mode === 'dark' ? 'checked' : false"
                @change="changeMode()"
              />
              <span class="toggler round">
                <span id="sun">☀️</span>
                <span id="moon">🌙</span>
              </span>
            </label>
          </span>
        </li>
      </ul>
    </details>

    <details v-if="role !== 'seller'">
      <summary @click="getCurrencies()">
        <strong>Valyutalar</strong>
      </summary>
      <div class="row">
        <div class="col-md-8 my-1 mx-auto" v-if="role == 'admin'">
          <form @submit.prevent="postCurrency(currency)">
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="text"
                minlength="1"
                placeholder="nomi"
                required
                v-model="currency.currency"
              />
              <input
                class="form-control"
                type="number"
                min="1"
                step="any"
                placeholder="narxi"
                required
                v-model="currency.price"
              />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary">
                  <i class="fa fa-circle-plus" />
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          class="col-md-8 my-1 mx-auto"
          v-for="item in currencies"
          :key="item"
        >
          <form @submit.prevent="putCurrency(item)">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">1 {{ item.currency }} =</div>
              </div>
              <input
                class="form-control"
                type="number"
                min="0"
                step="any"
                v-model="item.price"
                required
                :disabled="role !== 'admin'"
              />
              <div class="input-group-append">
                <div class="input-group-text">so'm</div>
              </div>
              <button
                class="btn btn-sm btn-outline-secondary"
                v-if="role == 'admin'"
              >
                <i class="far fa-circle-check" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </details>

    <details v-if="role == 'admin'">
      <summary @click="getCategories()">
        <strong>Kategoriyalar</strong>
      </summary>
      <div class="row">
        <div class="col-md-8 my-1 mx-auto" v-if="role == 'admin'">
          <form @submit.prevent="postCategory(category)">
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="text"
                minlength="1"
                placeholder="nomi"
                required
                v-model="category.name"
              />
              <input
                class="form-control"
                type="text"
                minlength="0"
                placeholder="ustama"
                v-model="category.percent"
              />
              <div class="input-group-append">
                <div class="input-group-text">%</div>
              </div>
              <div class="input-group-append">
                <button class="btn btn-outline-secondary">
                  <i class="fa fa-circle-plus" />
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          class="col-md-8 my-1 mx-auto"
          v-for="item in categories"
          :key="item"
        >
          <form @submit.prevent="putCategory(item)">
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="text"
                minlength="1"
                v-model="item.name"
                required
                :disabled="role !== 'admin'"
              />
              <input
                class="form-control"
                type="number"
                min="0"
                step="any"
                v-model="item.percent"
                :disabled="role !== 'admin'"
              />
              <div class="input-group-append">
                <div class="input-group-text">%</div>
              </div>
              <button
                class="btn btn-sm btn-outline-secondary"
                v-if="role == 'admin'"
              >
                <i class="far fa-circle-check" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </details>

    <details>
      <summary @click="get()">
        <strong>Shaxsiy ma'lumotlar</strong>
      </summary>
      <div class="row my-2 gap-2">
        <form @submit.prevent="put(me)">
          <div class="col-10 mx-auto">
            <label class="row">
              <span class="col-md-6">Ism</span>
              <span class="col-md-6">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="me.name"
                />
              </span>
            </label>
          </div>
          <div class="col-10 mx-auto">
            <label class="row">
              <span class="col-md-6">Telefon</span>
              <span class="col-md-6 input-group input-group-sm">
                <span class="input-group-prepend">
                  <span class="input-group-text">+998</span>
                </span>
                <input
                  class="form-control"
                  type="tel"
                  minlength="9"
                  maxlength="9"
                  placeholder="tel"
                  required
                  v-model="me.phone"
                />
              </span>
            </label>
          </div>
          <div class="col-10 mx-auto">
            <label class="row">
              <span class="col-md-6">Foydalanuvchi nomi</span>
              <span class="col-md-6">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="foydalanuvchi nomi"
                  required
                  v-model="me.username"
                />
              </span>
            </label>
          </div>
          <div class="col-10 mx-auto">
            <label class="row">
              <span class="col-md-6">Parol</span>
              <span class="col-md-6">
                <input
                  class="form-control form-control-sm"
                  type="password"
                  placeholder="parol"
                  v-model="me.password"
                />
              </span>
            </label>
          </div>
          <button type="submit" class="btn btn-sm w-50 btn-outline-secondary">
            <i class="far fa-circle-check" /> Tasdiqlash
          </button>
        </form>
      </div>
    </details>
  </div>

  <!-- <span id="sun" class="fa fa-lg fa-sun"></span> -->
  <!-- <span id="moon" class="fa fa-lg fa-moon"></span> -->
</template>

<script>
import {
  catchError,
  user,
  currencies,
  updateUser,
  updateCurrency,
  success,
  categories,
  updateCategory,
  createCategory,
  createCurrency,
  branch,
} from "../components/Api/Api";
export default {
  name: "Setting",
  emits: ["setloading"],
  data() {
    return {
      mode: document.querySelector(".app").classList[1],
      role: localStorage.getItem("role"),
      me: {},
      branch: null,
      branch_id: localStorage.getItem("branch_id"),
      currencies: [],
      categories: [],
      category: {
        name: null,
        percent: null,
      },
      currency: {
        currency: null,
        price: null,
      },
    };
  },
  created() {
    this.$emit("setloading", false);
  },
  methods: {
    remove() {
      localStorage.clear();
    },
    getBranch(id) {
      this.$emit("setloading", true);
      branch(id)
        .then((Response) => {
          console.log(Response.data);
          this.branch = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    get() {
      this.$emit("setloading", true);
      user()
        .then((Response) => {
          Response.data.password = "";
          this.me = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      this.$emit("setloading", true);
      currencies()
        .then((Response) => {
          this.currencies = Response.data.filter((currency) => {
            return currency.currency !== "so'm";
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories() {
      this.$emit("setloading", true);
      categories(0, 0, 100)
        .then((Response) => {
          this.categories = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postCurrency(data) {
      this.$emit("setloading", true);
      createCurrency(data)
        .then((Response) => {
          this.currency.currency = null;
          this.currency.price = null;
          success().then(() => {
            this.getCurrencies();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postCategory(data) {
      this.$emit("setloading", true);
      createCategory(data)
        .then((Response) => {
          this.category.name = null;
          this.category.percent = null;
          success().then(() => {
            this.getCategories();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      updateUser(data)
        .then((Response) => {
          success();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putCurrency(data) {
      updateCurrency(data)
        .then((Response) => {
          success();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putCategory(data) {
      data.percent ? (data.percent = data.percent) : (data.percent = 0);
      updateCategory(data)
        .then((Response) => {
          success();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    changeMode() {
      if (this.mode) {
        this.mode = "";
        document.querySelector(".app").classList.remove("dark");
      } else {
        this.mode = "dark";
        document.querySelector(".app").classList.add("dark");
      }
    },
  },
};
</script>

<style scoped>
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 90vh;
}
label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input {
  text-align: center;
}
summary {
  font-size: 17px;
}
li {
  padding: 0;
}
@media (max-width: 480px) {
  div .col-10 {
    width: 100% !important;
    padding: 0 !important;
    /* margin: 0 !important; */
  }

  input {
    font-size: 13px !important;
  }

  .input-group-text {
    font-size: 13px !important;
  }
}
#list-item {
  display: flex;
  justify-content: space-between;
  padding: 0 60px 0 60px;
  align-items: center;
}
@media screen and (max-width: 480px) {
  #list-item {
    padding: 0 10px 0 10px;
  }
}
.toggle {
  position: relative;
  display: inline-block;
  width: 55px;
  height: 24px;
  margin: 5px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggler {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.toggler:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 1px;
  background: #fff;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.dark .toggler::before {
  background: var(--dark);
}

input:focus + toggler {
  box-shadow: 0 0 2px #2196f3;
}

input:checked + .toggler:before {
  -webkit-transform: translateX(31px);
  -ms-transform: translateX(31px);
  transform: translateX(31px);
}

.dark .toggler.round {
  background: gray;
  border-radius: 34px;
  width: 60px;
}

.toggler.round {
  border-radius: 34px;
  width: 60px;
}

.toggler.round:before {
  border-radius: 50%;
}

#sun {
  float: left;
  margin-top: -3px;
  font-size: 1.3rem;
}

#moon {
  float: right;
  margin-top: -4px;
  font-size: 1.3rem;
}
</style>