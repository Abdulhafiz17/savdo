<template>
  <h3><span class="fa fa-folder" /> Kategoriyalar</h3>
  <div class="row" v-if="balance">
    <div class="col-md-6 d-flex align-items-center justify-content-center">
      <div class="dropdown">
        <button
          class="btn btn-sm btn-outline-secondary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
        >
          {{ balance.quantity_data[0].total_quantity + " dona mahsulot" }}
        </button>
        <ul class="dropdown-menu">
          <li
            class="dropdown-item"
            v-for="item in balance.articul_data"
            :key="item"
          >
            {{ item.articul + " - " + item.total_quantity_articul + " dona" }}
          </li>
        </ul>
      </div>
    </div>
    <div class="col-md-6 d-flex align-items-center justify-content-center">
      <span>
        Umumiy narx
        <br />
        <span v-for="(item, index) in balance.price_data" :key="item">
          {{
            Intl.NumberFormat().format(item.total_price) +
            " " +
            item.currency +
            (index !== balance.price_data.length - 1 ? ", " : "")
          }}
          <br />
        </span>
      </span>
    </div>
  </div>
  <hr />

  <div class="responsive" style="max-height: 75vh; overflow-x: hidden">
    <div class="row">
      <div class="col-sm-12 my-1">
        <details v-for="item in categories" :key="item">
          <summary @click="getProducts(item.Categories, 0, 50)">
            <h5>{{ item.Categories.name }}</h5>
          </summary>
          <div class="table-responsive">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Artikul</th>
                  <th>Shtrix kod</th>
                  <th>Miqdor</th>
                  <th>O'lcham</th>
                  <th>Narx</th>
                  <th>Oxirgi narx</th>
                  <th>Sotuv narx</th>
                  <th>Vetrina narx</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item2 in item.Categories.products" :key="item2">
                  <td>{{ item2.Products.articul }}</td>
                  <td>{{ item2.Products.code }}</td>
                  <td>{{ item2.sum_quantity }} dona</td>
                  <td>{{ item2.Products.size }}</td>
                  <td>
                    {{ Intl.NumberFormat().format(item2.Products.price) }}
                    {{ item2.Currencies ? item2.Currencies.currency : "none" }}
                  </td>
                  <td>
                    {{ Intl.NumberFormat().format(item2.Products.oxirgi_narx) }}
                    {{
                      item2.Products.currency_savdo
                        ? item2.Products.currency_savdo.currency
                        : "none"
                    }}
                  </td>
                  <td>
                    {{ Intl.NumberFormat().format(item2.Products.sotuv_narx) }}
                    {{
                      item2.Products.currency_savdo
                        ? item2.Products.currency_savdo.currency
                        : "none"
                    }}
                  </td>
                  <td>
                    {{
                      Intl.NumberFormat().format(item2.Products.vitrina_narx)
                    }}
                    {{
                      item2.Products.currency_savdo
                        ? item2.Products.currency_savdo.currency
                        : "none"
                    }}
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-warning"
                        data-toggle="modal"
                        data-target="#editProduct"
                        @click="editProduct = item2"
                      >
                        <i class="far fa-edit" />
                      </button>
                      <button
                        class="btn btn-outline-success"
                        data-toggle="modal"
                        data-target="#addImage"
                        @click="
                          product = item2;
                          getPhoto(product);
                        "
                      >
                        <i class="fa fa-image" />
                      </button>
                      <button
                        class="btn btn-outline-primary"
                        data-toggle="modal"
                        data-target="#price_tag"
                        @click="createBarcode(item2)"
                      >
                        <i class="fa fa-barcode" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="9">
                    <div class="input-group input-group-sm">
                      <button
                        class="btn btn-sm"
                        @click="getProducts(item.Categories, 0, limit)"
                        :disabled="page == 0"
                      >
                        <i class="fa fa-angle-double-left" />
                      </button>
                      <button
                        class="btn btn-sm"
                        @click="getProducts(item.Categories, page - 1, limit)"
                        :disabled="page == 0"
                      >
                        <i class="fa fa-angle-left" />
                      </button>
                      <button class="btn btn-sm">
                        {{ page + 1 }}
                      </button>
                      <button
                        class="btn btn-sm"
                        @click="getProducts(item.Categories, page + 1, limit)"
                        :disabled="page == pages - 1 || pages == 0"
                      >
                        <i class="fa fa-angle-right" />
                      </button>
                      <button
                        class="btn btn-sm"
                        @click="getProducts(item.Categories, pages - 1, limit)"
                        :disabled="page == pages - 1 || pages == 0"
                      >
                        <i class="fa fa-angle-double-right" />
                      </button>
                      <div class="input-group-append">
                        <select
                          class="form-select form-select-sm"
                          v-model="limit"
                          @change="getProducts(item.Categories, page, limit)"
                        >
                          <option disabled value="">limit</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </div>
      <div class="col-sm-12" v-if="categories.length">
        <div class="input-group input-group-sm">
          <button
            class="btn btn-sm"
            @click="get(0, limit)"
            :disabled="page == 0"
          >
            <i class="fa fa-angle-double-left" />
          </button>
          <button
            class="btn btn-sm"
            @click="get(page - 1, limit)"
            :disabled="page == 0"
          >
            <i class="fa fa-angle-left" />
          </button>
          <button class="btn btn-sm">
            {{ page + 1 }}
          </button>
          <button
            class="btn btn-sm"
            @click="get(page + 1, limit)"
            :disabled="page == pages - 1 || pages == 0"
          >
            <i class="fa fa-angle-right" />
          </button>
          <button
            class="btn btn-sm"
            @click="get(pages - 1, limit)"
            :disabled="page == pages - 1 || pages == 0"
          >
            <i class="fa fa-angle-double-right" />
          </button>
          <div class="input-group-append">
            <select
              class="form-select form-select-sm"
              v-model="limit"
              @change="get(page, limit)"
            >
              <option disabled value="">limit</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="editProduct">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Mahsulot narxini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editProduct)">
          <div class="modal-body" v-if="editProduct">
            <div class="row my-1">
              <label class="col-md-6">
                <input type="radio" v-model="edit_type" value="0" />
                Faqat ushbu o'lcham uchun
              </label>
              <label class="col-md-6">
                <input
                  type="radio"
                  v-model="edit_type"
                  :value="editProduct.Products.size"
                />
                Barcha o'lchamlar uchun
              </label>
            </div>
            <div class="row">
              <div class="col-md-12 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    :max="
                      editProduct.Products.sotuv_narx
                        ? editProduct.Products.sotuv_narx
                        : false
                    "
                    class="form-control"
                    required
                    v-model="editProduct.Products.oxirgi_narx"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ editProduct.Currencies.currency }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <div class="input-group-text">oxirgi narx</div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    :min="
                      editProduct.Products.oxirgi_narx
                        ? editProduct.Products.oxirgi_narx
                        : 0
                    "
                    :max="
                      editProduct.Products.vitrina_narx
                        ? editProduct.Products.vitrina_narx
                        : false
                    "
                    class="form-control"
                    required
                    v-model="editProduct.Products.sotuv_narx"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ editProduct.Currencies.currency }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <div class="input-group-text">sotuv narx</div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    :min="
                      editProduct.Products.sotuv_narx
                        ? editProduct.Products.sotuv_narx
                        : 0
                    "
                    class="form-control"
                    required
                    v-model="editProduct.Products.vitrina_narx"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      {{ editProduct.Currencies.currency }}
                    </div>
                  </div>
                  <div class="input-group-append">
                    <div class="input-group-text">oxirgi narx</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="price_tag">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div id="tag" v-if="product">
            <div id="tag_body">
              <span>
                {{ product.Products.articul }}
              </span>
              <span>
                <u>{{ product.Products.size }}</u>
              </span>
              <span>
                {{ Intl.NumberFormat().format(product.Products.vitrina_narx) }}
                {{ product.Products.currency_savdo.currency }}
              </span>
            </div>
            <div id="tag_barcode">
              <img id="barcode" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="printTag()">
            <i class="fa fa-print" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addImage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" v-if="product">
          <h4>{{ product.Products.articul }}</h4>
        </div>
        <form @submit.prevent="postPhoto(product)">
          <div class="modal-body">
            <input type="file" id="logo" class="form-control form-control-sm" />
            <div class="row">
              <div
                class="col-md-4 my-1"
                v-for="photo in product_photo"
                :key="photo"
              >
                <span
                  v-if="product && product_photo.length"
                  class="photo-viewer"
                >
                  <img
                    :src="`https://ClothingSalesProject-api.crud.uz/uploaded_files/${photo.logo}`"
                    :alt="photo.logo"
                    data-toggle="modal"
                    data-target="#mainPhoto"
                    @click="main_photo = photo.logo"
                  />
                  <i
                    class="fa fa-xmark fa-2x text-danger"
                    @click="removeLogo(product.Products.articul, photo.id)"
                  />
                  <!-- <i
                    class="fa fa-2x fa-angle-left"
                    v-if="product_index !== 0"
                    @click="product_index--"
                  />
                  <i
                    class="fa fa-2x fa-angle-right"
                    v-if="product_index !== product_photo.length - 1"
                    @click="product_index++"
                  /> -->
                </span>
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

  <div class="modal fade" id="mainPhoto">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <span v-if="main_photo" class="photo-viewer">
            <img
              :src="`https://adidas.crud.uz/photos/${main_photo}`"
              :alt="main_photo"
            />
          </span>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  categories,
  photo,
  productsSumPrice,
  removePhoto,
  success,
  updateProduct,
  uploadPhoto,
} from "@/components/Api/Api";
import JsBarcode from "jsbarcode";
export default {
  name: "Categories",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      page: 0,
      pages: 1,
      limit: 50,
      categories: [],
      category: {
        name: null,
      },
      editProduct: null,
      edit_type: 0,
      product: null,
      product_photo: [],
      product_index: 0,
      main_photo: null,
      balance: null,
    };
  },
  created() {
    this.getBalance(this.page, this.limit);
  },
  methods: {
    getBalance(page, limit) {
      this.$emit("setloading", true);
      productsSumPrice()
        .then((Response) => {
          this.balance = Response.data;
          this.get(page, limit);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    get(page, limit) {
      this.$emit("setloading", true);
      categories(0, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.categories = Response.data.data;
          this.categories.forEach((item) => {
            item.Categories.products = [];
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProducts(category, page, limit) {
      this.$emit("setloading", true);
      categories(category.id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          category.products = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    createBarcode(product) {
      this.product = product;
      setTimeout(() => {
        JsBarcode("#barcode", product.Products.code, {
          // format: "CODE128",
          width: 2,
          height: 20,
        });
      }, 100);
    },
    getPhoto(product) {
      // console.log(product)
      this.product_photo = [];
      photo(product.Products.articul)
        .then((Response) => {
          this.product_photo = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postPhoto(product) {
      this.$emit("setloading", true);
      let logo = document.querySelector("#logo").files[0];
      let formdata = new FormData();
      formdata.append("file", logo);
      uploadPhoto(product.Products.articul, formdata)
        .then((Response) => {
          // document.querySelector("#logo").files[0] = null;
          success(1).then(() => {
            this.$emit("setloading", false);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(product) {
      this.$emit("setloading", true);
      let data = {
        vitrina_narx: product.Products.vitrina_narx,
        sotuv_narx: product.Products.sotuv_narx,
        oxirgi_narx: product.Products.oxirgi_narx,
      };
      updateProduct(product.Products.code, this.edit_type, data)
        .then((Response) => {
          success(0).then(() => {
            this.getBalance(0, 100);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    removeLogo(articul, id) {
      this.$emit("setloading", true);
      removePhoto(articul, id)
        .then((Response) => {
          success(1).then(() => {
            this.$emit("setloading", false);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    printTag() {
      let tag = document.querySelector("#tag").outerHTML;
      const winPrint = window.open("", "", "");
      // winPrint.document.write(
      //   `
      //     <style>
      //       body {
      //         margin: 5px
      //       }
      //       #tag {
      //         width: 4.2cm;
      //         height: 5.5cm;
      //         color: black;
      //         background: white;
      //         text-align: center;
      //       }
      //       #tag_body {
      //         min-height: 50%;
      //         max-height: 65%;
      //         display: flex;
      //         justify-content: center;
      //         flex-wrap: wrap;
      //         align-items: center;
      //         text-align: center;
      //       }
      //       #tag_body span {
      //         display: block;
      //         width: 100%;
      //       }
      //       #barcode {
      //         border: 1px dotted black;
      //       }
      //     </style>
      //     </body>
      //   `
      // );
      // winPrint.document.write(`${tag}`);
      // winPrint.document.write(`</body>`)
      winPrint.document.querySelector("head").innerHTML = `
          <style>
            body {
              margin: 0;
            }
            #tag {
              position: relative;
              display: block;
              width: 5.8cm;
              height: 3cm;
              color: black;
              background: white;
              text-align: center;
              }
            #tag_body {
              position: absolute;
              top: 0;
              width: 5.8cm;
              height: 1cm;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              text-align: center;
            }
            #tag_body span {
              padding: 2px;
              font-size: 12px !important;
            }
            #tag_barcode {
              position: absolute;
              bottom: 0;
              width: 5.8cm;
              height: 2cm;
            }
          </style>
          </body>
        `;
      winPrint.document.querySelector("body").innerHTML = tag;
      winPrint.print();
    },
  },
};
</script>

<style scoped>
.input-group {
  display: flex;
  justify-content: center;
}
#price_tag .modal-body {
  display: flex;
  justify-content: center;
}
#tag {
  position: relative;
  display: block;
  width: 5.8cm;
  height: 3cm;
  color: black;
  background: white;
  text-align: center;
  }
#tag_body {
  position: absolute;
  top: 0;
  width: 5.8cm;
  height: 1cm;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
}
#tag_body span {
  padding: 2px;
  font-size: 12px !important;
}
#tag_barcode {
  position: absolute;
  bottom: 0;
  width: 5.8cm;
  height: 2cm;
}

.modal-body .row {
  overflow-x: hidden;
  overflow-y: auto;
}
.modal-body .photo-viewer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.3s all;
}
.modal-body .photo-viewer:hover {
  box-shadow: 0 1px 15px 5px rgb(0, 0, 0, 0.3);
}
.modal-body .photo-viewer img {
  width: 100%;
}

.photo-viewer .fa.fa-xmark {
  position: absolute;
  top: 0;
  right: 2%;
  transition: 0.2s;
}
.photo-viewer .fa.fa-xmark:hover {
  color: red !important;
}
.photo-viewer .fa-angle-left,
.photo-viewer .fa-angle-right {
  cursor: pointer;
  position: absolute;
  top: 40%;
}
.photo-viewer .fa-angle-left {
  left: 1%;
}
.photo-viewer .fa-angle-right {
  right: 1%;
}

.dropdown-menu {
  max-height: 60vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>