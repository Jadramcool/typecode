<template>
  <div class="login-body my-gradient">
    <Card v-if="isShow" @switch="switchCard" :cardType="cardType[0]"></Card>
    <Card v-if="!isShow" @switch="switchCard" :cardType="cardType[1]"></Card>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import Card from "./modules/card.vue";
const cardType = reactive(["login", "register"]);
// 控制登录/注册显示  true 显示登录   false 显示注册
const isShow = ref(true);
// 接受子组件传参，确定显示登录或者注册
const switchCard = (type) => {
  if (type === "login") {
    isShow.value = true;
  } else {
    isShow.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import url("../../assets/css/beautiful.scss");
.login-body {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
}

// @media screen and (max-width: 360px) {

// }
</style>
