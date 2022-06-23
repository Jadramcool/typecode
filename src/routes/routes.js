import Home from "../views/Home.vue";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  createMemoryHistory,
} from "vue-router";
import { mainStore } from "@/store/index";
/** @type {import('vue-router').RouterOptions['routes']} */
const routes = [
  { path: "/", component: Home, meta: { title: "Home" } },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/login.vue"),
    meta: { title: "login" },
  },
  {
    path: "/resultPage",
    name: "resultPage",
    component: () => import("../views/result/resultPage.vue"),
    meta: { title: "resultPage" },
  },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

//导出router
export default router;
