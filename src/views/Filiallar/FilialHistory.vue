<template>
  <h3>
    <i class="fa fa-code-branch" /> {{ branch ? branch.name : "" }}
  </h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <Taminot @setloading="setloading" v-if="template == 'taminot'" />
</template>

<script>
import { branch, catchError } from "@/components/Api/Api";
import Taminot from "./Taminot.vue";
import Tolov from "./Tolov.vue";
export default {
  name: "Filial",
  emits: ["setloading"],
  components: { Taminot, Tolov },
  data() {
    return {
      branch: null,
      template: "taminot",
    };
  },
  created() {
    this.get(this.$route.params.id);
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    get(id) {
      branch(id)
        .then((Response) => {
          this.branch = Response.data.branch;
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

<style>
</style>