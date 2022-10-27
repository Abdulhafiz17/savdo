<template>
  <h3><i class="fa fa-code-branch" /> Do'konlar</h3>
  <div class="row">
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4 my-1">
      <!-- <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-append">
          <button
            class="btn btn-block btn-outline-secondary"
            data-toggle="modal"
            data-target="#filialAdd"
          >
            <span class="fa fa-circle-plus" />
          </button>
        </div>
      </div> -->
    </div>
    <div class="col-md-4 my-1"></div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in filter" :key="item">
        <div class="card shadow">
          <div class="card-image">
            <img
              v-if="
                logos.find((logo) => {
                  return logo.source == item.id;
                })
              "
              :src="
                'https://adidas.crud.uz/photos/' +
                logos.find((logo) => {
                  return logo.source == item.id;
                }).logo
              "
              :alt="
                'https://adidas.crud.uz/photos/' +
                logos.find((logo) => {
                  return logo.source == item.id;
                }).logo
              "
            />
          </div>
          <div class="card-body">
            <h4>{{ item.name }}</h4>
            <hr />
            <ul class="list-group">
              <!-- <li class="list-group-item" v-if="item.balances.length">
                <span
                  v-for="balance in item.balances"
                  :key="balance"
                  :class="balance.balance >= 0 ? 'text-success' : 'text-danger'"
                >
                  {{ Intl.NumberFormat().format(balance.balance) }}
                  {{ balance.currency ? balance.currency.currency : "" }}
                </span>
              </li>
              <li class="list-group-item" v-else>
                <i class="fa fa-money-bill" />
                <span>0</span>
              </li> -->
              <li class="list-group-item">
                <i class="fa fa-location-dot" /> {{ item.address }}
              </li>
              <a class="list-group-item" :href="`tel:+998${item.phone}`">
                <i class="fa fa-phone" /> +998{{ item.phone }}
              </a>
            </ul>
            <div class="row my-1">
              <div class="col my-1">
                <router-link
                  :to="`/statistic/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-success"
                >
                  <i class="fa fa-chart-line" />
                </router-link>
              </div>
              <div class="col my-1">
                <router-link
                  :to="`/hodimlar/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-primary"
                >
                  <i class="fa fa-user-group" />
                </router-link>
              </div>
              <div class="col my-1">
                <router-link
                  :to="`/filial/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-secondary"
                >
                  <i class="fa fa-history" />
                </router-link>
              </div>
              <div class="col my-1">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="
                    editFilial = item;
                    filial_currency = item.trade_currency;
                  "
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

  <div class="modal fade" id="filialAdd">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filial qo'shish</h4>
        </div>
        <form @submit.prevent="post(yangiFilial)">
          <div class="modal-body">
            <div class="row gap-1">
              <label class="col-md-12">
                Nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="nomi"
                  required
                  v-model="yangiFilial.name"
                />
              </label>
              <label class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="yangiFilial.phone"
                  />
                </div>
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="yangiFilial.address"
                />
              </label>
              <label class="col-md-12">
                Joylashuv
                <div class="row">
                  <div class="col-md-6">
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="kenglik"
                      required
                      v-model="yangiFilial.map_lat"
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="uzunlik"
                      required
                      v-model="yangiFilial.map_long"
                    />
                  </div>
                </div>
              </label>
              <label class="col-md-12">
                <div class="row my-1">
                  <div class="col-md-6 mb-1">
                    Valyuta
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="yangiFilial.trade_currency"
                      @click="getCurrencies()"
                    >
                      <option disabled value="">valyuta</option>
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-1">
                    Shrift
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="yangiFilial.font"
                    >
                      <option disabled value="">Font</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Segeo Print">Segeo Print</option>
                    </select>
                  </div>
                  <label class="col-md-6 mb-1">
                    Shrift ranggi
                    <input
                      class="form-control form-control-sm"
                      type="color"
                      required
                      v-model="yangiFilial.colour"
                    />
                  </label>
                  <label class="col-md-6 mb-1">
                    Hoshiyalar ranggi
                    <input
                      class="form-control form-control-sm"
                      type="color"
                      required
                      v-model="yangiFilial.colour2"
                    />
                  </label>
                </div>
              </label>
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
          <h4>{{ editFilial.name }}</h4>
        </div>
        <form @submit.prevent="put(editFilial)">
          <div class="modal-body">
            <div class="row gap-1">
              <label class="col-md-12">
                Nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="nomi"
                  required
                  v-model="editFilial.name"
                />
              </label>
              <label class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="editFilial.phone"
                  />
                </div>
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="editFilial.address"
                />
              </label>
              <label class="col-md-12">
                Joylashuv
                <div class="row">
                  <div class="col-md-6">
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="kenglik"
                      required
                      v-model="editFilial.map_lat"
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      class="form-control form-control-sm"
                      type="text"
                      placeholder="uzunlik"
                      required
                      v-model="editFilial.map_long"
                    />
                  </div>
                </div>
              </label>
              <label class="col-md-12">
                <div class="row">
                  <div class="col-md-6 mb-1">
                    Valyuta
                    <select
                      class="form-select form-select-sm"
                      :required="currencies.length"
                      v-model="editFilial.trade_currency"
                      @click="getCurrencies()"
                    >
                      <option disabled value="">valyuta</option>
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-1">
                    Shrift
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="editFilial.font"
                    >
                      <option disabled value="">Font</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Segeo Print">Segeo Print</option>
                    </select>
                  </div>
                  <label class="col-md-6 mb-1">
                    Shrift ranggi
                    <input
                      class="form-control form-control-sm"
                      type="color"
                      required
                      v-model="editFilial.colour"
                    />
                  </label>
                  <label class="col-md-6 mb-1">
                    Hoshiyalar ranggi
                    <input
                      class="form-control form-control-sm"
                      type="color"
                      required
                      v-model="editFilial.colour2"
                    />
                  </label>
                </div>
              </label>
              <label class="col-md-12">
                <input class="form-control form-control-sm" type="file" />
              </label>
              <span
                v-if="
                  logos.find((logo) => {
                    return logo.source == editFilial.id;
                  })
                "
              >
                <img
                  :src="
                    'https://adidas.crud.uz/photos/' +
                    logos.find((logo) => {
                      return logo.source == editFilial.id;
                    }).logo
                  "
                  :alt="
                    'https://adidas.crud.uz/photos/' +
                    logos.find((logo) => {
                      return logo.source == editFilial.id;
                    }).logo
                  "
                />
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="
                    deleteImage(
                      logos.find((logo) => {
                        return logo.source == editFilial.id;
                      }).id
                    )
                  "
                >
                  <i class="far fa-circle-xmark" />
                </button>
              </span>
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
  branches,
  catchError,
  createBranch,
  createLogo,
  currencies,
  removeLogo,
  success,
  updateBranch,
} from "@/components/Api/Api";
import swal from "sweetalert";
export default {
  name: "Filiallar",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      currencies: [],
      logos: [],
      branches: [],
      editFilial: {},
      filial_currency: null,
      yangiFilial: {
        name: null,
        phone: null,
        map_long: null,
        map_lat: null,
        address: null,
        colour: "#ffffff",
        colour2: "#00aaff",
        font: null,
        trade_currency: "",
      },
    };
  },
  created() {
    this.get();
    this.locator();
  },
  computed: {
    filter: function () {
      return this.branches.filter((branch) => {
        return branch.name.toLowerCase().match(this.search.toLowerCase());
      });
    },
  },
  methods: {
    get() {
      this.$emit("setloading", true);
      branches()
        .then((Response) => {
          this.branches = Response.data.branch;
          this.logos = Response.data.logos;
          this.getCurrencies();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      createBranch(data)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[0].click();
          success().then(() => {
            this.yangiFilial = {
              name: null,
              phone: null,
              map_long: null,
              map_lat: null,
              address: null,
              colour: "#000000",
              font: null,
              trade_currency: "",
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
      if (data.trade_currency !== this.filial_currency) {
        swal({
          icon: "warning",
          title:
            "Ushbu filialda valyuta o'zgardi. Agar tasdiqlasangiz barcha hisob-kitoblar va mahsulotlar valyutasi o'zgartiriladi",
          closeOnClickOutside: false,
          closeOnEsc: false,
          buttons: {
            confirm: true,
            cancel: true,
          },
        }).then((value) => {
          if (value) {
            this.$emit("setloading", true);
            let image = document.querySelector("[type='file']").files[0];
            let formData = new FormData();
            formData.append("file", image);
            Number(data.phone);
            updateBranch(data)
              .then((Response) => {
                if (image) {
                  this.postImage(data, formData);
                } else {
                  document.querySelectorAll("[data-dismiss]")[1].click();
                  success().then(() => {
                    this.get();
                  });
                }
              })
              .catch((error) => {
                this.$emit("setloading", false);
                catchError(error);
              });
          }
        });
      } else {
        this.$emit("setloading", true);
        let image = document.querySelector("[type='file']").files[0];
        let formData = new FormData();
        formData.append("file", image);
        Number(data.phone);
        updateBranch(data)
          .then((Response) => {
            if (image) {
              this.postImage(data, formData);
            } else {
              document.querySelectorAll("[data-dismiss]")[1].click();
              success().then(() => {
                this.get();
              });
            }
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      }
    },
    postImage(data, image) {
      createLogo(data, image)
        .then((Response) => {
          document.querySelectorAll("[data-dismiss]")[1].click();
          success().then(() => {
            // document.querySelector("[type='file']").files[0] = null;
            this.get();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deleteImage(id) {
      removeLogo(id)
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
    locator() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.yangiFilial.map_lat = position.coords.latitude;
            this.yangiFilial.map_long = position.coords.longitude;
          },
          (error) => {
            console.log(error.message);
          }
        );
      }
    },
  },
};
</script>

<style scoped>
input[type="color"] {
  display: block;
  width: 100%;
}

.card {
  height: 100%;
}

.card-image {
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}

.card-image img {
  width: 40%;
  object-fit: contain;
}

.modal-body span img {
  width: 20%;
}
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 80vh;
}
</style>