<template>
  <h3><span class="fa fa-truck" /> Ta'minotlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <button class="btn btn-sm btn-outline-secondary" @click="post()">
        <i class="fa fa-circle-plus" /> Ta'minot qo'shish
      </button>
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="body">
    <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="pills-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-home"
          type="button"
          role="tab"
          aria-controls="pills-home"
          aria-selected="true"
        >
          Faol
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
        >
          Yakunlangan
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        <div class="responsive">
          <div class="row">
            <div class="col-md-11 mx-auto">
              <ul class="list-group">
                <router-link
                  class="list-group-item"
                  v-for="item in taminotlarFalse"
                  :key="item"
                  :to="`/taminot/${item.id}`"
                  @click="setItem(true)"
                >
                  <span><strong>Id: </strong> {{ item.id }} </span>
                  <span><strong>Sana:</strong> {{ item.sana }} </span>
                </router-link>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <div class="responsive">
          <div class="row">
            <div class="col-md-11 mx-auto">
              <ul class="list-group">
                <router-link
                  class="list-group-item"
                  v-for="item in taminotlarTrue"
                  :key="item"
                  :to="`/taminot/${item.id}`"
                  @click="setItem(false)"
                >
                  <span><strong>Id: </strong> {{ item.id }} </span>
                  <span><strong>Sana:</strong> {{ item.sana }} </span>
                </router-link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {
  catchError,
  createParty,
  parties,
  success,
} from "@/components/Api/Api";
export default {
  name: "Ta'minot",
  emits: ["setloading"],
  data() {
    return {
      taminotlarFalse: [],
      taminotlarTrue: [],
    };
  },
  created() {
    this.get(false, 0, 100);
  },
  methods: {
    get(status, page, limit) {
      this.getFalse(status, page, limit);
    },
    getFalse(status, page, limit) {
      parties(status, page, limit)
        .then((Response) => {
          this.taminotlarFalse = Response.data.data;
          this.getTrue(true, 0, 100);
        })
        .catch((error) => {
          this.$emit("setloading", false)
          catchError(error);
        });
    },
    getTrue(status, page, limit) {
      parties(status, page, limit)
        .then((Response) => {
          this.taminotlarTrue = Response.data.data;
          this.$emit("setloading", false)
        })
        .catch((error) => {
          this.$emit("setloading", false)
          catchError(error);
        });
    },
    post() {
      this.$emit("setloading", true)
      createParty()
        .then((Response) => {
          success().then(() => {
            this.get(false, 0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false)
          catchError(error);
        });
    },
    setItem(boolean) {
      if (boolean) {
        localStorage.setItem("supply", boolean);
      } else {
        localStorage.removeItem("supply");
      }
    },
  },
};
</script>

<style scoped>
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}
</style>