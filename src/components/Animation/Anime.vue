<template>
  <div class="page-loader">
    <div id="loader"></div>
  </div>
</template>

<script>
export default {
  name: "isloading",
  // data() {
  //   return {
  //     isloading: false
  //   }
  // },
  mounted() {},
};
</script>

<style scoped>
.page-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(3px);
  z-index: 10000;
  cursor: progress;
}

#loader {
  position: absolute;
  z-index: 1;
  width: 130px;
  height: 130px;
  border: 10px double rgb(0, 0, 0, 0.7);
  border-block: 10px solid rgb(0, 0, 0, 0.7);
  border-radius: 50%;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

.dark #loader {
  border: 10px double rgb(211, 211, 211, 0.5);
  border-block: 10px solid rgb(211, 211, 211, 0.5);
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Add animation to "page content" */
.animate-bottom {
  position: relative;
  -webkit-animation-name: animatebottom;
  -webkit-animation-duration: 1s;
  animation-name: animatebottom;
  animation-duration: 1s;
}

@-webkit-keyframes animatebottom {
  from {
    bottom: -100px;
    opacity: 0;
  }
  to {
    bottom: 0px;
    opacity: 1;
  }
}

@keyframes animatebottom {
  from {
    bottom: -100px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
}
</style>