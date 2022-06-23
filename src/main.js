import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./routes/routes.js";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // import locale
import Duration from "dayjs/plugin/Duration";
// ant 的全局消息提示
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css"; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib

const app = createApp(App);
// dayjs设置中国地区
dayjs.locale("zh-cn"); // use locale
dayjs.extend(Duration);
app.config.globalProperties.dayjs = dayjs;
app.config.globalProperties.message = message;

app.use(createPinia());
app.use(router);
app.mount("#app");
