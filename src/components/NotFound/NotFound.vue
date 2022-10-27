<template>
  <div id="card">
      <h2>Xatolik kodi 404 (Sahifa mavjud emas)</h2>
  </div>
</template>

<script>
export default {
    emits: ["setloading"],
    created() {
        this.$emit("setloading", false)
    },
}
</script>

<style scoped>

#card {
    padding: 30px;
    margin: 30px;
    border-radius: 5px;
    align-content: center;
    align-items: center;
    text-align: center;
    background: rgb(255, 255, 255, 0.5);
    text-decoration: underline;
    text-decoration-color: red;
    backdrop-filter: blur(1px);
}

.dark #card {
    background: rgb(0, 0, 0, 0.1);
}

</style>