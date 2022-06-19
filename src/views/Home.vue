<template>
  <div>
    <div class="control">
      <div class="switch">
        是否展示拼音:<a-switch v-model:checked="isShowPinYin" />
      </div>
      <Upload></Upload>
    </div>

    <a-list item-layout="horizontal" :data-source="wordLine" class="list w-1/2">
      <template #renderItem="{ item, index }">
        <a-list-item>
          <div class="flex flex-col">
            <div v-if="isShowPinYin">
              <span
                class="pinyin_line text-left"
                v-for="(singleWord, lineIndex) in item.pp"
                :key="lineIndex"
                :class="
                  isTure[lineIndex + index * setLineNum] === 1
                    ? 'true'
                    : isTure[lineIndex + index * setLineNum] === 2
                    ? 'false'
                    : ''
                "
              >
                {{ singleWord }}
              </span>
            </div>
            <div>
              <span
                class="word_line text-left"
                v-for="(singleWord, lineIndex) in item.ww"
                :key="lineIndex"
                :class="
                  isTure[lineIndex + index * setLineNum] === 1
                    ? 'true'
                    : isTure[lineIndex + index * setLineNum] === 2
                    ? 'false'
                    : ''
                "
              >
                {{ singleWord }}
              </span>
            </div>
          </div>
        </a-list-item>
        <a-list-item
          ><a-input
            class="inputCom"
            :ref="(el) => (input[index] = el)"
            v-model:value="inputValue[index]"
            size="large"
            :bordered="false"
            @change="inputCode(index), startTime()"
            @keydown.delete="backSpace(index)"
            :placeholder="index"
            :disabled="
              totalNum === wordLength
                ? true
                : false || nowIndex === index
                ? false
                : true
            "
          />{{ totalNum }},{{ wordLength }}</a-list-item
        >
      </template>
    </a-list>
    <a-card title="计分板" class="result_card">
      <div class="card_body flex flex-col">
        <div class="time">{{ timeShow }}</div>
        <div class="accuracy">
          正确率:&emsp;<span>{{ accuracy }}</span
          >&emsp;%
        </div>
        <div class="errorNum">
          错&emsp;误:&emsp;<span>{{ errorNum }}</span
          >&emsp;字
        </div>
        <div class="backSpaceNum">
          退&emsp;格:&emsp;<span>{{ backSpaceNum }}</span
          >&emsp;次
        </div>
        <div class="totalNum">
          总字数:&emsp;<span>{{ totalNum }}</span
          >&emsp;字
        </div>
        <div class="wpm">
          速&emsp;度:&emsp;<span>{{ wpm }}</span
          >&emsp;wpm
        </div>
      </div>
    </a-card>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch, getCurrentInstance } from "vue";
import { Pinyin } from "../tool/ToolGood.Words.Pinyin.js";
import Upload from "./modules/upload.vue";
const { proxy } = getCurrentInstance();
onMounted(() => {
  cutWord(data.value, 0);
  getPinYin(data.value);
  combineWordLine(setLineNum.value);
});

let data = ref(
  "黑龙江省是冰灯的发源地，早期的冰灯是松嫩平原的农民和松花江流域的渔民冬季的照明工具。主要的制作过程是，把水倒入桶中进行冷冻形成桶状冰坨，再倒出中间未冻的清水，形成中空的“灯罩”，将灯（主要是油灯或蜡烛）放入，便不会被寒风吹灭。后来，人们在春节和元宵节期间也制做冰灯摆在门前，或烫孔穿绳让孩子提着玩，用以增加节日气氛，即形成了民间艺术的雏形。"
);
let pinyinList = reactive([]);

// let data = ref("123");
// input ref
let input = ref([]);
// 输入的内容
let inputValue = reactive([""]);
// 存储拆分后的文章
let word = reactive([]);
// 存储拆分后的文章的长度
let wordLength = ref(0);
// 存储输入后拆分的文章
let inputWord = reactive([]);
// 每一行显示的文章
let wordLine = reactive([]);
// 当前所在行
let nowIndex = ref(0);
// 设置一行显示多少字
let setLineNum = ref(20);
// 判断该字是否输入正确
let isTure = reactive([]);
// 正确率
let accuracy = ref("0");
// 正确数
let correctNum = ref(0);
// 错误数
let errorNum = ref(0);
// 退格数
let backSpaceNum = ref(0);
// 总字数
let totalNum = ref(0);
// 计时器
let timer;
// 每分钟打字数WPM
let wpm = ref(0);
// 计时器展示
let timeShow = ref("00:00");
// 是否展示拼音
let isShowPinYin = ref(false);

// 监听退格事件
const backSpace = (indexs) => {
  // 当输入内容不为空时，退格数加1
  if (inputValue[0].length != 0) {
    backSpaceNum.value++;
  }
  // 当该行内容为0，并且非第一行时，按下退格键，会自动定位至上一个输入框
  if (inputValue[indexs].length === 0 && indexs != 0) {
    nowIndex.value = indexs - 1;
    setTimeout(() => {
      input.value[nowIndex.value].focus();
    }, 0);
  }
};

