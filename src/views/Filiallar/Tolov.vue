<template>
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
</template>

<script>
import { adminExpenses, branch, catchError } from '@/components/Api/Api';
export default {
  name: "Tolov",
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
    };
  },
  created() {
    this.getBranch(0, 100);
  },
  methods: {
    getBranch() {
      this.$emit("setloading", true);
      branch(this.$route.params.id)
        .then((Response) => {
          this.branch = Response.data.branch;
          this.balances = this.branch.balances;
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
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}
</style>