import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // import locale
const app = createApp(App);
import Duration from "dayjs/plugin/Duration";
// dayjs设置中国地区
dayjs.locale("zh-cn"); // use locale
dayjs.extend(Duration);
app.config.globalProperties.dayjs = dayjs;

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.mount("#app");
