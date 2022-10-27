<template>
  <h3><span class="fa fa-home" /> Asosiy</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="row">
    <!-- <div class="col-md-4 my-1">
      <router-link to="/statistics" class="card shadow">
        <div class="card-body">
          <i class="fa fa-2x fa-chart-line" />
          <hr />
          <strong>Hisobotlar</strong>
        </div>
      </router-link>
    </div> -->
    <div class="col-md-4 my-1">
      <router-link to="/filiallar" class="card shadow">
        <div class="card-body">
          <i class="fa fa-2x fa-code-branch" />
          <hr />
          <strong>Do'kon</strong>
        </div>
      </router-link>
    </div>
    <div class="col-md-4 my-1">
      <router-link to="/omborlar" class="card shadow">
        <div class="card-body">
          <i class="fas fa-2x fa-warehouse" />
          <hr />
          <strong>Omborlar</strong>
        </div>
      </router-link>
    </div>
    <div class="col-md-4 my-1">
      <router-link to="/taminotlar" class="card shadow">
        <div class="card-body">
          <i class="fa fa-2x fa-truck" />
          <hr />
          <strong>Ta'minot</strong>
        </div>
      </router-link>
    </div>
    <div class="col-md-4 my-1">
      <router-link to="/taminotchilar" class="card shadow">
        <div class="card-body">
          <i class="fa fa-2x fa-truck-loading" />
          <hr />
          <strong>Ta'minotchilar</strong>
        </div>
      </router-link>
    </div>
    <div class="col-md-4 my-1">
      <router-link to="/settings" class="card shadow">
        <div class="card-body">
          <i class="fa fa-2x fa-tools" />
          <hr />
          <strong>Sozlamalar</strong>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  emits: ["setloading"],
  created() {
    this.$emit("setloading", false)
  },
};
</script>

<style scoped>
@media (max-width: 425px) {
  .col-md-4 {
    width: 50%;
    font-size: 14px;
  }

}
</style>