<template>
  <div>
    <!-- <a-list item-layout="horizontal" :data-source="wordLine" class="list w-1/2">
      <template #renderItem="{ item }">
        <a-list-item
          ><span class="word_line text-left text-lg">
            {{ item }}
          </span></a-list-item
        >
        <a-list-item
          ><a-input
            v-model:value="inputValue"
            size="large"
            placeholder="large size"
        /></a-list-item>
      </template>
    </a-list> -->
    <a-list item-layout="horizontal" :data-source="wordLine" class="list w-1/2">
      <template #renderItem="{ item }">
        <a-list-item
          ><span class="word_line text-left">
            {{ item }}
          </span></a-list-item
        >
      </template>
    </a-list>
    <div class="input_body w-1/2">
      <a-textarea
        class="input_area"
        v-model:value="inputValue"
        size="large"
        placeholder="large size"
        :rows="wordLine.length"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
onMounted(() => {
  cutWord();
  combineWordLine(20);
});

let data = ref(
  "黑龙江省是冰灯的发源地，早期的冰灯是松嫩平原的农民和松花江流域的渔民冬季的照明工具。主要的制作过程是，把水倒入桶中进行冷冻形成桶状冰坨，再倒出中间未冻的清水，形成中空的“灯罩”，将灯（主要是油灯或蜡烛）放入，便不会被寒风吹灭。后来，人们在春节和元宵节期间也制做冰灯摆在门前，或烫孔穿绳让孩子提着玩，用以增加节日气氛，即形成了民间艺术的雏形。"
);

let inputValue = ref("");

let word = reactive([]);
let wordLine = reactive([]);

let offset = ref(0);

const cutWord = () => {
  for (let i = 0; i < data.value.length; i++) {
    word[i] = data.value[i];
  }
  console.log(word);
};

const combineWordLine = (wordage) => {
  const maxLine = word.length / wordage + 1;
  for (let i = 0; i < maxLine; i++) {
    wordLine[i] = word.slice(wordage * i, wordage * (i + 1)).join("");
  }
  console.log(wordLine);
};
</script>
<style lang="scss">
.list {
  margin: 10px auto;
  font-size: 22px;
}
.input_body {
  margin: 10px auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.input_area {
  background: none;
  font-size: 22px;
}

.ant-list-item {
  height: 100px;
}

textarea.ant-input {
  line-height: 100px !important;
}

.ant-list-item {
  padding: 0 11px 50px 11px;
}
</style>
