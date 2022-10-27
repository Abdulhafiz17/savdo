<template></template>

<script>
import { branch, catchError } from "@/components/Api/Api";
export default {
  name: "HomeView",
  emits: ["setloading"],
  data() {
    return {
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
    };
  },
  created() {
    if (this.role == "admin") {
      this.$router.push("/main");
    } else {
      this.forBranch();
    }
  },
  methods: {
    forBranch() {
      branch(this.branch_id)
        .then((Response) => {
          Response.data.branch.font
            ? localStorage.setItem("main_font", Response.data.branch.font)
            : false;
          Response.data.branch.colour
            ? localStorage.setItem("main_color", Response.data.branch.colour)
            : false;
          Response.data.branch.colour2
            ? localStorage.setItem("main_color2", Response.data.branch.colour2)
            : false;
          Response.data.logo
            ? localStorage.setItem("main_logo", Response.data.logo.logo)
            : false;
          if (this.role == "branch_admin") this.$router.push(`/statistic/${this.branch_id}`);
          else if (this.role == "seller") this.$router.push(`/kassa`)
        })
        .catch((error) => {
          if (error.message == "Network Error") {
            this.forBranch();
          } else {
            this.$emit("setloading", false);
            catchError(error);
          }
        });
    },
  },
};
</script>
