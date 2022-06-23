<template>
  <div class="ml-10">
    <span class="font-bold">控制按钮：</span>
    <div class="my-2">
      <a-button class="mx-2" type="danger" @click="stopTime">结束</a-button>
      <a-button class="mx-2" type="danger" @click="resetTime">重置</a-button>
      <a-button class="mx-2" v-if="isStart" type="primary" @click="pauseTime">{{
        pauseStatus
      }}</a-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";

const props = defineProps({
  isStart: {
    type: Boolean,
  },
});
const emit = defineEmits(["pause", "stop", "reset"]);
const isPause = ref(false);
const isStop = ref(false);
const isReset = ref(false);
let pauseStatus = ref("暂停");
const pauseTime = () => {
  isPause.value = !isPause.value;
  if (isPause.value) {
    pauseStatus.value = "开始";
  } else {
    pauseStatus.value = "暂停";
  }
  emit("pause", isPause.value);
};
const stopTime = () => {
  isStop.value = true;
  emit("stop", isStop.value);
};

const resetTime = () => {
  isReset.value = true;
  emit("reset", isReset.value);
};
</script>
<style lang="scss" scoped></style>