// 监听输入事件
const inputCode = (indexs) => {
  if (inputValue[indexs].length >= setLineNum.value) {
    // 如果超过5字符，将超过部分分给下一个输入框
    inputValue[indexs + 1] = inputValue[indexs].slice(setLineNum.value);
    // 删除超出部分
    // inputValue[indexs] = inputValue[indexs].replace(
    //   inputValue[indexs].slice(setLineNum.value),
    //   ""
    // );
    // 去前setLineNum.value部分
    inputValue[indexs] = inputValue[indexs].slice(0, setLineNum.value);
    // console.log(inputValue[indexs]);
    // index表示当前所在行
    nowIndex.value = indexs + 1;
    // 自动切换输入框焦点
    setTimeout(() => {
      input.value[nowIndex.value].focus();
    }, 0);
  }
};
// 监听输入数据，大于设置数，则自动切换下一行
watch(inputValue, (newVal, oldVal) => {
  let result = inputValue.join("");
  cutWord(result, 1);
  contrast(word, inputWord);
  // 监听是否完成
  complete();
});

// 将文字拆分成单个数组
// type为0时拆分原文章，为1拆分输入的文章
const cutWord = (article, type) => {
  if (type === 0) {
    for (let i = 0; i < article.length; i++) {
      word[i] = article[i];
    }
    wordLength.value = word.length;
  } else {
    inputWord = [];
    for (let i = 0; i < article.length; i++) {
      inputWord[i] = article[i];
    }
    totalNum.value = inputWord.length;
  }
};

// 给每行赋值
const combineWordLine = (wordage) => {
  // 按照设置的每行字数，计算处所需多少行
  const maxLine = word.length / wordage;
  // 给每行赋值
  for (let i = 0; i < maxLine; i++) {
    // wordLine[i] = word.slice(wordage * i, wordage * (i + 1)).join("");
    let lineWord = word.slice(wordage * i, wordage * (i + 1)).join("");
    let linePinyin = pinyinList.slice(wordage * i, wordage * (i + 1));
    wordLine.push({
      ww: lineWord,
      pp: linePinyin,
    });
  }
};

const getPinYin = (words) => {
  let pinyin = new Pinyin();
  // 获取全拼
  for (let i = 0; i < words.length; i++) {
    pinyinList[i] = pinyin.GetPinyin(words[i], true);
  }
};

const contrast = (article, inputContent) => {
  correctNum.value = 0;
  errorNum.value = 0;
  for (let i = 0; i < inputContent.length; i++) {
    // 正确的输入
    if (article[i] === inputContent[i]) {
      isTure[i] = 1;
      correctNum.value++;
      // console.log(isTure[i]);
    }
    // 错误的输入
    else if (article[i] != inputContent[i]) {
      isTure[i] = 2;
      errorNum.value++;
      // console.log(inputContent[i], i);
    }
  }
  // 计算正确率
  if (totalNum.value != 0) {
    accuracy.value = ((correctNum.value / totalNum.value) * 100).toFixed(2);
  } else {
    accuracy.value = 0;
  }
  for (let j = inputContent.length; j < article.length; j++) {
    isTure[j] = 0;
  }
};
// 是否开始计时
// @change.once会触发两次，暂时不知道为什么，先用这种方法
let startTiming = ref(true);
// 开始计时
const startTime = () => {
  if (startTiming.value) {
    startTiming.value = false;
    let nowTime = new Date();
    timer = setInterval(() => {
      const now = timepiece(nowTime);
      wpm.value = ((correctNum.value / now.totalSec) * 60).toFixed(0);
      timeShow.value = now.time;
      // console.log(now);
    }, 1000);
  }
};
// 计时器
const timepiece = (nowTime) => {
  const diffTime = proxy.dayjs.duration(proxy.dayjs() - nowTime);
  // const day = diffTime.days(); //天
  // const hours = diffTime.hours(); //小时
  // const minutes = diffTime.minutes(); //分钟
  // const seconds = diffTime.seconds(); //秒
  // let time = `${minutes}:${seconds}`;

  let time = proxy.dayjs(diffTime.$ms).format("mm:ss");
  const totalSec = diffTime.$ms / 1000;
  return { time, totalSec };
};
// 监听是否完成，完成则结束计时器
const complete = () => {
  if (inputWord.length == word.length) {
    console.log("stop");
    console.log(wpm.value);
    clearInterval(timer);
  }
};
</script>
<style lang="scss">
.list {
  margin: 10px auto;
  .ant-list-item {
    display: flex;
    justify-content: flex-start;
    .pinyin_line {
      display: inline-block;
      font-size: 14px;
      width: 36px;
      text-align: center;
    }
    .word_line {
      display: inline-block;
      font-size: 22px;
      width: 36px;
      text-align: center;
    }
  }
}

.inputCom {
  padding: 0;
  padding-left: 6px;
  font-size: 22px;
  letter-spacing: 14px;
}

.true {
  color: rgb(55, 207, 55);
}

.false {
  color: red;
}

.result_card {
  width: 300px;
  position: fixed;
  top: 20px;
  right: 20px;
  .card_body {
    padding: 10px 30px;
    .time {
      font-size: 40px;
      font-weight: bold;
      color: rgb(245, 167, 27);
    }
    .accuracy,
    .errorNum,
    .backSpaceNum,
    .totalNum,
    .wpm {
      font-size: 20px;
      font-family: Arial, Helvetica, sans-serif;
    }
  }
}

// <div class="time">时间:{{ timeShow }}</div>
//         <div class="accuracy">正确率:{{ accuracy }}</div>
//         <div class="errorNum">错误数:{{ errorNum }}</div>
//         <div class="backSpaceNum">退格数:{{ backSpaceNum }}</div>
//         <div class="totalNum">总字数:{{ totalNum }}</div>
//         <div class="wpm">速度:{{ wpm }}</div>
</style>
