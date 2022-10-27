<template>
  <h3><span class="fa fa-warehouse" /> Omborlar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-append">
          <div class="input-group-text">
            <i class="fa fa-search" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        data-toggle="modal"
        data-target="#add"
      >
        <span class="fa fa-plus" /> Ombor qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in filter" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <details>
              <summary>
                <i class="fa fa-warehouse" />
                <span> {{ item.name }} </span>
              </summary>
              <ul class="list-group">
                <li class="list-group-item">
                  <i class="fa fa-location-dot" />
                  <span> {{ item.address }} </span>
                </li>
              </ul>
            </details>
            <div class="row my-1">
              <div class="col my-1">
                <router-link
                  :to="`/ombor/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-success"
                >
                  <i class="fa fa-door-open" />
                </router-link>
              </div>
              <div class="col my-1">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="editOmbor = item"
                >
                  <i class="fa fa-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="add">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Yangi ombor</h4>
        </div>
        <form @submit.prevent="post(newOmbor)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                Nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="nomi"
                  required
                  v-model="newOmbor.name"
                />
              </div>
              <div class="col-md-12">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="newOmbor.address"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editOmbor.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editOmbor)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                Nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="nomi"
                  required
                  v-model="editOmbor.name"
                />
              </div>
              <div class="col-md-12">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="editOmbor.address"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="get()"
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  createWarehouse,
  success,
  updateWarehouse,
  warehouses,
} from "@/components/Api/Api";
export default {
  name: "Omborlar",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      omborlar: [],
      editOmbor: {},
      newOmbor: {
        name: "",
        address: "",
      },
    };
  },
  created() {
    this.get();
  },
  computed: {
    filter: function () {
      return this.omborlar.filter((ombor) => {
        return ombor.name.toLowerCase().match(this.search.toLowerCase());
      });
    },
  },
  methods: {
    get() {
      this.$emit("setloading", true);
      warehouses()
        .then((Response) => {
          this.omborlar = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      createWarehouse(data)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[0].click();
          success().then(() => {
            this.newOmbor = {
              name: "",
              address: "",
            };
            this.get();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      this.$emit("setloading", true);
      updateWarehouse(data)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[1].click();
          success().then(() => {
            this.get();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>

<style scoped>
.list-group-item {
  font-size: 15px;
}

.list-group.sub {
  width: 100%;
}
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 80vh;
}
</style>