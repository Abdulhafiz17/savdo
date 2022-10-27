<template>
  <div class="button">
    <button
      class="btn btn-outline-warning"
      @click="
        notification = !notification;
      "
    >
      <span class="fa fa-bell fa-shake" />
    </button>
  </div>
  <div class="notification shadow" id="notification" v-if="notification">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum ratione
    quo, commodi, dolorem laudantium corrupti quaerat magnam nostrum accusamus
    reiciendis odit dicta mollitia deserunt pariatur sapiente placeat, possimus
    iusto. Laboriosam non corporis quasi ipsam? Non nostrum ducimus minima, a
    aliquid soluta ipsam commodi excepturi quasi fugiat vel adipisci unde culpa
    repellendus? Laborum quod, omnis voluptates nam possimus iusto, recusandae
    ab quae cum ad deserunt animi eum voluptatem autem alias odit asperiores
    rerum. Aliquam veritatis delectus, quisquam similique atque, rem a adipisci
    inventore, ut quis et repellendus. Fugiat nesciunt inventore ipsam possimus,
    maiores placeat, incidunt exercitationem, voluptas ad corporis pariatur!
    Eligendi.
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      notification: false,
    };
  },
  methods: {},
};
</script>

<style scoped>
.button {
  position: absolute;
  top: 2%;
  right: 2%;
}
.notification {
  position: absolute;
  top: 8%;
  right: 2%;
  width: 400px;
  max-height: 500px;
  user-select: none;
  z-index: 1;
  overflow: auto;
  transition: 0.5s;

  padding: 10px;
  border: 2px solid gray;
  border-radius: 5px;
  background: rgb(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}
.dark .notification {
  background: rgb(63, 68, 73, 0.9);
}
</style>