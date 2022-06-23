<template>
  <div>
    <a-button v-if="isStart" type="primary" @click="pauseTime">{{
      pauseStatus
    }}</a-button>
    <a-button type="danger" @click="stopTime">结束</a-button>
    <a-button type="danger" @click="resetTime">重置</a-button>
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
  console.log(isPause.value);
  emit("pause", isPause.value);
};
const stopTime = () => {
  console.log(isStop.value);
  isStop.value = true;
  emit("stop", isStop.value);
};

const resetTime = () => {
  console.log(isReset.value);
  isReset.value = true;
  emit("reset", isReset.value);
};
</script>
<style lang="scss" scoped></style>
