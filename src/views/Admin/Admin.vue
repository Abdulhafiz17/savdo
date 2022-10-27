<template>
  <h3><span class="fa fa-user" /> Admin</h3>
  <div class="row">
    <div class="col-md-4 my-1">
      <span v-for="item in balances" :key="item">
        <strong>
          {{
            Intl.NumberFormat().format(item.balance) +
            " " +
            item.currency.currency
          }}
        </strong>
      </span>
    </div>
    <div class="col-md-4 my-1">
      <button
        class="btn btn-sm btn-outline-secondary"
        data-toggle="modal"
        data-target="#pay"
      >
        <i class="fa fa-coins" /> Adminga pul berish
      </button>
    </div>
    <div class="col-md-4 my-1"></div>
  </div>
  <hr />

  <div class="body">
    <div class="row my-1">
      <div class="col-md-5">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="from_date"
        />
      </div>
      <div class="col-md-5">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="to_date"
        />
      </div>
      <div class="col-md-2">
        <button
          class="btn btn-sm btn-block btn-outline-secondary"
          @click="getExpenses(0, 100)"
        >
          <i class="far fa-circle-check" />
        </button>
      </div>
    </div>
    <div class="table-responsive my-1">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Summa</th>
            <th>Izoh</th>
            <th>Hodim</th>
            <th>Sana</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item">
            <td>
              {{
                Intl.NumberFormat().format(item.price) +
                " " +
                item.currency.currency
              }}
            </td>
            <td>{{ item.comment }}</td>
            <td>{{ item.user.name }}</td>
            <td>
              {{
                item.time.replace("T", " ").substring(0, item.time.length - 3)
              }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">
              <div class="input-group input-group-sm">
                <button
                  class="btn btn-sm"
                  @click="getExpenses(0, limit)"
                  :disabled="page == 0"
                >
                  <i class="fa fa-angle-double-left" />
                </button>
                <button
                  class="btn btn-sm"
                  @click="getExpenses(page - 1, limit)"
                  :disabled="page == 0"
                >
                  <i class="fa fa-angle-left" />
                </button>
                <button class="btn btn-sm">
                  {{ page + 1 }}
                </button>
                <button
                  class="btn btn-sm"
                  @click="getExpenses(page + 1, limit)"
                  :disabled="page == pages - 1 || pages == 0"
                >
                  <i class="fa fa-angle-right" />
                </button>
                <button
                  class="btn btn-sm"
                  @click="getExpenses(pages - 1, limit)"
                  :disabled="page == pages - 1 || pages == 0"
                >
                  <i class="fa fa-angle-double-right" />
                </button>
                <div class="input-group-append">
                  <select
                    class="form-select form-select-sm"
                    v-model="limit"
                    @change="getExpenses(page, limit)"
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

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Adminga pul berish</h4>
        </div>
        <form @submit.prevent="payToAdmin(paying)">
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
                <select
                  class="form-select"
                  required
                  v-model="paying.currency_id"
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
            <textarea
              class="form-control form-control-sm my-1"
              placeholder="izoh"
              required
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
  adminExpenses,
  branch,
  catchError,
  payForAdmin,
  success,
} from "@/components/Api/Api";
export default {
  name: "Admin",
  emits: ["setloading"],
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 100,
      from_date: "",
      to_date: "",
      branch: null,
      balances: [],
      history: [],
      currencies: [],
      paying: {
        price: null,
        currency_id: "",
        source: this.$route.params.id,
        comment: "",
      },
    };
  },
  created() {
    this.getBranch();
  },
  methods: {
    getBranch() {
      this.$emit("setloading", true);
      branch(this.$route.params.id)
        .then((Response) => {
          this.branch = Response.data.branch;
          this.balances = this.branch.balances;
          if (this.balances.length) {
            this.balances.forEach((item, index) => {
              if (
                this.currencies.find((item2) => {
                  return item2.id == item.currency_id;
                }) == undefined
              ) {
                this.currencies.push(item.currency);
              }
              if (index == this.balances.length - 1) {
                this.getExpenses(0, 100);
              }
            });
          } else {
            this.$emit("setloading", false);
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      adminExpenses(
        this.$route.params.id,
        this.from_date,
        this.to_date,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.history = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    payToAdmin(data) {
      this.$emit("setloading", true);
      payForAdmin(data)
        .then((Response) => {
          this.paying = {
            price: null,
            currency_id: "",
            source: this.$route.params.id,
            comment: "",
          };
          success(0).then(() => {
            this.getBranch();
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
.input-group {
  justify-content: center;
}
</style>