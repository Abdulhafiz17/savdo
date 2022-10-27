<template>
    <h4>Chiqim</h4>
</template>

<script>
export default {
  name: "Expenses",
  emits: ["setloading"],
  created() {
    this.$emit("setloading", false);
  },
};
</script>

<style>
</style>