<template>
  <div class="btn-group btn-group-sm my-1">
    <button class="btn" :disabled="page == 0" @click="get(0, limit)">
      <i class="fa fa-angle-double-left"></i>
    </button>
    <button class="btn" :disabled="page == 0" @click="get(page - 1, limit)">
      <i class="fa fa-angle-left"></i>
    </button>
    <button class="btn" v-if="page - 1 > 0" @click="get(page - 2, limit)">
      {{ page - 1 }}
    </button>
    <button class="btn" v-if="page" @click="get(page - 1, limit)">
      {{ page }}
    </button>
    <button class="btn border border-primary rounded">{{ page + 1 }}</button>
    <button class="btn" v-if="page + 2 <= pages" @click="get(page + 1, limit)">
      {{ page + 2 }}
    </button>
    <button class="btn" v-if="page + 3 <= pages" @click="get(page + 2, limit)">
      {{ page + 3 }}
    </button>
    <button
      class="btn"
      :disabled="page == pages - 1 || !pages"
      @click="get(page + 1, limit)"
    >
      <i class="fa fa-angle-right"></i>
    </button>
    <button
      class="btn"
      :disabled="page == pages - 1 || !pages"
      @click="get(pages - 1, limit)"
    >
      <i class="fa fa-angle-double-right"></i>
    </button>
    <select
      class="form-select form-select-sm"
      v-model="limit"
      @change="get(0, limit)"
    >
      <option disabled value="">limit</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["page", "pages", "limit"],
  emits: ["get"],
  data() {
    return {};
  },
  methods: {
    get(page, limit) {
      this.$emit("get", page, limit);
    },
  },
};
</script>
