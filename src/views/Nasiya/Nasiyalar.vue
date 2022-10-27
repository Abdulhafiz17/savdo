<template>
  <h3><span class="fa fa-hand-holding-usd" /> Nasiyalar</h3>
  <div class="row">
    <div class="col-md-3"></div>
    <div class="col-md-6 my-1">
      <h4>
        Umumiy nasiya:
        {{
          sum_loan
            ? _.format(sum_loan.sum_loan_price) + " " + sum_loan.loan_currency
            : ""
        }}
      </h4>
    </div>
    <div class="col-md-3"></div>
  </div>
  <hr />

  <div class="body">
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
          @click="
            customer_id = 0;
            (mijozlar = []), getFalse(0, 0, 100);
          "
        >
          Faol
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
          @click="
            customer_id = 0;
            (mijozlar = []), getTrue(0, 0, 100);
          "
        >
          Yakunlangan
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
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>
                  <select
                    class="form-select form-select-sm"
                    v-model="customer_id"
                    @change="getFalse(customer_id, 0, limit)"
                  >
                    <option value="0">Mijoz</option>
                    <option v-for="i in mijozlar" :key="i" :value="i.id">
                      {{ i.name }}
                    </option>
                  </select>
                </th>
                <th>Summa</th>
                <th>Qaytarish sanasi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in loans" :key="i">
                <td>{{ i.Customers.name }}</td>
                <td>
                  {{
                    Intl.NumberFormat().format(i.Loans.residual) +
                    " " +
                    i.loan_currency
                  }}
                </td>
                <td>{{ i.Loans.return_date }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link
                      :to="`/nasiya/${i.Loans.id}/${i.Loans.order_id}`"
                      class="btn btn-outline-info"
                    >
                      <i class="fa fa-info" />
                    </router-link>
                    <button
                      class="btn btn-outline-success"
                      data-toggle="modal"
                      data-target="#pay"
                      @click="
                        loan = i;
                        loan_price = null;
                      "
                    >
                      <i class="fa fa-coins" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">
                  <div class="input-group input-group-sm">
                    <button
                      class="btn btn-sm"
                      @click="getFalse(customer_id, 0, limit)"
                      :disabled="page == 0"
                    >
                      <i class="fa fa-angle-double-left" />
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="getFalse(customer_id, page - 1, limit)"
                      :disabled="page == 0"
                    >
                      <i class="fa fa-angle-left" />
                    </button>
                    <button class="btn btn-sm">
                      {{ page + 1 }}
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="getFalse(customer_id, page + 1, limit)"
                      :disabled="page == pages - 1 || pages == 0"
                    >
                      <i class="fa fa-angle-right" />
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="getFalse(customer_id, pages - 1, limit)"
                      :disabled="page == pages - 1 || pages == 0"
                    >
                      <i class="fa fa-angle-double-right" />
                    </button>
                    <div class="input-group-append">
                      <select
                        class="form-select form-select-sm"
                        v-model="limit"
                        @change="getFalse(customer_id, page, limit)"
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
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <div class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>
                  <select
                    class="form-select form-select-sm"
                    v-model="customer_id"
                    @change="getTrue(customer_id, 0, limit)"
                  >
                    <option value="0">Mijoz</option>
                    <option v-for="i in mijozlar" :key="i" :value="i.id">
                      {{ i.name }}
                    </option>
                  </select>
                </th>
                <th>Summa</th>
                <th>Qaytarish sanasi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in loans_true" :key="i">
                <td>{{ i.Customers.name }}</td>
                <td>
                  {{
                    Intl.NumberFormat().format(i.Loans.money) +
                    " " +
                    i.loan_currency
                  }}
                </td>
                <td>{{ i.Loans.return_date }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link
                      :to="`/nasiya/${i.Loans.id}/${i.Loans.order_id}`"
                      class="btn btn-outline-info"
                    >
                      <i class="fa fa-info" />
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">
                  <div class="input-group input-group-sm">
                    <button
                      class="btn btn-sm"
                      @click="getTrue(customer_id, 0, limit)"
                      :disabled="page == 0"
                    >
                      <i class="fa fa-angle-double-left" />
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="getTrue(customer_id, page - 1, limit)"
                      :disabled="page == 0"
                    >
                      <i class="fa fa-angle-left" />
                    </button>
                    <button class="btn btn-sm">
                      {{ page + 1 }}
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="getTrue(customer_id, page + 1, limit)"
                      :disabled="page == pages - 1 || pages == 0"
                    >
                      <i class="fa fa-angle-right" />
                    </button>
                    <button
                      class="btn btn-sm"
                      @click="getTrue(customer_id, pages - 1, limit)"
                      :disabled="page == pages - 1 || pages == 0"
                    >
                      <i class="fa fa-angle-double-right" />
                    </button>
                    <div class="input-group-append">
                      <select
                        class="form-select form-select-sm"
                        v-model="limit"
                        @change="getTrue(customer_id, page, limit)"
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
  </div>

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Nasiya uchun to'lov</h4>
        </div>
        <form @submit.prevent="post(loan)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="loan_price"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ loan ? loan.loan_currency : "" }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="loan_price_type"
                    >
                      <option value="naxt">naxt</option>
                      <option value="plastik">plastik</option>
                    </select>
                  </div>
                </div>
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
import { catchError, loans, success, takeLoan } from "@/components/Api/Api";
export default {
  name: "Nasiyalar",
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      page: 0,
      pages: 1,
      limit: 100,
      loans: [],
      loans_true: [],
      loan: null,
      loan_price: null,
      loan_price_type: "naxt",
      mijozlar: [],
      customer_id: 0,
      sum_loan: null,
    };
  },
  created() {
    this.getFalse(0, this.page, this.limit);
  },
  methods: {
    getFalse(id, page, limit) {
      this.$emit("setloading", true);
      loans(false, id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.loans = Response.data.data;
          this.sum_loan = Response.data.sum_loans_data;
          this.loans.forEach((item) => {
            if (
              this.mijozlar.find((mijoz) => {
                return mijoz.id == item.Customers.id;
              }) == undefined
            ) {
              this.mijozlar.push(item.Customers);
            }
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrue(id, page, limit) {
      this.$emit("setloading", true);
      loans(true, id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.loans_true = Response.data.data;
          this.loans_true.forEach((item) => {
            if (
              this.mijozlar.find((mijoz) => {
                return mijoz.id == item.Customers.id;
              }) == undefined
            ) {
              this.mijozlar.push(item.Customers);
            }
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(loan) {
      this.$emit("setloading", true);
      takeLoan(loan.Loans.id, this.loan_price, this.loan_price_type)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[0].click();
          this.loan_price = null;
          success().then(() => {
            this.getFalse(this.customer_id, this.page, this.limit);
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

.table-responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}
</style>