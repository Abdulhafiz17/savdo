<template>
  <div class="main">
    <nav class="navbar">
      <button
        class="btn btn-lg btn-outline-success"
        data-toggle="modal"
        data-target="#confirm"
      >
        <span class="far fa-circle-check" /> Tasdiqlash
      </button>
      <button
        class="btn btn-sm btn-outline-secondary"
        data-toggle="modal"
        data-target="#dailyReport"
        @click="getDailyReport()"
      >
        <span class="fa fa-history" /> Kunlik hisobot
      </button>
      <!-- <router-link to="/expense" class="btn btn-sm btn-outline-secondary">
        <span class="fa fa-wallet" /> Chiqim
      </router-link> -->
      <!-- <router-link class="btn btn-sm btn-outline-secondary" to="/">
        <span class="fa fa-sign-out" /> Chiqish
      </router-link> -->
    </nav>
  </div>
  <div class="modal fade" id="dailyReport">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body" id="report" v-if="report">
          <!-- <div class="modal-image">
            <code>{ logo }</code>
          </div> -->
          <strong>{{ report.day }}</strong>
          <hr />
          <span class="list-group-item">
            Umumiy savdo:
            <strong>
              {{ _.format(report.trade_total_price) + " " + branch_currency }}
            </strong>
          </span>
          <span class="list-group-item">
            Vozvrat:
            <strong>
              {{ _.format(report.returned_price) + " " + branch_currency }}
            </strong>
          </span>
          <hr />
          <span class="list-group-item">
            Savdo:
            <strong>
              {{ _.format(report.savdo_umumiy) + " " + branch_currency }}
            </strong>
          </span>
          <span
            class="list-group-item"
            :title="
              'Buyurtma chegirmasi: ' +
              _.format(report.order_total_discount) +
              ' ' +
              branch_currency +
              ' Mahsulot chegirmasi: ' +
              _.format(report.trade_total_discount) +
              ' ' +
              branch_currency
            "
          >
            Chegirma:
            <strong>
              {{
                _.format(
                  report.order_total_discount + report.trade_total_discount
                ) +
                " " +
                branch_currency
              }}
            </strong>
          </span>
          <span class="list-group-item">
            Nasiya:
            <strong>
              {{
                _.format(report.loan ? report.loan : 0) + " " + branch_currency
              }}
            </strong>
          </span>
          <span class="list-group-item">
            <span> To'lov summa </span>
            <span class="d-flex justify-content-around">
              <strong
                v-for="(item, index) in report.income_data"
                :key="item"
                class="p-1"
              >
                {{
                  item.comment +
                  ": " +
                  _.format(item.total_income) +
                  " " +
                  item.currency +
                  (index !== report.income_data.length - 1 ? ", " : "")
                }}
                <br />
              </strong>
            </span>
          </span>
          <span class="list-group-item">
            Chiqim:
            <strong>
              {{ _.format(report.expense_price) + " " + branch_currency }}
            </strong>
          </span>
          <hr />
          <span class="list-group-item">
            Kassadagi pul:
            <strong>
              {{
                _.format(
                  report.savdo_umumiy -
                    (report.order_total_discount +
                      report.trade_total_discount +
                      report.expense_price)
                ) +
                " " +
                branch_currency
              }}
            </strong>
          </span>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="printReport()">
            <i class="fa fa-print" />
          </button>
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
  branch,
  catchError,
  currencies,
  statisticOrders,
} from "@/components/Api/Api";
export default {
  name: "Bar",
  emits: ["setloading"],
  data() {
    return {
      role: localStorage.getItem("role"),
      _: Intl.NumberFormat(),
      report: null,
      expense_price: 0,
      branch_id: localStorage.getItem("branch_id"),
      branch: null,
      branch_currency: null,
    };
  },
  methods: {
    getDailyReport() {
      this.$emit("setloading", true);
      let date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10);
      statisticOrders(date, date, 0)
        .then((Response) => {
          this.report = Response.data[0];
          this.getBranch();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getBranch() {
      branch(this.branch_id)
        .then((Response) => {
          this.branch = Response.data.branch;
          this.getCurrencies();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.branch_currency = Response.data.find((currency) => {
            return currency.id == this.branch.trade_currency;
          }).currency;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    printReport() {
      let report = document.querySelector("#report").outerHTML;
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
      winPrint.document.querySelector("body").innerHTML = report;
      winPrint.print();
    },
  },
};
</script>

<style scoped>
div.main {
  position: fixed;
  width: 96%;
  bottom: 1%;
  left: 2%;
  right: 2%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  /* padding: 10px; */
  /* border: 1px solid white; */
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid gray;
  border-radius: 4px;
}

h5 {
  margin: 0;
}
h6 {
  margin: 0;
}
</style>
