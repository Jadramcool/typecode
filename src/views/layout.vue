<template>
  <a-layout class="layout">
    <a-layout-header class="fixed top-0 left-0 right-0 z-50">
      <div class="logo" />
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1" @click="jumpPage(1)">打字练习</a-menu-item>
        <a-menu-item key="2" @click="jumpPage(2)">打字成绩</a-menu-item>
        <a-menu-item key="3" @click="jumpPage(3)">成绩统计</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 64px 50px 0 50px" class="bodys">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      工信部备案：苏ICP备2022016795号-1
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import router from "@/routes/routes";
const route = useRoute();
const jumpPage = (key) => {
  if (key === 1) {
    router.push("/");
    console.log(key);
  } else if (key === 2) {
    console.log(key);
    router.push("/resultPage");
  }
};
</script>
<style lang="scss" scoped>
.bodys {
  min-height: calc(100vh - 70px);
}
</style>
