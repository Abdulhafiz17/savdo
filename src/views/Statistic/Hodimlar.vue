<template>
  <h4>Hodimlar</h4>
  <div class="row my-1">
    <div class="col-md-4 my-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="from_date"
      />
    </div>
    <div class="col-md-4 my-1">
      <input
        class="form-control form-control-sm"
        type="date"
        v-model="to_date"
      />
    </div>
    <div class="col-md-4 my-1">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        @click="getUsers()"
      >
        <span class="far fa-circle-check" /> Qidirish
      </button>
    </div>
  </div>
  <div id="uChart">
    <canvas id="usersChart" width="600" height="250" />
  </div>
</template>

<script>
import { catchError, statisticUsers } from "@/components/Api/Api";
export default {
  name: "Users",
  emits: ["setloading"],
  data() {
    return {
      from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .substring(0, 10),
      to_date: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10),
      users: [],
    };
  },
  created() {
    // this.$emit("setloading", false)
    this.getUsers();
  },
  mounted() {},
  methods: {
    getUsers() {
      statisticUsers(this.from_date, this.to_date, this.$route.params.id)
        .then((Response) => {
          if (Response.data.length) this.prepareChart(Response.data);
          else this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    prepareChart(users) {
      let canvas,
        price = 0,
        prices = [],
        labels = [];
      document.getElementById("usersChart").remove();
      canvas = document.createElement("canvas");
      canvas.id = "usersChart";
      canvas.height = 250;
      canvas.width = 600;
      document.getElementById("uChart").append(canvas);
      for (let i = 0; i < users.length; i++) {
        if (users[i].user !== null) {
          prices.push(users[i].sum_price);
          labels.push(users[i].user);
        } else {
          price += users[i].sum_price;
        }
        if (i == users.length - 1) {
          labels.unshift("Kassir");
          prices.unshift(price);
          this.createChart(labels, prices);
        }
      }
    },
    createChart(labels, prices) {
      const ctx = document.getElementById("usersChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Hodimlar",
              data: prices,
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      this.$emit("setloading", false);
    },
  },
};
</script>

<style>
</style>