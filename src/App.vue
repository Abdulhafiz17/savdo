<template>
  <div class="app dark">
    <span v-if="this.$route.name !== 'login'">
      <Sidebar v-if="role !== 'admin'" />
    </span>
    <div class="container-fluid pt-2" style="height: 100vh">
      <div
        id="main-card"
        :class="
          this.$route.name !== 'login' ? 'card shadow p-2 responsive' : ''
        "
        :style="[
          this.$route.name == 'login' || role == 'admin'
            ? { 'margin-left': '0' }
            : { 'margin-left': '35px' },
        ]"
      >
        <div
          class="btn-group btn-group-sm btn-admin"
          v-if="
            role == 'admin' &&
            this.$route.name !== 'login' &&
            this.$route.name !== 'main'
          "
        >
          <button class="btn btn-outline-secondary" @click="back()">
            <i class="fa fa-arrow-left" />
          </button>
          <router-link to="/main" class="btn btn-outline-secondary">
            <i class="fa fa-home" />
          </router-link>
        </div>
        <Router-view @setloading="setloading" />
      </div>
      <!-- <Notification v-if="role == 'branch_admin' && this.$route.name !== 'login'"/> -->
    </div>
    <isloading v-if="loading" />
  </div>
</template>

<script>
import Sidebar from "./components/sidebar/Sidebar.vue";
import Notification from "./views/Notification/Notification.vue";
import swal from "sweetalert";
import isloading from "./components/Animation/Anime.vue";
export default {
  name: "App",
  components: { Sidebar, Notification, isloading },
  data() {
    return {
      role: localStorage.getItem("role"),
      loading: true,
    };
  },
  watch: {
    $route(to) {
      document.title = `Savdo • ${to.meta.title}`;
      this.loading = true;
      this.setDisplay();
    },
  },
  created() {
    this.setDisplay();
    setInterval(() => {
      window.onoffline = () => {
        swal({
          icon: "warning",
          title: "Tarmoq bilan aloqa mavjud emas !",
          closeOnClickOutside: false,
          closeOnEsc: false,
        });
      };
    }, 60000);
    window.ononline = () => {
      swal({
        icon: "success",
        title: "Aloqa mavjud !",
        timer: 1500,
      }).then(() => {});
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    setloading(loading) {
      this.loading = loading;
    },
    setDisplay() {
      document.documentElement.style.setProperty(
        "--main-font",
        localStorage.getItem("main_font")
      );
      document.documentElement.style.setProperty(
        "--main-color",
        localStorage.getItem("main_color")
      );
      document.documentElement.style.setProperty(
        "--main-border",
        localStorage.getItem("main_color2")
      );
      document.documentElement.style.setProperty(
        "--main-logo",
        localStorage.getItem("main_logo")
      );
    },
  },
};
</script>

<style>
@import url("./main.css");
@import url("./dark.css");
.btn-admin {
  position: absolute;
  z-index: 10;
}
</style>
