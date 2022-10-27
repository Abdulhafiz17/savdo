<template>
  <div class="bar">
    <h5>Buyurtmalar</h5>
    <div class="insider">
      <button
        v-for="(order, index) in orders"
        :key="order"
        class="btn btn-sm order"
      >
        <button
          class="delete"
          @click="$emit('deleteOrder', index); deleteOrder(order.id)"
        >
          <span class="fa fa-xmark"/>
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="$emit('setUp', index)"
        >
          <span class="fa fa-box" /><br />
          {{ order.number }} - buyurtma
        </button>
      </button>
    </div>
  </div>
</template>

<script>
import { orderDelete } from '@/components/Api/Api';
export default {
  name: "Orders",
  data() {
    return {
      orders: JSON.parse(localStorage.getItem("orders"))
    }
  },
  mounted() {},
  methods: {
    deleteOrder(data) {
      if (this.orders.length > 1) {
        orderDelete(data)
        .then((Response) => {})
        for (let i = 0; i < this.orders.length; i++) {
          if (this.orders[i].id == data) {
            this.orders.splice(i, 1)
          }
        }
      }
    },
  },
};
</script>

<style>
.bar {
  position: fixed;
  width: 80%;
  top: 9%;
  left: 10%;
  right: 10%;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 4px;
  background: white;
  box-shadow: 1px 5px 20px -1px rgb(0, 0, 0, 0.5);
}

@media (max-width: 480px) {
  .bar {
      top: 18%;
  }
}

.insider {
  display: flex;
  overflow: auto;
  padding: 5px;
  gap: 10px;
}

.dark .bar {
  background: var(--dark);
}

.order {
  position: relative;
}

.delete {
  position: absolute;
  top: 7px;
  right: 10px;

  background: none;
  outline: none;
  border: 1px solid red;
  border-radius: 50%;
  color: red;
  font-size: 10px;
  transition: 0.3s;
}
.delete:hover {
  background: red;
  color: black;
}
</style>