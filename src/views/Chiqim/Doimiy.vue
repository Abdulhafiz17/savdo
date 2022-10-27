<template>
  <div class="row my-1">
    <div class="col-md-3 mb-1">
      <select
        class="form-select form-select-sm"
        v-model="id"
        @click="expenses.length ? '' : getExpenses()"
      >
        <option value="0">Barchasi</option>
        <option v-for="item in expenses" :key="item" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_time"
      />
    </div>
    <div class="col-md-4 mb-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_time"
      />
    </div>
    <div class="col-md-1 mb-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="get(page, limit)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Chiqim</th>
          <th>Summa</th>
          <th>Izoh</th>
          <th>Kim tomonidan</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item">
          <td>{{ item.name }}</td>
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.price) }}
            {{ item.Expenses.currency.currency }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.Expenses.user.name }}</td>
          <td>{{ item.Expenses.time.replace("T", " ") }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">
            <div class="input-group input-group-sm">
              <button
                class="btn btn-sm"
                @click="get(0, limit)"
                :disabled="page == 0"
              >
                <i class="fa fa-angle-double-left" />
              </button>
              <button
                class="btn btn-sm"
                @click="get(page - 1, limit)"
                :disabled="page == 0"
              >
                <i class="fa fa-angle-left" />
              </button>
              <button class="btn btn-sm">
                {{ page + 1 }}
              </button>
              <button
                class="btn btn-sm"
                @click="get(page + 1, limit)"
                :disabled="page == pages - 1 || pages == 0"
              >
                <i class="fa fa-angle-right" />
              </button>
              <button
                class="btn btn-sm"
                @click="get(pages - 1, limit)"
                :disabled="page == pages - 1 || pages == 0"
              >
                <i class="fa fa-angle-double-right" />
              </button>
              <div class="input-group-append">
                <select
                  class="form-select form-select-sm"
                  v-model="limit"
                  @change="get(page, limit)"
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
</template>

<script>
import { catchError, fixedExpense } from "@/components/Api/Api";
export default {
  name: "Fixed",
  props: ["expenses"],
  emits: ["setloading", "getExpenses"],
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 50,
      id: 0,
      from_time: "",
      to_time: "",
      history: [],
    };
  },
  created() {
    this.get(this.page, this.limit);
  },
  methods: {
    get(page, limit) {
      this.$emit("setloading", true);
      fixedExpense(page, limit, this.id, this.from_time, this.to_time)
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
    getExpenses() {
      this.$emit("getExpenses");
    },
  },
};
</script>

<style scoped>
.input-group {
  justify-content: center;
}
.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 65vh;
}
</style>