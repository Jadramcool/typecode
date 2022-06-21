<template>
  <div
    class="card mx-auto w-80 h-1/2 bg-white bg-opacity-25 rounded-xl shadow-md py-10"
  >
    <div class="avatar text-center">
      <a-avatar :size="64" src="https://joeschmoe.io/api/v1/random" />
    </div>

    <div class="title text-center">
      <h1 v-if="cardType === 'login'" class="text-2xl">Hello,Jadram!</h1>
      <h1 v-else class="text-2xl">Start</h1>
    </div>
    <div class="input w-4/5 mx-auto">
      <a-input
        v-if="cardType != 'login'"
        class="username"
        size="large"
        v-model:value="user.user.username"
        placeholder="Basic usage"
      />
      <a-input
        class="email"
        size="large"
        v-model:value="user.user.email"
        placeholder="Basic usage"
      />
      <a-input
        class="password"
        size="large"
        v-model:value="user.user.password"
        placeholder="Basic usage"
      />
    </div>
    <div class="btn text-center my-4">
      <a-button
        v-if="cardType === 'login'"
        class="w-2/3"
        type="primary"
        shape="round"
        size="default"
        @click="loginType"
      >
        登录
      </a-button>
      <a-button
        v-else
        class="w-2/3"
        shape="round"
        size="default"
        @click="registerType"
      >
        注册
      </a-button>
    </div>
    <div class="switch text-center mt-10">
      <span>
        {{ cardType === "login" ? tips[0][0] : tips[1][0] }}
        <span
          @click="clickTap"
          class="text-pink-500 hover:text-blue-500 cursor-pointer"
        >
          {{ cardType === "login" ? tips[0][1] : tips[1][1] }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, getCurrentInstance } from "vue";
import { login, register } from "@/api/login";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
import router from "../../../routes/routes";

const store = mainStore();
const { email: storeEmail } = storeToRefs(store);
const props = defineProps({
  cardType: {
    type: String,
  },
});
const user = reactive({
  user: {
    username: "",
    email: storeEmail.value,
    password: "123456",
  },
});

const tips = reactive([
  ["你竟然发现了管理员的通道？", "赶快注册！"],
  ["听说你有号号了？", "立即登录！"],
]);

let type = props.cardType;
// 子传父
const emit = defineEmits(["switch"]);
const clickTap = () => {
  console.log(type);
  console.log(props.cardType);
  if (type === "login") {
    type = "register";
  } else {
    type = "login";
  }
  emit("switch", type);
};

const loginType = async () => {
  const res = await login(user);
  store.setToken(res.token);
  store.setUser(res);
  router.push("/");
};

const registerType = async () => {
  store.email = user.user.email;
  const res = await register(user);
  clickTap();
  //   router.push('/')
};
</script>
<style lang="scss" scoped>
.card {
  z-index: 10;
  .input {
    .email,
    .password {
      margin: 5px 0;
    }
  }
}
</style>
