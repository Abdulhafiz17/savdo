<template>
  <div class="container-fluid">
    <div class="card p-5">
      <img src="../../components/Pictures/rotate.png" width="110" alt="logo" />
      <div style="margin: 10px">
        <h4>Xush kelibsiz</h4>
      </div>
      <form @submit.prevent="sign(data)">
        <div class="row">
          <div class="col-md-12">
            <div class="input-group my-1">
              <input
                class="form-control text-center"
                type="text"
                v-model="data.username"
                placeholder="foydalanuvchi nomi"
                required
              />
              <div class="input-group-text">
                <i class="fa fa-at" />
              </div>
            </div>
            <div class="input-group mt-1">
              <input
                class="form-control text-center"
                :type="type ? 'password' : 'text'"
                v-model="data.password"
                placeholder="parol"
                required
              />
              <div class="input-group-text toggle" @click="type = !type">
                <i :class="`fa fa-eye${type ? '-slash' : ''}`" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 my-1">
            <button class="btn btn-secondary btn-block">Kirish</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { catchError, login } from "../../components/Api/Api";
export default {
  emits: ["setloading"],
  data() {
    return {
      data: {
        username: "",
        password: "",
      },
      type: true,
    };
  },
  created() {
    this.$emit("setloading", false);
    console.clear();
    localStorage.clear();
  },
  methods: {
    sign() {
      this.$emit("setloading", true);
      login(this.data)
        .then((response) => {
          this.require(response.data);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    require(data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("branch_id", data.branch_id);
      // this.$router.push("/home");
      location.href = "/home";
    },
  },
};
</script>

<style scoped>
.container-fluid {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
}

.card {
  padding: 20px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.input-group-text {
  width: 40px;
}

.toggle {
  cursor: pointer;
}
</style>