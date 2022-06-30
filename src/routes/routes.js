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
  {
    path: "/",
    component: () => import("../views/layout.vue"),
    children: [
      {
        path: "/",
        component: Home,
        meta: { title: "Home" },
      },
      {
        path: "/resultPage",
        name: "resultPage",
        component: () => import("../views/result/resultPage.vue"),
        meta: { title: "resultPage" },
      },
      {
        path: "/resultList",
        name: "resultList",
        component: () => import("../views/resultList/resultList.vue"),
        meta: { title: "resultList" },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/login.vue"),
    meta: { title: "login" },
  },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

//导出router
export default router;
