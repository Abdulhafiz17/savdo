<template>
  <h3><span class="fa fa-chart-line" /> Hisobotlar</h3>
  <div class="row">
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1"></div>
  </div>
  <hr />
</template>

<script>
export default {
  name: "Statistics",
  emits: ["setloading"],
  created() {
    this.$emit("setloading", false);
  },
};
</script>

<style>
</style>